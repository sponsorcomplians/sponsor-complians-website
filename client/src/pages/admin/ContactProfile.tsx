import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Mail, Phone, Building2, MapPin, Calendar, Tag,
  Edit, Loader2, Send, Eye, MousePointerClick, Clock,
  User, Globe, Briefcase, Star, MessageSquare, FileText,
  Plus, X, Save, Camera,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactProfile({ contactId, onNavigate }: { contactId: number; onNavigate: (page: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { data: contactData, isLoading } = trpc.contacts.getById.useQuery({ id: contactId });
  const contact = contactData as any;
  const updateContact = trpc.contacts.update.useMutation();
  const uploadAvatar = trpc.contacts.uploadAvatar.useMutation();
  const utils = trpc.useUtils();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large. Max 5MB."); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    setUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await uploadAvatar.mutateAsync({ id: contactId, fileBase64: base64, contentType: file.type, fileName: file.name });
        utils.contacts.getById.invalidate({ id: contactId });
        toast.success("Avatar updated");
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to upload avatar");
      setUploadingAvatar(false);
    }
  };

  const handleUpdate = async (data: Record<string, any>) => {
    try {
      await updateContact.mutateAsync({ id: contactId, ...data });
      utils.contacts.getById.invalidate({ id: contactId });
      setIsEditing(false);
      toast.success("Contact updated");
    } catch {
      toast.error("Failed to update contact");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-16">
        <User className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
        <h3 className="text-[#6B7280] font-medium mb-2">Contact not found</h3>
        <Button variant="outline" onClick={() => onNavigate("contacts")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Contacts
        </Button>
      </div>
    );
  }

  const engagementScore = contact.engagementScore ?? 0;
  const engagementColor = engagementScore >= 80 ? "text-emerald-500" : engagementScore >= 50 ? "text-amber-500" : engagementScore >= 20 ? "text-blue-500" : "text-slate-400";
  const engagementLabel = engagementScore >= 80 ? "Hot" : engagementScore >= 50 ? "Warm" : engagementScore >= 20 ? "Cool" : "Cold";

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => onNavigate("contacts")} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0d9488] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Contacts
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-[#0f172a] to-[#1e293b]" />
        <div className="px-6 pb-6 relative">
          <div className="flex items-start justify-between -mt-10">
            <div className="flex items-start gap-4">
              <div className="relative group/avatar">
                {contact.avatarUrl ? (
                  <img src={contact.avatarUrl} alt={`${contact.firstName} ${contact.lastName}`} className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                    {(contact.firstName?.[0] || "?").toUpperCase()}{(contact.lastName?.[0] || "").toUpperCase()}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                  {uploadingAvatar ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                </label>
              </div>
              <div className="pt-11">
                <h1 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {contact.firstName} {contact.lastName}
                </h1>
                {contact.jobTitle && <p className="text-sm text-[#6B7280]">{contact.jobTitle}</p>}
                {contact.company && (
                  <button
                    onClick={() => onNavigate(`company:${encodeURIComponent(contact.company)}`)}
                    className="text-sm text-[#0d9488] font-medium hover:underline cursor-pointer text-left"
                  >
                    {contact.company}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-11">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="gap-1 text-xs">
                <Edit className="w-3 h-3" /> {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button size="sm" className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-1 text-xs" onClick={() => toast.info("Feature coming soon")}>
                <Send className="w-3 h-3" /> Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-[#1F2937] mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9CA3AF]">Email</div>
                  <div className="text-sm text-[#1F2937]">{contact.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9CA3AF]">Phone</div>
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`} className="text-sm text-[#1F2937] hover:text-[#0d9488] transition-colors">{contact.phone}</a>
                  ) : (
                    <span className="text-sm text-[#9CA3AF] italic">No phone number</span>
                  )}
                </div>
              </div>
              {contact.company && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9CA3AF]">Company</div>
                    <button
                      onClick={() => onNavigate(`company:${encodeURIComponent(contact.company)}`)}
                      className="text-sm text-[#0d9488] font-medium hover:underline cursor-pointer text-left"
                    >
                      {contact.company}
                    </button>
                  </div>
                </div>
              )}
              {contact.city && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9CA3AF]">Location</div>
                    <div className="text-sm text-[#1F2937]">{[contact.city, contact.country].filter(Boolean).join(", ")}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-cyan-500" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9CA3AF]">Subscribed</div>
                  <div className="text-sm text-[#1F2937]">
                    {new Date(contact.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9CA3AF]">Source</div>
                  <div className="text-sm text-[#1F2937]">{contact.source || "Unknown"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-[#1F2937] mb-4">Email Engagement</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Emails Received", value: contact.emailsReceived ?? 0, icon: Send, color: "#3b82f6" },
                { label: "Emails Opened", value: contact.emailsOpened ?? 0, icon: Eye, color: "#22c55e" },
                { label: "Links Clicked", value: contact.emailsClicked ?? 0, icon: MousePointerClick, color: "#f59e0b" },
                { label: "Last Activity", value: contact.lastActivityAt ? new Date(contact.lastActivityAt).toLocaleDateString("en-GB") : "Never", icon: Clock, color: "#8b5cf6" },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-gray-50">
                  <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                  <div className="text-lg font-bold text-[#1F2937]">{stat.value}</div>
                  <div className="text-[10px] text-[#9CA3AF]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-[#1F2937] mb-4">Activity Timeline</h2>
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-[#9CA3AF] text-sm">Activity timeline will populate as emails are sent and interactions are tracked.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Engagement Score */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <h3 className="font-medium text-[#1F2937] text-sm mb-3">Engagement Score</h3>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={engagementScore >= 80 ? "#22c55e" : engagementScore >= 50 ? "#f59e0b" : engagementScore >= 20 ? "#3b82f6" : "#9ca3af"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(engagementScore / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${engagementColor}`}>{engagementScore}</span>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs ${
              engagementScore >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              engagementScore >= 50 ? "bg-amber-50 text-amber-600 border-amber-200" :
              engagementScore >= 20 ? "bg-blue-50 text-blue-600 border-blue-200" :
              "bg-slate-50 text-slate-500 border-slate-200"
            }`}>
              {engagementLabel}
            </Badge>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-medium text-[#1F2937] text-sm mb-3">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Subscription</span>
                <Badge variant="outline" className={`text-[10px] ${
                  contact.status === "subscribed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                  contact.status === "unsubscribed" ? "bg-red-50 text-red-600 border-red-200" :
                  "bg-amber-50 text-amber-600 border-amber-200"
                }`}>
                  {contact.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">GDPR Consent</span>
                <Badge variant="outline" className={`text-[10px] ${
                  contact.gdprConsent ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"
                }`}>
                  {contact.gdprConsent ? "Given" : "Not Given"}
                </Badge>
              </div>
              {contact.consentDate && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">Consent Date</span>
                  <span className="text-xs text-[#4B5563]">{new Date(contact.consentDate).toLocaleDateString("en-GB")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-[#1F2937] text-sm">Tags</h3>
              <button onClick={() => setShowAddTag(!showAddTag)} className="p-1 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#0d9488]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {showAddTag && (
              <div className="flex gap-2 mb-3">
                <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Tag name" className="text-xs" />
                <Button size="sm" onClick={() => { toast.info("Tag feature coming soon"); setShowAddTag(false); }} className="bg-[#0d9488] text-white text-xs shrink-0">Add</Button>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">Sponsor Licence</Badge>
              <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-600 border-purple-200">Newsletter</Badge>
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-200">Webinar Attendee</Badge>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-[#1F2937] text-sm">Notes</h3>
              <button onClick={() => setShowAddNote(!showAddNote)} className="p-1 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#0d9488]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {showAddNote && (
              <div className="space-y-2 mb-3">
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 min-h-[60px]"
                />
                <Button size="sm" onClick={() => { toast.info("Notes feature coming soon"); setShowAddNote(false); }} className="bg-[#0d9488] text-white text-xs">Save Note</Button>
              </div>
            )}
            <p className="text-xs text-[#9CA3AF] text-center py-4">No notes yet</p>
          </div>

          {/* Lists */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-medium text-[#1F2937] text-sm mb-3">Lists</h3>
            <p className="text-xs text-[#9CA3AF] text-center py-4">Not assigned to any lists</p>
          </div>
        </div>
      </div>
    </div>
  );
}
