import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ChevronLeft, ChevronRight, Check, Upload, Plus, Trash2,
  Briefcase, User, Building2, MapPin, GraduationCap,
  Award, ClipboardCheck, Car, Users, FileText, Loader2,
} from "lucide-react";

/* ─── Types ─── */
interface JobInfo {
  id: number;
  title: string;
  company: string;
  sector: string;
}

interface EmploymentEntry {
  employer: string; jobTitle: string; dateFrom: string; dateTo: string; responsibilities: string; reasonForLeaving: string;
}
interface AddressEntry {
  addressLine1: string; addressLine2: string; postcode: string; dateFrom: string; dateTo: string;
}
interface QualificationEntry {
  qualification: string; institution: string; dateFrom: string; dateTo: string;
}
interface CertEntry {
  name: string; issuingBody: string; dateAchieved: string; expiryDate?: string; registrationNumber?: string; status?: string; institution?: string;
}
interface SupervisionEntry {
  supervisor: string; date: string; outcome: string;
}
interface AppraisalEntry {
  feedbackSummary: string; developmentGoals: string; supervisor: string; date: string;
}
interface ReferenceEntry {
  fullName: string; position: string; organisation: string; contactNumber: string; email: string; isCurrentEmployer: string; isRelated: string; address: string;
}

/* ─── Sector Config ─── */
const SECTOR_MAP: Record<string, string> = {
  "Healthcare": "healthcare", "Care": "healthcare", "Health & Social Care": "healthcare",
  "IT & Digital": "it", "Technology": "it", "IT": "it", "Digital": "it",
  "Engineering & Manufacturing": "engineering", "Engineering": "engineering", "Manufacturing": "engineering",
  "Construction": "construction",
  "Business & Finance": "business", "Finance": "business", "Business": "business", "Accounting": "business",
  "Hospitality & Services": "hospitality", "Hospitality": "hospitality", "Catering": "hospitality",
  "Creative & Design": "creative", "Creative": "creative", "Design": "creative", "Media": "creative",
  "Technical Trades": "trades", "Trades": "trades", "Electrical": "trades", "Plumbing": "trades",
};

function getSectorKey(sector: string): string {
  if (SECTOR_MAP[sector]) return SECTOR_MAP[sector];
  const lower = sector.toLowerCase();
  for (const [k, v] of Object.entries(SECTOR_MAP)) {
    if (lower.includes(k.toLowerCase())) return v;
  }
  return "default";
}

const STEP_LABELS = [
  "Position & Availability",
  "Personal Information",
  "Employment History",
  "Address History",
  "Education & Qualifications",
  "Sector Certifications",
  "Experience Verification",
  "Driving & Location",
  "References",
  "Screening & Declaration",
];

const STEP_ICONS = [Briefcase, User, Building2, MapPin, GraduationCap, Award, ClipboardCheck, Car, Users, FileText];

const COUNTRIES = [
  "United Kingdom", "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Brazil", "Bulgaria", "Cameroon", "Canada", "China", "Colombia", "Congo",
  "Croatia", "Czech Republic", "Denmark", "Egypt", "Ethiopia", "Finland", "France", "Germany", "Ghana",
  "Greece", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Jamaica", "Japan",
  "Kenya", "Latvia", "Lithuania", "Malaysia", "Mexico", "Morocco", "Nepal", "Netherlands", "New Zealand",
  "Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Romania", "Russia", "Saudi Arabia",
  "Sierra Leone", "Singapore", "Slovakia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sudan", "Sweden", "Switzerland", "Syria", "Thailand", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Uganda", "Ukraine", "United Arab Emirates", "United States", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

/* ─── Helpers ─── */
function InputField({ label, required, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input {...props} className={`w-full px-3 py-2.5 bg-[#1B3A5C]/50 border border-[#1B3A5C] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C9A7] focus:border-transparent transition ${props.className || ""}`} />
    </div>
  );
}

function TextareaField({ label, required, ...props }: { label: string; required?: boolean } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <textarea {...props} className={`w-full px-3 py-2.5 bg-[#1B3A5C]/50 border border-[#1B3A5C] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C9A7] focus:border-transparent transition resize-y min-h-[80px] ${props.className || ""}`} />
    </div>
  );
}

