import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import GDPRConsent from "@/components/GDPRConsent";
import {
  Calendar, Clock, User, Building2, ArrowRight, ArrowLeft,
  CheckCircle2, Shield, Phone, Mail, FileText, Loader2,
  ChevronLeft, ChevronRight, AlertTriangle,
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Step = "type" | "date" | "time" | "details" | "confirm" | "success";

export default function BookConsultation() {
  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "",
    urgencyType: "", notes: "", gdprConsent: false,
  });
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Queries
  const { data: consultationTypes, isLoading: typesLoading } = trpc.booking.getConsultationTypes.useQuery();
  const { data: availableDates, isLoading: datesLoading } = trpc.booking.getAvailableDates.useQuery(
    { year: currentMonth.year, month: currentMonth.month, consultationTypeId: selectedType! },
    { enabled: !!selectedType }
  );
  const { data: timeSlots, isLoading: slotsLoading } = trpc.booking.getAvailableSlots.useQuery(
    { date: selectedDate!, consultationTypeId: selectedType! },
    { enabled: !!selectedDate && !!selectedType }
  );

  const bookMutation = trpc.booking.book.useMutation({
    onSuccess: (data) => {
      setBookingResult(data);
      setStep("success");
    },
  });

  const selectedTypeData = useMemo(
    () => consultationTypes?.find(t => t.id === selectedType),
    [consultationTypes, selectedType]
  );

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentMonth]);

  const isDateAvailable = (day: number) => {
    if (!availableDates) return false;
    const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDates.includes(dateStr);
  };

  const navigateMonth = (dir: 1 | -1) => {
    setCurrentMonth(prev => {
      let m = prev.month + dir;
      let y = prev.year;
      if (m > 12) { m = 1; y++; }
      if (m < 1) { m = 12; y--; }
      return { year: y, month: m };
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const handleBook = () => {
    if (!selectedType || !selectedDate || !selectedSlot) return;
    bookMutation.mutate({
      consultationTypeId: selectedType,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
      company: form.company || undefined,
      urgencyType: form.urgencyType || undefined,
      notes: form.notes || undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      source: "website",
    });
  };

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "type", label: "Service", icon: <FileText className="w-4 h-4" /> },
    { key: "date", label: "Date", icon: <Calendar className="w-4 h-4" /> },
    { key: "time", label: "Time", icon: <Clock className="w-4 h-4" /> },
    { key: "details", label: "Details", icon: <User className="w-4 h-4" /> },
    { key: "confirm", label: "Confirm", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const currentStepIdx = steps.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#00C3FF]/10 border border-[#00C3FF]/30 rounded-full px-4 py-1.5 mb-6">
            <Calendar className="w-4 h-4 text-[#00C3FF]" />
            <span className="text-[#00C3FF] text-sm font-medium">Free Consultation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Book Your Free Consultation
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Speak with a sponsor compliance specialist. Choose your consultation type, pick a time that works for you, and we'll handle the rest.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      {step !== "success" && (
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i < currentStepIdx ? "bg-[#00C3FF] text-white" :
                    i === currentStepIdx ? "bg-[#00C3FF] text-white ring-4 ring-[#00C3FF]/30" :
                    "bg-[#1B3A5C] text-gray-500"
                  }`}>
                    {i < currentStepIdx ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${
                    i <= currentStepIdx ? "text-[#00C3FF]" : "text-gray-500"
                  }`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-18px] transition-all duration-300 ${
                    i < currentStepIdx ? "bg-[#00C3FF]" : "bg-[#1B3A5C]"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="bg-[#0F2439] border border-[#1B3A5C] rounded-2xl overflow-hidden">

          {/* Step 1: Consultation Type */}
          {step === "type" && (
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2">What do you need help with?</h2>
              <p className="text-gray-400 mb-6">Select the type of consultation that best matches your needs.</p>
              {typesLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#00C3FF] animate-spin" /></div>
              ) : (
                <div className="grid gap-3">
                  {consultationTypes?.map(ct => (
                    <button
                      key={ct.id}
                      onClick={() => { setSelectedType(ct.id); setStep("date"); }}
                      className={`group text-left p-5 rounded-xl border transition-all duration-200 hover:border-[#00C3FF] hover:bg-[#00C3FF]/5 ${
                        selectedType === ct.id ? "border-[#00C3FF] bg-[#00C3FF]/10" : "border-[#1B3A5C] bg-[#0D1B2A]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ct.color || "#00C3FF" }} />
                            <h3 className="text-white font-semibold">{ct.name}</h3>
                          </div>
                          {ct.description && <p className="text-gray-400 text-sm ml-6">{ct.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 group-hover:text-[#00C3FF] transition-colors">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{ct.durationMinutes} min</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date Selection */}
          {step === "date" && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep("type")} className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">Pick a date</h2>
                  <p className="text-gray-400 text-sm">{selectedTypeData?.name} &middot; {selectedTypeData?.durationMinutes} min</p>
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-[#0D1B2A] rounded-xl border border-[#1B3A5C] p-5">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-[#1B3A5C] rounded-lg transition-colors text-gray-400 hover:text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-white font-semibold">{MONTHS[currentMonth.month - 1]} {currentMonth.year}</h3>
                  <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-[#1B3A5C] rounded-lg transition-colors text-gray-400 hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
                  ))}
                </div>

                {datesLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-[#00C3FF] animate-spin" /></div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, i) => {
                      if (day === null) return <div key={`empty-${i}`} />;
                      const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const available = isDateAvailable(day);
                      const isSelected = selectedDate === dateStr;
                      return (
                        <button
                          key={day}
                          disabled={!available}
                          onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); setStep("time"); }}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all duration-200 ${
                            isSelected ? "bg-[#00C3FF] text-white ring-2 ring-[#00C3FF]/50" :
                            available ? "text-white hover:bg-[#00C3FF]/20 hover:text-[#00C3FF] cursor-pointer" :
                            "text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-white/10" /> Available
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-700" /> Unavailable
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {step === "time" && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep("date")} className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">Choose a time</h2>
                  <p className="text-gray-400 text-sm">
                    {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    {" "}&middot; {selectedTypeData?.name}
                  </p>
                </div>
              </div>

              {slotsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#00C3FF] animate-spin" /></div>
              ) : timeSlots && timeSlots.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map(slot => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                            isSelected
                              ? "bg-[#00C3FF] text-white border-[#00C3FF]"
                              : "bg-[#0D1B2A] text-white border-[#1B3A5C] hover:border-[#00C3FF] hover:bg-[#00C3FF]/10"
                          }`}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSlot && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setStep("details")}
                        className="flex items-center gap-2 bg-[#00C3FF] hover:bg-[#00B0E6] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No available time slots for this date.</p>
                  <button onClick={() => setStep("date")} className="text-[#00C3FF] text-sm mt-2 hover:underline">
                    Choose another date
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Your Details */}
          {step === "details" && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep("time")} className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">Your details</h2>
                  <p className="text-gray-400 text-sm">Tell us about yourself so we can prepare for your consultation.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">First Name *</label>
                    <input
                      type="text" value={form.firstName}
                      onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Last Name *</label>
                    <input
                      type="text" value={form.lastName}
                      onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] outline-none transition-colors"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] outline-none transition-colors"
                      placeholder="john@company.co.uk"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] outline-none transition-colors"
                      placeholder="+44 7XXX XXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Company / Organisation</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      type="text" value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] outline-none transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">How urgent is your enquiry?</label>
                  <select
                    value={form.urgencyType}
                    onChange={e => setForm(f => ({ ...f, urgencyType: e.target.value }))}
                    className="w-full bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl px-4 py-3 text-white focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] outline-none transition-colors appearance-none"
                  >
                    <option value="">Select urgency level...</option>
                    <option value="home_office_email">I've received a Home Office concerns email</option>
                    <option value="compliance_audit">I need a compliance audit</option>
                    <option value="new_licence">I'm applying for a sponsor licence</option>
                    <option value="general">General compliance enquiry</option>
                    <option value="hub_demo">I'd like a demo of the Hub software</option>
                  </select>
                </div>

                {form.urgencyType === "home_office_email" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 font-semibold text-sm">Time-Sensitive Matter</p>
                      <p className="text-red-400/80 text-sm mt-1">
                        You typically have 20 working days to respond. We'll prioritise your consultation. For immediate assistance, call{" "}
                        <a href="tel:+442045876587" className="text-red-300 underline font-medium">020 4587 6587</a>.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Anything you'd like us to know?</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] outline-none transition-colors resize-none"
                    placeholder="Brief description of your situation..."
                  />
                </div>

                <GDPRConsent
                  checked={form.gdprConsent}
                  onChange={(checked: boolean) => setForm(f => ({ ...f, gdprConsent: checked }))}
                />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={!form.firstName || !form.lastName || !form.email || !form.gdprConsent}
                    className="flex items-center gap-2 bg-[#00C3FF] hover:bg-[#00B0E6] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    Review Booking <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === "confirm" && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep("details")} className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white">Confirm your booking</h2>
                  <p className="text-gray-400 text-sm">Review your details and confirm.</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Summary Card */}
                <div className="bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00C3FF]/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#00C3FF]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedTypeData?.name}</p>
                      <p className="text-gray-400 text-sm">{selectedTypeData?.durationMinutes} minutes</p>
                    </div>
                  </div>

                  <div className="border-t border-[#1B3A5C] pt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00C3FF]" />
                      <div>
                        <p className="text-gray-400 text-xs">Date</p>
                        <p className="text-white text-sm font-medium">
                          {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00C3FF]" />
                      <div>
                        <p className="text-gray-400 text-xs">Time</p>
                        <p className="text-white text-sm font-medium">
                          {selectedSlot && `${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#1B3A5C] pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Name</span>
                      <span className="text-white text-sm">{form.firstName} {form.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Email</span>
                      <span className="text-white text-sm">{form.email}</span>
                    </div>
                    {form.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Phone</span>
                        <span className="text-white text-sm">{form.phone}</span>
                      </div>
                    )}
                    {form.company && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Company</span>
                        <span className="text-white text-sm">{form.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 100% Free</div>
                  <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> No Obligation</div>
                  <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> GDPR Compliant</div>
                </div>

                {bookMutation.error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                    {bookMutation.error.message}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep("details")}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit Details
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={bookMutation.isPending}
                    className="flex items-center gap-2 bg-[#00C3FF] hover:bg-[#00B0E6] disabled:bg-gray-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                  >
                    {bookMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Confirm Booking</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {step === "success" && bookingResult && (
            <div className="p-6 md:p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Your {bookingResult.consultationType} consultation has been confirmed. We'll send you a confirmation email with all the details.
              </p>

              <div className="bg-[#0D1B2A] border border-[#1B3A5C] rounded-xl p-5 max-w-sm mx-auto mb-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Date</span>
                    <span className="text-white text-sm font-medium">
                      {new Date(bookingResult.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Time</span>
                    <span className="text-white text-sm font-medium">{formatTime(bookingResult.startTime)} – {formatTime(bookingResult.endTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Reference</span>
                    <span className="text-[#00C3FF] text-sm font-mono">#{bookingResult.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#1B3A5C] hover:bg-[#254B70] text-white font-medium px-6 py-3 rounded-xl transition-colors">
                  Back to Home
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#00C3FF] hover:bg-[#00B0E6] text-white font-medium px-6 py-3 rounded-xl transition-colors">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