function SelectField({ label, required, options, ...props }: { label: string; required?: boolean; options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <select {...props} className={`w-full px-3 py-2.5 bg-[#1B3A5C]/50 border border-[#1B3A5C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00C9A7] focus:border-transparent transition ${props.className || ""}`}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ─── Main Component ─── */
export default function JobApplicationForm({ job, onClose }: { job: JobInfo; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const sectorKey = getSectorKey(job.sector);

  // Step 1
  const [availableStartDate, setAvailableStartDate] = useState("");

  // Step 2
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [niNumber, setNiNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [rightToWork, setRightToWork] = useState("");
  const [hasUkDrivingLicence, setHasUkDrivingLicence] = useState("");

  // Step 3
  const emptyEmployment = (): EmploymentEntry => ({ employer: "", jobTitle: "", dateFrom: "", dateTo: "", responsibilities: "", reasonForLeaving: "" });
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentEntry[]>([emptyEmployment(), emptyEmployment(), emptyEmployment()]);

  // Step 4
  const emptyAddress = (): AddressEntry => ({ addressLine1: "", addressLine2: "", postcode: "", dateFrom: "", dateTo: "" });
  const [addressHistory, setAddressHistory] = useState<AddressEntry[]>([emptyAddress(), emptyAddress()]);

  // Step 5
  const emptyQual = (): QualificationEntry => ({ qualification: "", institution: "", dateFrom: "", dateTo: "" });
  const [qualifications, setQualifications] = useState<QualificationEntry[]>([emptyQual(), emptyQual()]);

  // Step 6 (sector certs)
  const emptyCert = (): CertEntry => ({ name: "", issuingBody: "", dateAchieved: "", expiryDate: "", registrationNumber: "", status: "", institution: "" });
  const [certEntries, setCertEntries] = useState<CertEntry[]>([emptyCert(), emptyCert()]);
  const [certTextarea1, setCertTextarea1] = useState("");
  const [certHasBody, setCertHasBody] = useState("");
  const [certBodyName, setCertBodyName] = useState("");
  const [certBodyNumber, setCertBodyNumber] = useState("");
  const [certTextarea2, setCertTextarea2] = useState("");
  // Construction extras
  const [cscsCardType, setCscsCardType] = useState("");
  const [cscsExpiry, setCscsExpiry] = useState("");
  // Hospitality extras
  const [hasPersonalLicence, setHasPersonalLicence] = useState("");
  const [personalLicenceNumber, setPersonalLicenceNumber] = useState("");

  // Step 7 (sector experience)
  const emptySupervision = (): SupervisionEntry => ({ supervisor: "", date: "", outcome: "" });
  const emptyAppraisal = (): AppraisalEntry => ({ feedbackSummary: "", developmentGoals: "", supervisor: "", date: "" });
  const [hasSpotChecks, setHasSpotChecks] = useState("");
  const [spotChecks, setSpotChecks] = useState<SupervisionEntry[]>([emptySupervision()]);
  const [hasAppraisals, setHasAppraisals] = useState("");
  const [appraisals, setAppraisals] = useState<AppraisalEntry[]>([emptyAppraisal()]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [securityClearance, setSecurityClearance] = useState("");
  const [securityClearanceDetails, setSecurityClearanceDetails] = useState("");
  const [healthSafetyQuals, setHealthSafetyQuals] = useState("");
  const [hasRiskAssessment, setHasRiskAssessment] = useState("");
  const [riskAssessmentDetails, setRiskAssessmentDetails] = useState("");
  const [hasSafetyAudits, setHasSafetyAudits] = useState("");
  const [safetyAudits, setSafetyAudits] = useState<SupervisionEntry[]>([emptySupervision()]);
  const [siteExperience, setSiteExperience] = useState("");
  const [cpdActivities, setCpdActivities] = useState("");
  const [teamManagement, setTeamManagement] = useState("");
  const [publishedWork, setPublishedWork] = useState("");
  const [patCertifications, setPatCertifications] = useState("");
  const [hasPatCerts, setHasPatCerts] = useState("");
  const [tradeInspections, setTradeInspections] = useState("");

  // Step 8
  const [hasValidDrivingLicence, setHasValidDrivingLicence] = useState("");
  const [hasVehicleAccess, setHasVehicleAccess] = useState("");
  const [hasBusinessInsurance, setHasBusinessInsurance] = useState("");
  const [livesWithin10Miles, setLivesWithin10Miles] = useState("");
  const [willingToRelocate, setWillingToRelocate] = useState("");
  const [canStartWithin4Weeks, setCanStartWithin4Weeks] = useState("");

  // Step 9
  const emptyRef = (): ReferenceEntry => ({ fullName: "", position: "", organisation: "", contactNumber: "", email: "", isCurrentEmployer: "", isRelated: "", address: "" });
  const [references, setReferences] = useState<ReferenceEntry[]>([emptyRef(), emptyRef()]);

  // Step 10
  const [screeningQ1, setScreeningQ1] = useState("");
  const [screeningQ2, setScreeningQ2] = useState("");
  const [screeningQ3, setScreeningQ3] = useState("");
  const [hasCriminalConviction, setHasCriminalConviction] = useState("");
  const [criminalConvictionDetails, setCriminalConvictionDetails] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [printName, setPrintName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  const submitMutation = trpc.jobs.submitApplication.useMutation();
  const uploadCVMutation = trpc.jobs.uploadCV.useMutation();

  /* ─── Validation ─── */
  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!availableStartDate) errs.availableStartDate = "Required";
    } else if (s === 1) {
      if (!surname.trim()) errs.surname = "Required";
      if (!firstName.trim()) errs.firstName = "Required";
      if (!addressLine1.trim()) errs.addressLine1 = "Required";
      if (!postcode.trim()) errs.postcode = "Required";
      if (!country) errs.country = "Required";
      if (!mobile.trim()) errs.mobile = "Required";
      if (!email.trim()) errs.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email";
      if (!rightToWork.trim()) errs.rightToWork = "Required";
    } else if (s === 8) {
      if (!references[0].fullName.trim()) errs["ref0.fullName"] = "Required";
      if (!references[1].fullName.trim()) errs["ref1.fullName"] = "Required";
    } else if (s === 9) {
      if (!screeningQ1.trim()) errs.screeningQ1 = "Required";
      if (!screeningQ2.trim()) errs.screeningQ2 = "Required";
      if (!screeningQ3.trim()) errs.screeningQ3 = "Required";
      if (!declarationAccepted) errs.declaration = "You must accept the declaration";
      if (!printName.trim()) errs.printName = "Required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) {
      toast.error("Please complete all required fields before proceeding.");
      return;
    }
    setStep(s => Math.min(s + 1, 9));
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep(s => Math.max(s - 1, 0));
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ─── CV Upload ─── */
  async function handleCVUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) { toast.error("Only PDF, DOC, DOCX files accepted"); return; }
    setUploadingCV(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
      const result = await uploadCVMutation.mutateAsync({ fileName: file.name, fileBase64: base64, contentType: file.type });
      setCvUrl(result.url);
      setCvFile(file);
      toast.success("CV uploaded successfully");
    } catch { toast.error("Failed to upload CV"); } finally { setUploadingCV(false); }
  }

  /* ─── Build sector certifications JSON ─── */
  function buildSectorCertifications() {
    return {
      sectorKey,
      entries: certEntries,
      textarea1: certTextarea1,
      hasBody: certHasBody,
      bodyName: certBodyName,
      bodyNumber: certBodyNumber,
      textarea2: certTextarea2,
      cscsCardType, cscsExpiry,
      hasPersonalLicence, personalLicenceNumber,
    };
  }

  /* ─── Build sector experience JSON ─── */
  function buildSectorExperience() {
    return {
      sectorKey,
      hasSpotChecks, spotChecks,
      hasAppraisals, appraisals,
      portfolioUrl, projectDescription,
      securityClearance, securityClearanceDetails,
      healthSafetyQuals, hasRiskAssessment, riskAssessmentDetails,
      hasSafetyAudits, safetyAudits,
      siteExperience, cpdActivities, teamManagement,
      publishedWork, patCertifications, hasPatCerts, tradeInspections,
    };
  }

  /* ─── Submit ─── */
  async function handleSubmit() {
    if (!validateStep(9)) { toast.error("Please complete all required fields."); return; }
    setSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        jobId: job.id,
        jobTitle: job.title,
        employerName: job.company,
        sector: job.sector,
        sectorVariantStep6: sectorKey,
        sectorVariantStep7: sectorKey,
        availableStartDate,
        surname, firstName,
        nationalInsuranceNumber: niNumber || undefined,
        addressLine1, addressLine2: addressLine2 || undefined,
        postcode, country, mobile, email, rightToWork,
        hasUkDrivingLicence: hasUkDrivingLicence || undefined,
        employmentHistory,
        addressHistory,
        qualifications,
        sectorCertifications: buildSectorCertifications(),
        sectorExperience: buildSectorExperience(),
        hasValidDrivingLicence: hasValidDrivingLicence || undefined,
        hasVehicleAccess: hasVehicleAccess || undefined,
        hasBusinessInsurance: hasBusinessInsurance || undefined,
        livesWithin10Miles: livesWithin10Miles || undefined,
        willingToRelocate: willingToRelocate || undefined,
        canStartWithin4Weeks: canStartWithin4Weeks || undefined,
        references,
        screeningQ1, screeningQ2, screeningQ3,
        hasCriminalConviction: hasCriminalConviction || undefined,
        criminalConvictionDetails: criminalConvictionDetails || undefined,
        cvUrl: cvUrl || undefined,
        declarationAccepted,
        printName,
        declarationDate: new Date().toISOString().split("T")[0],
      });
      toast.success(`Thank you for your application to ${job.title} at ${job.company}. We'll review your details and be in touch within 5 working days.`);
      onClose();
    } catch { toast.error("Failed to submit application. Please try again."); } finally { setSubmitting(false); }
  }

  /* ─── Repeatable helpers ─── */
  function updateArray<T>(arr: T[], idx: number, field: keyof T, value: string): T[] {
    const copy = [...arr];
    (copy[idx] as any)[field] = value;
    return copy;
  }

  const yesNoOptions = [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }];

  /* ─── Progress Bar ─── */
  function ProgressBar() {
    return (
      <div className="px-6 py-4 border-b border-[#1B3A5C]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#00C9A7]">Step {step + 1} of 10</span>
          <span className="text-sm text-gray-400">{STEP_LABELS[step]}</span>
        </div>
        <div className="w-full bg-[#1B3A5C] rounded-full h-2">
          <div className="bg-gradient-to-r from-[#00C9A7] to-[#00C3FF] h-2 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / 10) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-3 overflow-x-auto gap-1">
          {STEP_LABELS.map((label, i) => {
            const Icon = STEP_ICONS[i];
            const done = i < step;
            const active = i === step;
            return (
              <button key={i} onClick={() => { if (i < step) setStep(i); }} className={`flex flex-col items-center gap-1 min-w-[48px] transition ${active ? "text-[#00C9A7]" : done ? "text-[#00C9A7]/60 cursor-pointer" : "text-gray-600"}`} disabled={i > step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${active ? "border-[#00C9A7] bg-[#00C9A7]/20" : done ? "border-[#00C9A7]/60 bg-[#00C9A7]/10" : "border-gray-700 bg-transparent"}`}>
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] leading-tight text-center hidden md:block">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── Step Renderers ─── */
  function renderStep1() {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#00C9A7]" /> Position & Availability</h3>
        <InputField label="Position Applying For" value={job.title} readOnly className="!bg-[#0D1B2A] !text-gray-400 cursor-not-allowed" />
        <InputField label="Company" value={job.company} readOnly className="!bg-[#0D1B2A] !text-gray-400 cursor-not-allowed" />
        <InputField label="Available Start Date" type="date" required value={availableStartDate} onChange={e => setAvailableStartDate(e.target.value)} />
        {errors.availableStartDate && <p className="text-red-400 text-sm">{errors.availableStartDate}</p>}
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-[#00C9A7]" /> Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputField label="Surname" required value={surname} onChange={e => setSurname(e.target.value)} placeholder="Enter your surname" />
            {errors.surname && <p className="text-red-400 text-xs mt-1">{errors.surname}</p>}
          </div>
          <div>
            <InputField label="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter your first name" />
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>
        </div>
        <InputField label="National Insurance Number" value={niNumber} onChange={e => setNiNumber(e.target.value)} placeholder="e.g. QQ 12 34 56 C (optional)" />
        <div>
          <InputField label="Address Line 1" required value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="Street address" />
          {errors.addressLine1 && <p className="text-red-400 text-xs mt-1">{errors.addressLine1}</p>}
        </div>
        <InputField label="Address Line 2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} placeholder="Flat, suite, etc. (optional)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputField label="Postcode" required value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="e.g. SW1A 1AA" />
            {errors.postcode && <p className="text-red-400 text-xs mt-1">{errors.postcode}</p>}
          </div>
          <div>
            <SelectField label="Country" required value={country} onChange={e => setCountry(e.target.value)} options={COUNTRIES.map(c => ({ value: c, label: c }))} />
            {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputField label="Mobile Number" required value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+44 7XXX XXX XXX" />
            {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
          </div>
          <div>
            <InputField label="Email Address" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        <div>
          <TextareaField label="Do you have the right to work in the UK? If yes, what kind of permission do you have, and when does your visa expire if it's temporary?" required value={rightToWork} onChange={e => setRightToWork(e.target.value)} placeholder="Describe your right to work status..." />
          {errors.rightToWork && <p className="text-red-400 text-xs mt-1">{errors.rightToWork}</p>}
        </div>
        <SelectField label="Do you hold a full UK driving licence?" value={hasUkDrivingLicence} onChange={e => setHasUkDrivingLicence(e.target.value)} options={yesNoOptions} />
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-[#00C9A7]" /> Employment History</h3>
        <p className="text-sm text-gray-400">Provide details of your last three employments, starting with the most recent. If a question does not apply, write N/A.</p>
        {employmentHistory.map((emp, i) => (
          <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00C9A7]">Employer {i + 1}</span>
              {i >= 3 && <button onClick={() => setEmploymentHistory(h => h.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <InputField label="Name of Employer" value={emp.employer} onChange={e => setEmploymentHistory(h => updateArray(h, i, "employer", e.target.value))} />
            <InputField label="Job Title" value={emp.jobTitle} onChange={e => setEmploymentHistory(h => updateArray(h, i, "jobTitle", e.target.value))} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Date From" type="date" value={emp.dateFrom} onChange={e => setEmploymentHistory(h => updateArray(h, i, "dateFrom", e.target.value))} />
              <InputField label="Date To" type="date" value={emp.dateTo} onChange={e => setEmploymentHistory(h => updateArray(h, i, "dateTo", e.target.value))} />
            </div>
            <TextareaField label="Key Responsibilities and Duties Performed" value={emp.responsibilities} onChange={e => setEmploymentHistory(h => updateArray(h, i, "responsibilities", e.target.value))} />
            <TextareaField label="Reason for Leaving" value={emp.reasonForLeaving} onChange={e => setEmploymentHistory(h => updateArray(h, i, "reasonForLeaving", e.target.value))} />
          </div>
        ))}
        <button onClick={() => setEmploymentHistory(h => [...h, emptyEmployment()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another employer</button>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-[#00C9A7]" /> Address History</h3>
        <p className="text-sm text-gray-400">List all addresses for the past five years, starting with your current address. Do not leave any gaps.</p>
        {addressHistory.map((addr, i) => (
          <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00C9A7]">Address {i + 1}</span>
              {i >= 2 && <button onClick={() => setAddressHistory(h => h.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <InputField label="Address Line 1" value={addr.addressLine1} onChange={e => setAddressHistory(h => updateArray(h, i, "addressLine1", e.target.value))} />
            <InputField label="Address Line 2" value={addr.addressLine2} onChange={e => setAddressHistory(h => updateArray(h, i, "addressLine2", e.target.value))} />
            <InputField label="Postcode" value={addr.postcode} onChange={e => setAddressHistory(h => updateArray(h, i, "postcode", e.target.value))} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Date From" type="date" value={addr.dateFrom} onChange={e => setAddressHistory(h => updateArray(h, i, "dateFrom", e.target.value))} />
              <InputField label="Date To" type="date" value={addr.dateTo} onChange={e => setAddressHistory(h => updateArray(h, i, "dateTo", e.target.value))} />
            </div>
          </div>
        ))}
        <button onClick={() => setAddressHistory(h => [...h, emptyAddress()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another address</button>
      </div>
    );
  }

  function renderStep5() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><GraduationCap className="w-5 h-5 text-[#00C9A7]" /> Education, Qualifications & Training</h3>
        <p className="text-sm text-gray-400">Provide full details of all academic qualifications, professional certifications, and relevant training. Include the name of the qualification or course, awarding body, and dates completed.</p>
        {qualifications.map((q, i) => (
          <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00C9A7]">Qualification {i + 1}</span>
              {i >= 2 && <button onClick={() => setQualifications(q => q.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <InputField label="Qualification Achieved" value={q.qualification} onChange={e => setQualifications(qs => updateArray(qs, i, "qualification", e.target.value))} />
            <InputField label="University / College / School" value={q.institution} onChange={e => setQualifications(qs => updateArray(qs, i, "institution", e.target.value))} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Date From" type="date" value={q.dateFrom} onChange={e => setQualifications(qs => updateArray(qs, i, "dateFrom", e.target.value))} />
              <InputField label="Date To" type="date" value={q.dateTo} onChange={e => setQualifications(qs => updateArray(qs, i, "dateTo", e.target.value))} />
            </div>
          </div>
        ))}
        <button onClick={() => setQualifications(q => [...q, emptyQual()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another qualification</button>
      </div>
    );
  }

  /* ─── Step 6: Sector-Specific Certifications ─── */
  function renderStep6() {
    const heading = {
      healthcare: "Care Certifications & Professional Registration",
      it: "Technical Certifications & Professional Memberships",
      engineering: "Trade Certifications & Professional Registration",
      construction: "Trade Qualifications & Industry Cards",
      business: "Professional Qualifications & Memberships",
      hospitality: "Industry Certifications & Food Safety",
      creative: "Creative Qualifications & Tools",
      trades: "Trade Certifications & Licences",
      default: "Professional Qualifications & Training",
    }[sectorKey] || "Professional Qualifications & Training";

    const instruction = {
      healthcare: "Provide details of all care-related certifications, additional training, and any relevant regulatory or professional registrations.",
      it: "Provide details of all technical certifications, vendor qualifications, and professional memberships relevant to this role.",
      engineering: "Provide details of all trade qualifications, engineering certifications, and professional registrations relevant to this role.",
      construction: "Provide details of all trade qualifications, construction industry cards, and relevant certifications.",
      business: "Provide details of all professional qualifications, accreditations, and memberships relevant to this role.",
      hospitality: "Provide details of all hospitality certifications, food safety qualifications, and relevant training.",
      creative: "Provide details of all creative qualifications, software proficiencies, and professional memberships.",
      trades: "Provide details of all trade qualifications, licences, and registrations relevant to this role.",
      default: "Provide details of all professional qualifications, certifications, and training relevant to this role.",
    }[sectorKey] || "Provide details of all professional qualifications, certifications, and training relevant to this role.";

    const certLabel = {
      healthcare: "Training Title", it: "Certification Name", engineering: "Certification Name",
      construction: "Qualification Name", business: "Qualification Name", hospitality: "Certification Name",
      creative: "Qualification Name", trades: "Qualification Name", default: "Qualification Name",
    }[sectorKey] || "Qualification Name";

    const bodyLabel = {
      healthcare: "Provider", it: "Issuing Body", engineering: "Issuing Body",
      construction: "Issuing Body", business: "Issuing Body", hospitality: "Issuing Body",
      creative: "Institution", trades: "Issuing Body", default: "Issuing Body",
    }[sectorKey] || "Issuing Body";

    const showExpiry = ["it", "construction", "hospitality", "trades"].includes(sectorKey);
    const showRegNumber = sectorKey === "trades";
    const showStatus = sectorKey === "business";

    const bodyQuestion = {
      healthcare: "Are you registered with any professional body (e.g., NMC, HCPC, Social Work England)?",
      it: "Are you a member of any professional body (e.g., BCS, IET, IEEE)?",
      engineering: "Are you registered with any professional body (e.g., IMechE, IET, Engineering Council)?",
      construction: "Are you registered with any professional body (e.g., CIOB, ICE, RICS)?",
      business: "Are you a member of any professional body?",
      hospitality: "Do you hold a Personal Licence for the sale of alcohol?",
      creative: "Are you a member of any professional body (e.g., D&AD, CSD, BAFTA)?",
      trades: "Do you hold a valid ECS/JIB/CSCS card?",
      default: "Are you a member of any professional body?",
    }[sectorKey] || "Are you a member of any professional body?";

    const textarea1Label = {
      healthcare: "Relevant Care Training",
      it: "List your core technical skills and programming languages",
      engineering: "List any CSCS, CPCS, or other industry cards you hold",
      construction: "List any other industry cards (CPCS, NPORS, IPAF, PASMA, etc.)",
      business: "List any relevant software proficiencies (e.g., SAP, Sage, Xero, Salesforce, HubSpot)",
      hospitality: "List any allergen awareness or dietary training completed",
      creative: "List your core creative tools and software (e.g., Adobe Creative Suite, Figma, Sketch, Final Cut Pro)",
      trades: "List all current industry registrations (e.g., Gas Safe Register, NICEIC, NAPIT, OFTEC)",
      default: "List any relevant software or technical skills",
    }[sectorKey] || "List any relevant software or technical skills";

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Award className="w-5 h-5 text-[#00C9A7]" /> {heading}</h3>
        <p className="text-sm text-gray-400">{instruction}</p>

        {certEntries.map((c, i) => (
          <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00C9A7]">Entry {i + 1}</span>
              {i >= 2 && <button onClick={() => setCertEntries(c => c.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <InputField label={certLabel} value={c.name} onChange={e => setCertEntries(cs => updateArray(cs, i, "name", e.target.value))} />
            <InputField label={bodyLabel} value={c.issuingBody} onChange={e => setCertEntries(cs => updateArray(cs, i, "issuingBody", e.target.value))} />
            <div className={`grid ${showExpiry ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
              <InputField label="Date Achieved" type="date" value={c.dateAchieved} onChange={e => setCertEntries(cs => updateArray(cs, i, "dateAchieved", e.target.value))} />
              {showExpiry && <InputField label="Expiry Date" type="date" value={c.expiryDate || ""} onChange={e => setCertEntries(cs => updateArray(cs, i, "expiryDate", e.target.value))} />}
            </div>
            {showRegNumber && <InputField label="Registration Number" value={c.registrationNumber || ""} onChange={e => setCertEntries(cs => updateArray(cs, i, "registrationNumber", e.target.value))} />}
            {showStatus && <SelectField label="Status" value={c.status || ""} onChange={e => setCertEntries(cs => updateArray(cs, i, "status", e.target.value))} options={[{ value: "Completed", label: "Completed" }, { value: "In Progress", label: "In Progress" }]} />}
          </div>
        ))}
        <button onClick={() => setCertEntries(c => [...c, emptyCert()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another entry</button>

        <TextareaField label={textarea1Label} value={certTextarea1} onChange={e => setCertTextarea1(e.target.value)} />

        {sectorKey === "construction" && (
          <div className="grid grid-cols-2 gap-3">
            <InputField label="CSCS Card Type" value={cscsCardType} onChange={e => setCscsCardType(e.target.value)} />
            <InputField label="CSCS Expiry Date" type="date" value={cscsExpiry} onChange={e => setCscsExpiry(e.target.value)} />
          </div>
        )}

        {sectorKey === "hospitality" ? (
          <>
            <SelectField label={bodyQuestion} value={hasPersonalLicence} onChange={e => setHasPersonalLicence(e.target.value)} options={yesNoOptions} />
            {hasPersonalLicence === "Yes" && <InputField label="Licence Number" value={personalLicenceNumber} onChange={e => setPersonalLicenceNumber(e.target.value)} />}
          </>
        ) : (
          <>
            <SelectField label={bodyQuestion} value={certHasBody} onChange={e => setCertHasBody(e.target.value)} options={yesNoOptions} />
            {certHasBody === "Yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField label={sectorKey === "healthcare" ? "Registration Body Name" : "Body/Organisation Name"} value={certBodyName} onChange={e => setCertBodyName(e.target.value)} />
                {sectorKey === "healthcare" && <InputField label="Registration Number" value={certBodyNumber} onChange={e => setCertBodyNumber(e.target.value)} />}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  /* ─── Step 7: Sector-Specific Experience Verification ─── */
  function renderStep7() {
    const heading = {
      healthcare: "Spot Checks, Supervision & Appraisals",
      it: "Portfolio & Technical Experience",
      engineering: "Health & Safety Training",
      construction: "Site Experience & Safety Training",
      business: "Performance & Professional Development",
      hospitality: "Service Experience & Supervision",
      creative: "Portfolio & Published Work",
      trades: "Safety Training & Inspections",
      default: "Performance & Development",
    }[sectorKey] || "Performance & Development";

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-[#00C9A7]" /> {heading}</h3>

        {sectorKey === "healthcare" && (
          <>
            <SelectField label="Have you undergone any spot checks or supervision in previous roles in the past 2 years?" value={hasSpotChecks} onChange={e => setHasSpotChecks(e.target.value)} options={yesNoOptions} />
            {hasSpotChecks === "Yes" && (
              <>
                {spotChecks.map((sc, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#00C9A7]">Spot Check {i + 1}</span>
                      {i >= 1 && <button onClick={() => setSpotChecks(s => s.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                    <InputField label="Supervisor" value={sc.supervisor} onChange={e => setSpotChecks(s => updateArray(s, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={sc.date} onChange={e => setSpotChecks(s => updateArray(s, i, "date", e.target.value))} />
                    <TextareaField label="Outcome" value={sc.outcome} onChange={e => setSpotChecks(s => updateArray(s, i, "outcome", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setSpotChecks(s => [...s, emptySupervision()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
            <SelectField label="Have you received formal appraisals in the past 2 years?" value={hasAppraisals} onChange={e => setHasAppraisals(e.target.value)} options={yesNoOptions} />
            {hasAppraisals === "Yes" && (
              <>
                {appraisals.map((a, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#00C9A7]">Appraisal {i + 1}</span>
                      {i >= 1 && <button onClick={() => setAppraisals(a => a.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                    <TextareaField label="Feedback Summary" value={a.feedbackSummary} onChange={e => setAppraisals(as2 => updateArray(as2, i, "feedbackSummary", e.target.value))} />
                    <TextareaField label="Development Goals" value={a.developmentGoals} onChange={e => setAppraisals(as2 => updateArray(as2, i, "developmentGoals", e.target.value))} />
                    <InputField label="Supervisor" value={a.supervisor} onChange={e => setAppraisals(as2 => updateArray(as2, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={a.date} onChange={e => setAppraisals(as2 => updateArray(as2, i, "date", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setAppraisals(a => [...a, emptyAppraisal()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
          </>
        )}

        {sectorKey === "it" && (
          <>
            <InputField label="Link to your portfolio, GitHub, or relevant project work" type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://" />
            <TextareaField label="Describe a significant technical project you have led or contributed to, including your role, the technologies used, and the outcome." value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
            <SelectField label="Do you hold any active security clearances?" value={securityClearance} onChange={e => setSecurityClearance(e.target.value)} options={yesNoOptions} />
            {securityClearance === "Yes" && <InputField label="Details" value={securityClearanceDetails} onChange={e => setSecurityClearanceDetails(e.target.value)} />}
          </>
        )}

        {sectorKey === "engineering" && (
          <>
            <TextareaField label="List all health and safety qualifications you hold (e.g., IOSH, NEBOSH, SMSTS, SSSTS)" value={healthSafetyQuals} onChange={e => setHealthSafetyQuals(e.target.value)} />
            <SelectField label="Do you hold any current risk assessment or method statement training?" value={hasRiskAssessment} onChange={e => setHasRiskAssessment(e.target.value)} options={yesNoOptions} />
            {hasRiskAssessment === "Yes" && <InputField label="Details" value={riskAssessmentDetails} onChange={e => setRiskAssessmentDetails(e.target.value)} />}
            <SelectField label="Have you undergone any workplace safety audits or assessments in the past 2 years?" value={hasSafetyAudits} onChange={e => setHasSafetyAudits(e.target.value)} options={yesNoOptions} />
            {hasSafetyAudits === "Yes" && (
              <>
                {safetyAudits.map((sa, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <InputField label="Assessor" value={sa.supervisor} onChange={e => setSafetyAudits(s => updateArray(s, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={sa.date} onChange={e => setSafetyAudits(s => updateArray(s, i, "date", e.target.value))} />
                    <TextareaField label="Outcome" value={sa.outcome} onChange={e => setSafetyAudits(s => updateArray(s, i, "outcome", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setSafetyAudits(s => [...s, emptySupervision()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
          </>
        )}

        {sectorKey === "construction" && (
          <>
            <TextareaField label="List all health and safety qualifications (e.g., SMSTS, SSSTS, NEBOSH, IOSH)" value={healthSafetyQuals} onChange={e => setHealthSafetyQuals(e.target.value)} />
            <TextareaField label="Do you have experience working on sites requiring specific safety protocols (e.g., confined spaces, working at height, asbestos awareness)?" value={siteExperience} onChange={e => setSiteExperience(e.target.value)} />
            <SelectField label="Have you undergone any site safety audits or toolbox talks in the past 2 years?" value={hasSafetyAudits} onChange={e => setHasSafetyAudits(e.target.value)} options={yesNoOptions} />
            {hasSafetyAudits === "Yes" && (
              <>
                {safetyAudits.map((sa, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <InputField label="Supervisor" value={sa.supervisor} onChange={e => setSafetyAudits(s => updateArray(s, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={sa.date} onChange={e => setSafetyAudits(s => updateArray(s, i, "date", e.target.value))} />
                    <TextareaField label="Outcome" value={sa.outcome} onChange={e => setSafetyAudits(s => updateArray(s, i, "outcome", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setSafetyAudits(s => [...s, emptySupervision()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
          </>
        )}

        {sectorKey === "business" && (
          <>
            <SelectField label="Have you received formal performance reviews or appraisals in the past 2 years?" value={hasAppraisals} onChange={e => setHasAppraisals(e.target.value)} options={yesNoOptions} />
            {hasAppraisals === "Yes" && (
              <>
                {appraisals.map((a, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <TextareaField label="Feedback Summary" value={a.feedbackSummary} onChange={e => setAppraisals(as2 => updateArray(as2, i, "feedbackSummary", e.target.value))} />
                    <TextareaField label="Development Goals" value={a.developmentGoals} onChange={e => setAppraisals(as2 => updateArray(as2, i, "developmentGoals", e.target.value))} />
                    <InputField label="Reviewer" value={a.supervisor} onChange={e => setAppraisals(as2 => updateArray(as2, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={a.date} onChange={e => setAppraisals(as2 => updateArray(as2, i, "date", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setAppraisals(a => [...a, emptyAppraisal()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
            <TextareaField label="Describe any CPD (Continuing Professional Development) activities you have completed in the past 12 months" value={cpdActivities} onChange={e => setCpdActivities(e.target.value)} />
          </>
        )}

        {sectorKey === "hospitality" && (
          <>
            <TextareaField label="Have you managed or supervised a team? If yes, how many people and in what setting?" value={teamManagement} onChange={e => setTeamManagement(e.target.value)} />
            <SelectField label="Have you received formal performance reviews in the past 2 years?" value={hasAppraisals} onChange={e => setHasAppraisals(e.target.value)} options={yesNoOptions} />
            {hasAppraisals === "Yes" && (
              <>
                {appraisals.map((a, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <TextareaField label="Feedback Summary" value={a.feedbackSummary} onChange={e => setAppraisals(as2 => updateArray(as2, i, "feedbackSummary", e.target.value))} />
                    <InputField label="Reviewer" value={a.supervisor} onChange={e => setAppraisals(as2 => updateArray(as2, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={a.date} onChange={e => setAppraisals(as2 => updateArray(as2, i, "date", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setAppraisals(a => [...a, emptyAppraisal()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
          </>
        )}

        {sectorKey === "creative" && (
          <>
            <InputField label="Link to your portfolio or showreel" type="url" required value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://" />
            <TextareaField label="Describe your most significant creative project, including your role, the brief, and the outcome" value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
            <TextareaField label="List any published work, exhibitions, or awards" value={publishedWork} onChange={e => setPublishedWork(e.target.value)} />
          </>
        )}

        {sectorKey === "trades" && (
          <>
            <TextareaField label="List all health and safety qualifications (e.g., IOSH, NEBOSH, City & Guilds 2391 Inspection & Testing)" value={healthSafetyQuals} onChange={e => setHealthSafetyQuals(e.target.value)} />
            <SelectField label="Have you undergone any compliance inspections, audits, or assessments in the past 2 years?" value={hasSafetyAudits} onChange={e => setHasSafetyAudits(e.target.value)} options={yesNoOptions} />
            {hasSafetyAudits === "Yes" && (
              <>
                {safetyAudits.map((sa, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <InputField label="Inspector" value={sa.supervisor} onChange={e => setSafetyAudits(s => updateArray(s, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={sa.date} onChange={e => setSafetyAudits(s => updateArray(s, i, "date", e.target.value))} />
                    <TextareaField label="Outcome" value={sa.outcome} onChange={e => setSafetyAudits(s => updateArray(s, i, "outcome", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setSafetyAudits(s => [...s, emptySupervision()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
            <SelectField label="Do you hold any current PAT testing, inspection, or commissioning certifications?" value={hasPatCerts} onChange={e => setHasPatCerts(e.target.value)} options={yesNoOptions} />
            {hasPatCerts === "Yes" && <InputField label="Details" value={patCertifications} onChange={e => setPatCertifications(e.target.value)} />}
          </>
        )}

        {sectorKey === "default" && (
          <>
            <SelectField label="Have you received formal performance reviews or appraisals in the past 2 years?" value={hasAppraisals} onChange={e => setHasAppraisals(e.target.value)} options={yesNoOptions} />
            {hasAppraisals === "Yes" && (
              <>
                {appraisals.map((a, i) => (
                  <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
                    <TextareaField label="Feedback Summary" value={a.feedbackSummary} onChange={e => setAppraisals(as2 => updateArray(as2, i, "feedbackSummary", e.target.value))} />
                    <TextareaField label="Development Goals" value={a.developmentGoals} onChange={e => setAppraisals(as2 => updateArray(as2, i, "developmentGoals", e.target.value))} />
                    <InputField label="Reviewer" value={a.supervisor} onChange={e => setAppraisals(as2 => updateArray(as2, i, "supervisor", e.target.value))} />
                    <InputField label="Date" type="date" value={a.date} onChange={e => setAppraisals(as2 => updateArray(as2, i, "date", e.target.value))} />
                  </div>
                ))}
                <button onClick={() => setAppraisals(a => [...a, emptyAppraisal()])} className="flex items-center gap-2 text-[#00C9A7] hover:text-[#00C9A7]/80 text-sm font-medium"><Plus className="w-4 h-4" /> Add another</button>
              </>
            )}
            <TextareaField label="Describe any professional development activities you have completed in the past 12 months" value={cpdActivities} onChange={e => setCpdActivities(e.target.value)} />
          </>
        )}
      </div>
    );
  }

  /* ─── Steps 8-10 ─── */
  function renderStep8() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Car className="w-5 h-5 text-[#00C9A7]" /> Driving Details & Location Suitability</h3>
        <SelectField label="Do you hold a valid UK Driving Licence?" value={hasValidDrivingLicence} onChange={e => setHasValidDrivingLicence(e.target.value)} options={yesNoOptions} />
        <SelectField label="Do you have access to a vehicle for work?" value={hasVehicleAccess} onChange={e => setHasVehicleAccess(e.target.value)} options={yesNoOptions} />
        <SelectField label="Do you hold valid business-use motor insurance for work travel?" value={hasBusinessInsurance} onChange={e => setHasBusinessInsurance(e.target.value)} options={yesNoOptions} />
        <SelectField label="Do you live within 10 miles of the vacancy location?" value={livesWithin10Miles} onChange={e => setLivesWithin10Miles(e.target.value)} options={yesNoOptions} />
        {livesWithin10Miles === "No" && <SelectField label="If not, are you willing to relocate for the role?" value={willingToRelocate} onChange={e => setWillingToRelocate(e.target.value)} options={yesNoOptions} />}
        <SelectField label="If successful, are you able to start within 4 weeks?" value={canStartWithin4Weeks} onChange={e => setCanStartWithin4Weeks(e.target.value)} options={yesNoOptions} />
      </div>
    );
  }

  function renderStep9() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-[#00C9A7]" /> References</h3>
        <p className="text-sm text-gray-400">Provide details of two professional references from your most recent employers.</p>
        {references.map((ref, i) => (
          <div key={i} className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
            <span className="text-sm font-semibold text-[#00C9A7]">Reference {i + 1}</span>
            <div>
              <InputField label="Full Name" required value={ref.fullName} onChange={e => setReferences(r => updateArray(r, i, "fullName", e.target.value))} />
              {errors[`ref${i}.fullName`] && <p className="text-red-400 text-xs mt-1">{errors[`ref${i}.fullName`]}</p>}
            </div>
            <InputField label="Position" value={ref.position} onChange={e => setReferences(r => updateArray(r, i, "position", e.target.value))} />
            <InputField label="Organisation" value={ref.organisation} onChange={e => setReferences(r => updateArray(r, i, "organisation", e.target.value))} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Contact Number" value={ref.contactNumber} onChange={e => setReferences(r => updateArray(r, i, "contactNumber", e.target.value))} />
              <InputField label="Email" type="email" value={ref.email} onChange={e => setReferences(r => updateArray(r, i, "email", e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Is this your current employer?" value={ref.isCurrentEmployer} onChange={e => setReferences(r => updateArray(r, i, "isCurrentEmployer", e.target.value))} options={yesNoOptions} />
              <SelectField label="Are they related to you?" value={ref.isRelated} onChange={e => setReferences(r => updateArray(r, i, "isRelated", e.target.value))} options={yesNoOptions} />
            </div>
            <TextareaField label="Address" value={ref.address} onChange={e => setReferences(r => updateArray(r, i, "address", e.target.value))} />
          </div>
        ))}
      </div>
    );
  }

  function renderStep10() {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-[#00C9A7]" /> Screening Questions & Declaration</h3>
        <div>
          <TextareaField label="Do you hold a Level 2 or 3 NVQ/Diploma in Health and Social Care (or an equivalent UK/overseas care qualification), and are you willing to complete our intensive skills training and competency assessments before starting the role?" required value={screeningQ1} onChange={e => setScreeningQ1(e.target.value)} />
          {errors.screeningQ1 && <p className="text-red-400 text-xs mt-1">{errors.screeningQ1}</p>}
        </div>
        <div>
          <TextareaField label="Can you provide examples of your experience supporting individuals with personal care, medication, or health needs, and how you promote dignity, independence, and safeguarding in your work?" required value={screeningQ2} onChange={e => setScreeningQ2(e.target.value)} />
          {errors.screeningQ2 && <p className="text-red-400 text-xs mt-1">{errors.screeningQ2}</p>}
        </div>
        <div>
          <TextareaField label="Explain why you are applying for this role and how your experience and values align with the job." required value={screeningQ3} onChange={e => setScreeningQ3(e.target.value)} />
          {errors.screeningQ3 && <p className="text-red-400 text-xs mt-1">{errors.screeningQ3}</p>}
        </div>
        <SelectField label="Have you ever been convicted of a criminal offence?" value={hasCriminalConviction} onChange={e => setHasCriminalConviction(e.target.value)} options={yesNoOptions} />
        {hasCriminalConviction === "Yes" && <TextareaField label="Provide details in confidence" value={criminalConvictionDetails} onChange={e => setCriminalConvictionDetails(e.target.value)} />}

        {/* CV Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">CV / Resume Upload <span className="text-gray-500">(PDF, DOC, DOCX — max 5MB)</span></label>
          <div className="border-2 border-dashed border-[#1B3A5C] rounded-xl p-6 text-center hover:border-[#00C9A7] transition cursor-pointer" onClick={() => document.getElementById("cv-upload")?.click()}>
            <input id="cv-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) handleCVUpload(e.target.files[0]); }} />
            {uploadingCV ? (
              <div className="flex items-center justify-center gap-2 text-[#00C9A7]"><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</div>
            ) : cvFile ? (
              <div className="flex items-center justify-center gap-2 text-[#00C9A7]"><Check className="w-5 h-5" /> {cvFile.name}</div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400"><Upload className="w-8 h-8" /><span>Click to upload your CV</span></div>
            )}
          </div>
        </div>

        {/* Declaration */}
        <div className="bg-[#0D1B2A]/60 border border-[#1B3A5C] rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-white">Applicant Declaration</h4>
          <p className="text-xs text-gray-400 leading-relaxed">I declare that the information given on this application form is true. I give permission for this information to be made available to the Regulatory Body and those authorised within the Company. I agree not to disclose confidential information to any third party without written consent. I understand that false information may affect the offer of work being made to me. I certify that I have answered all questions truthfully and fully and will notify the Company if there are any changes or updates to the information given.</p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={declarationAccepted} onChange={e => setDeclarationAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-[#00C9A7]" />
            <span className="text-sm text-gray-300">I accept the above declaration</span>
          </label>
          {errors.declaration && <p className="text-red-400 text-xs">{errors.declaration}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputField label="Print Name" required value={printName} onChange={e => setPrintName(e.target.value)} />
            {errors.printName && <p className="text-red-400 text-xs mt-1">{errors.printName}</p>}
          </div>
          <InputField label="Date" value={new Date().toISOString().split("T")[0]} readOnly className="!bg-[#0D1B2A] !text-gray-400 cursor-not-allowed" />
        </div>
      </div>
    );
  }

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6, renderStep7, renderStep8, renderStep9, renderStep10];

  /* ─── Main Render ─── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0D1B2A] border border-[#1B3A5C] rounded-2xl w-full max-w-3xl max-h-[95vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#1B3A5C]">
          <div>
            <h2 className="text-lg font-bold text-white">Apply: {job.title}</h2>
            <p className="text-sm text-gray-400">{job.company} · {job.sector}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1B3A5C] rounded-lg text-gray-400 hover:text-white transition">✕</button>
        </div>

        {/* Progress */}
        <ProgressBar />

        {/* Form Content */}
        <div ref={formRef} className="flex-1 overflow-y-auto px-6 py-6">
          {stepRenderers[step]()}
        </div>

        {/* Navigation */}
        <div className="border-t border-[#1B3A5C] px-6 py-4 flex items-center justify-between">
          <button onClick={step === 0 ? onClose : goBack} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#1B3A5C] text-gray-300 hover:bg-[#1B3A5C]/50 transition text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 9 ? (
            <button onClick={goNext} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00C9A7] to-[#00C3FF] text-[#0D1B2A] font-bold text-sm hover:opacity-90 transition">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#00C9A7] to-[#00C3FF] text-[#0D1B2A] font-bold text-sm hover:opacity-90 transition disabled:opacity-50">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Check className="w-4 h-4" /> Submit Application</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
