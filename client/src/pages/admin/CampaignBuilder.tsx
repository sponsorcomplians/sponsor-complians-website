import { trpc } from "@/lib/trpc";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ArrowRight, Check, Wand2, Loader2, Plus, Trash2,
  Type, Image, MousePointerClick, Minus, Columns2, Columns3,
  Link2, Share2, MessageSquare, Quote, Calendar, Podcast, Newspaper,
  GripVertical, Eye, Smartphone, Monitor, Moon, Send, Clock,
  AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Sparkles,
  RotateCcw, CheckCircle2, PlusCircle, X,
} from "lucide-react";
import { toast } from "sonner";

// Quick Links for the email builder
const QUICK_LINKS = [
  { label: "Homepage", url: "https://sponsorcomplians.com/" },
  { label: "Compliance Audit", url: "https://sponsorcomplians.com/sponsor-compliance-audit" },
  { label: "Recruitment", url: "https://sponsorcomplians.com/skilled-worker-recruitment-solutions" },
  { label: "HR Services", url: "https://sponsorcomplians.com/sponsor-hr-services" },
  { label: "Hub Software", url: "https://sponsorcomplians.com/sponsor-complians-hub" },
  { label: "Hub Demo", url: "https://sponsorcomplians.com/hub-demo" },
  { label: "Podcast", url: "https://sponsorcomplians.com/the-sponsorship-files" },
  { label: "Blog", url: "https://sponsorcomplians.com/blog" },
  { label: "Events", url: "https://sponsorcomplians.com/events" },
  { label: "Newsletter", url: "https://sponsorcomplians.com/newsletter" },
  { label: "Book Consultation", url: "https://sponsorcomplians.com/book-consultation" },
  { label: "Contact", url: "https://sponsorcomplians.com/contact" },
  { label: "Jobs", url: "https://sponsorcomplians.com/jobs" },
  { label: "Careers", url: "https://sponsorcomplians.com/careers" },
  { label: "Provider Websites", url: "https://sponsorcomplians.com/provider-websites" },
  { label: "Privacy Policy", url: "https://sponsorcomplians.com/privacy-policy" },
  { label: "Terms of Service", url: "https://sponsorcomplians.com/terms" },
];

const PERSONALISATION_TOKENS = [
  { token: "{{first_name}}", label: "First Name" },
  { token: "{{last_name}}", label: "Last Name" },
  { token: "{{company_name}}", label: "Company Name" },
  { token: "{{email}}", label: "Email" },
  { token: "{{subscription_date}}", label: "Subscription Date" },
];

type EmailBlock = {
  id: string;
  type: "header" | "text" | "image" | "button" | "divider" | "columns2" | "columns3" | "social" | "footer" | "cta_card" | "testimonial" | "blog_card" | "event_card" | "podcast_card";
  content: Record<string, any>;
};

const BLOCK_TYPES = [
  { type: "header", label: "Header + Logo", icon: Type },
  { type: "text", label: "Text Block", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "button", label: "Button", icon: MousePointerClick },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "columns2", label: "2 Columns", icon: Columns2 },
  { type: "columns3", label: "3 Columns", icon: Columns3 },
  { type: "social", label: "Social Links", icon: Share2 },
  { type: "footer", label: "Footer", icon: MessageSquare },
  { type: "cta_card", label: "CTA Card", icon: MousePointerClick },
  { type: "testimonial", label: "Testimonial", icon: Quote },
  { type: "blog_card", label: "Blog Post Card", icon: Newspaper },
  { type: "event_card", label: "Event Card", icon: Calendar },
  { type: "podcast_card", label: "Podcast Card", icon: Podcast },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getDefaultContent(type: string): Record<string, any> {
  switch (type) {
    case "header": return { logoUrl: "", title: "Sponsor ComplIANS" };
    case "text": return { html: "<p>Enter your text here...</p>" };
    case "image": return { src: "", alt: "", width: "100%" };
    case "button": return { text: "Click Here", url: "", color: "#0d9488" };
    case "divider": return { style: "solid" };
    case "columns2": return { left: "Column 1", right: "Column 2" };
    case "columns3": return { col1: "Column 1", col2: "Column 2", col3: "Column 3" };
    case "social": return { linkedin: "https://linkedin.com/company/sponsorcomplians", facebook: "https://facebook.com/profile.php?id=61572202899701", instagram: "https://instagram.com/sponsorcomplians", youtube: "https://youtube.com/channel/UCWCUNlwdJzgHtkC-pzKWJbg" };
    case "footer": return { companyName: "Sponsor ComplIANS", address: "915 High Road, North Finchley, London N12 8QJ", phone: "020 3618 6968", email: "info@sponsorcomplians.com" };
    case "cta_card": return { headline: "Ready to Get Started?", description: "Book your free compliance audit today.", buttonText: "Book Now", buttonUrl: "https://sponsorcomplians.com/book-consultation" };
    case "testimonial": return { quote: "Excellent service!", name: "John Smith", company: "ABC Care Ltd" };
    case "blog_card": return { title: "Latest Blog Post", excerpt: "Read our latest insights...", url: "https://sponsorcomplians.com/blog" };
    case "event_card": return { date: "", title: "Upcoming Event", description: "Join us for...", registerUrl: "" };
    case "podcast_card": return { title: "Latest Episode", description: "Listen to...", listenUrl: "https://sponsorcomplians.com/the-sponsorship-files" };
    default: return {};
  }
}

export default function CampaignBuilder({ onNavigate, editId }: { onNavigate: (page: string) => void; editId?: number }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [fromName, setFromName] = useState("Sponsor ComplIANS");
  const [fromEmail, setFromEmail] = useState("info@sponsorcomplians.com");
  const [replyTo, setReplyTo] = useState("info@sponsorcomplians.com");
  const [recipientListId, setRecipientListId] = useState<number | undefined>();
  const [blocks, setBlocks] = useState<EmailBlock[]>([
    { id: generateId(), type: "header", content: getDefaultContent("header") },
    { id: generateId(), type: "text", content: getDefaultContent("text") },
    { id: generateId(), type: "footer", content: getDefaultContent("footer") },
  ]);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "dark">("desktop");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sendMode, setSendMode] = useState<"now" | "schedule">("now");
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);
  const [generatingSubjects, setGeneratingSubjects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState<"professional" | "friendly" | "urgent" | "educational" | "promotional">("professional");
  const [generatingContent, setGeneratingContent] = useState(false);
  const [aiGeneratedBlocks, setAiGeneratedBlocks] = useState<EmailBlock[] | null>(null);

  const { data: existingCampaign } = trpc.emailCampaign.campaigns.getById.useQuery(
    { id: editId! },
    { enabled: !!editId }
  );

  useEffect(() => {
    if (existingCampaign) {
      setName(existingCampaign.name ?? "");
      setSubject(existingCampaign.subject ?? "");
      setPreviewText(existingCampaign.previewText ?? "");
      setFromName(existingCampaign.fromName ?? "Sponsor ComplIANS");
      setFromEmail(existingCampaign.fromEmail ?? "info@sponsorcomplians.com");
      setReplyTo(existingCampaign.replyTo ?? "info@sponsorcomplians.com");
      setRecipientListId(existingCampaign.recipientListId ?? undefined);
      if (existingCampaign.contentJson && Array.isArray(existingCampaign.contentJson)) {
        setBlocks(existingCampaign.contentJson as EmailBlock[]);
      }
      if (existingCampaign.scheduledAt) {
        setScheduledAt(new Date(existingCampaign.scheduledAt).toISOString().slice(0, 16));
        setSendMode("schedule");
      }
    }
  }, [existingCampaign]);

  const { data: lists } = trpc.emailCampaign.lists.listForSelect.useQuery();
  const createCampaign = trpc.emailCampaign.campaigns.create.useMutation();
  const updateCampaign = trpc.emailCampaign.campaigns.update.useMutation();
  const generateSubjectLines = trpc.emailCampaign.campaigns.generateSubjectLines.useMutation();
  const sendCampaign = trpc.emailCampaign.campaigns.send.useMutation();
  const scheduleCampaign = trpc.emailCampaign.campaigns.schedule.useMutation();
  const sendTestMutation = trpc.emailCampaign.campaigns.sendTest.useMutation();
  const generateContentMutation = trpc.emailCampaign.campaigns.generateEmailContent.useMutation();

  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) { toast.error("Describe what you want in the email"); return; }
    setGeneratingContent(true);
    try {
      const result = await generateContentMutation.mutateAsync({
        prompt: aiPrompt,
        tone: aiTone,
        campaignName: name || undefined,
      });
      const generated = (result.blocks || []).map((b: any) => ({
        id: generateId(),
        type: b.type,
        content: b.content,
      }));
      if (generated.length > 0) {
        setAiGeneratedBlocks(generated);
      } else {
        toast.error("AI returned no content. Try rephrasing your prompt.");
      }
    } catch {
      toast.error("Failed to generate content");
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleApplyAiContent = (mode: "replace" | "append") => {
    if (!aiGeneratedBlocks) return;
    if (mode === "replace") {
      setBlocks(aiGeneratedBlocks);
    } else {
      const footerIdx = blocks.findIndex(b => b.type === "footer");
      if (footerIdx > 0) {
        const before = blocks.slice(0, footerIdx);
        const after = blocks.slice(footerIdx);
        const newBlocks = aiGeneratedBlocks.filter(b => b.type !== "header" && b.type !== "footer" && b.type !== "social");
        setBlocks([...before, ...newBlocks, ...after]);
      } else {
        setBlocks([...blocks, ...aiGeneratedBlocks]);
      }
    }
    setAiGeneratedBlocks(null);
    setAiPrompt("");
    toast.success(`AI content ${mode === "replace" ? "applied" : "appended"}`);
  };

  // Generate email HTML from blocks
  const generateHtmlFromBlocks = (blockList: EmailBlock[]): string => {
    const renderBlock = (block: EmailBlock): string => {
      const c = block.content;
      switch (block.type) {
        case "header":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1B2A;padding:24px 32px;"><tr><td>${c.logoUrl ? `<img src="${c.logoUrl}" alt="Logo" style="height:40px;margin-right:12px;vertical-align:middle;"/>` : ""}<span style="color:#ffffff;font-size:22px;font-weight:700;font-family:'DM Sans',Arial,sans-serif;">${c.title || "Sponsor ComplIANS"}</span></td></tr></table>`;
        case "text":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td style="color:#1F2937;font-size:15px;line-height:1.6;font-family:'DM Sans',Arial,sans-serif;">${c.html || ""}</td></tr></table>`;
        case "image":
          return c.src ? `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td align="center"><img src="${c.src}" alt="${c.alt || ""}" style="max-width:${c.width || "100%"};height:auto;border-radius:8px;"/></td></tr></table>` : "";
        case "button":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td align="center"><a href="${c.url || "#"}" style="display:inline-block;background:${c.color || "#0d9488"};color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${c.text || "Click Here"}</a></td></tr></table>`;
        case "divider":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:8px 32px;"><tr><td><hr style="border:none;border-top:1px ${c.style || "solid"} #E5E7EB;"/></td></tr></table>`;
        case "columns2":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td width="50%" style="padding-right:8px;color:#1F2937;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${c.left || ""}</td><td width="50%" style="padding-left:8px;color:#1F2937;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${c.right || ""}</td></tr></table>`;
        case "columns3":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td width="33%" style="padding-right:8px;color:#1F2937;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${c.col1 || ""}</td><td width="33%" style="padding:0 4px;color:#1F2937;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${c.col2 || ""}</td><td width="33%" style="padding-left:8px;color:#1F2937;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${c.col3 || ""}</td></tr></table>`;
        case "social":
          const socials = [
            c.linkedin && `<a href="${c.linkedin}" style="margin:0 6px;">LinkedIn</a>`,
            c.facebook && `<a href="${c.facebook}" style="margin:0 6px;">Facebook</a>`,
            c.instagram && `<a href="${c.instagram}" style="margin:0 6px;">Instagram</a>`,
            c.youtube && `<a href="${c.youtube}" style="margin:0 6px;">YouTube</a>`,
          ].filter(Boolean).join(" | ");
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td align="center" style="font-size:13px;font-family:'DM Sans',Arial,sans-serif;">${socials}</td></tr></table>`;
        case "footer":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:24px 32px;"><tr><td align="center" style="color:#6B7280;font-size:12px;line-height:1.6;font-family:'DM Sans',Arial,sans-serif;"><strong>${c.companyName || ""}</strong><br/>${c.address || ""}<br/>${c.phone || ""} | ${c.email || ""}<br/><br/><a href="{{unsubscribe_url}}" style="color:#9CA3AF;text-decoration:underline;">Unsubscribe</a> | <a href="{{preferences_url}}" style="color:#9CA3AF;text-decoration:underline;">Email Preferences</a></td></tr></table>`;
        case "cta_card":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:24px;text-align:center;"><h3 style="color:#0d9488;margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;">${c.headline || ""}</h3><p style="color:#4B5563;margin:0 0 16px;font-size:14px;">${c.description || ""}</p><a href="${c.buttonUrl || "#"}" style="display:inline-block;background:#0d9488;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">${c.buttonText || "Learn More"}</a></td></tr></table>`;
        case "testimonial":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td style="background:#FFF7ED;border-left:4px solid #F59E0B;padding:20px;border-radius:0 8px 8px 0;"><p style="font-style:italic;color:#4B5563;margin:0 0 8px;font-size:15px;font-family:'DM Sans',Arial,sans-serif;">&ldquo;${c.quote || ""}&rdquo;</p><p style="color:#1F2937;font-weight:600;margin:0;font-size:13px;">${c.name || ""}${c.company ? `, ${c.company}` : ""}</p></td></tr></table>`;
        case "blog_card":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td style="border:1px solid #E5E7EB;border-radius:12px;padding:20px;"><h4 style="color:#1F2937;margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;">${c.title || ""}</h4><p style="color:#6B7280;margin:0 0 12px;font-size:14px;">${c.excerpt || ""}</p><a href="${c.url || "#"}" style="color:#0d9488;font-weight:600;font-size:13px;text-decoration:none;">Read More &rarr;</a></td></tr></table>`;
        case "event_card":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:20px;"><div style="color:#3B82F6;font-weight:700;font-size:12px;margin-bottom:4px;">${c.date || ""}</div><h4 style="color:#1F2937;margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;">${c.title || ""}</h4><p style="color:#6B7280;margin:0 0 12px;font-size:14px;">${c.description || ""}</p>${c.registerUrl ? `<a href="${c.registerUrl}" style="color:#3B82F6;font-weight:600;font-size:13px;text-decoration:none;">Register Now &rarr;</a>` : ""}</td></tr></table>`;
        case "podcast_card":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 32px;"><tr><td style="background:#F5F3FF;border:1px solid #DDD6FE;border-radius:12px;padding:20px;"><h4 style="color:#7C3AED;margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;">${c.title || ""}</h4><p style="color:#6B7280;margin:0 0 12px;font-size:14px;">${c.description || ""}</p><a href="${c.listenUrl || "#"}" style="color:#7C3AED;font-weight:600;font-size:13px;text-decoration:none;">Listen Now &rarr;</a></td></tr></table>`;
        default: return "";
      }
    };
    const bodyHtml = blockList.map(renderBlock).join("");
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${subject || "Email"}</title></head><body style="margin:0;padding:0;background:#F5F7FA;font-family:'DM Sans',Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;"><tr><td align="center" style="padding:24px 0;"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">${bodyHtml}</table></td></tr></table></body></html>`;
  };

  const handleGenerateSubjects = async () => {
    if (!name && !subject) {
      toast.error("Enter a campaign name or subject first");
      return;
    }
    setGeneratingSubjects(true);
    try {
      const result = await generateSubjectLines.mutateAsync({ topic: name || subject });
      setSubjectSuggestions(result.subjectLines);
    } catch {
      toast.error("Failed to generate subject lines");
    } finally {
      setGeneratingSubjects(false);
    }
  };

  const addBlock = (type: string) => {
    setBlocks(prev => [...prev, { id: generateId(), type: type as any, content: getDefaultContent(type) }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const updateBlockContent = (id: string, field: string, value: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: { ...b.content, [field]: value } } : b));
  };

  const handleSave = async (status: "draft" | "scheduled" | "sending" = "draft") => {
    if (!name) { toast.error("Campaign name is required"); return; }
    setSaving(true);
    try {
      const contentHtml = generateHtmlFromBlocks(blocks);
      let campaignId = editId;

      if (editId) {
        await updateCampaign.mutateAsync({
          id: editId,
          name,
          subject,
          previewText,
          fromName,
          fromEmail,
          replyTo,
          contentJson: blocks,
          contentHtml,
          recipientListId,
          status: status === "sending" ? "draft" : status, // don't set sending yet
          scheduledAt: status === "scheduled" ? scheduledAt : undefined,
        });
      } else {
        const result = await createCampaign.mutateAsync({
          name,
          subject,
          previewText,
          fromName,
          fromEmail,
          replyTo,
          contentJson: blocks,
          contentHtml,
          recipientListId,
        });
        campaignId = result?.id;
      }

      // If sending now, trigger the actual send
      if (status === "sending" && campaignId) {
        setSending(true);
        try {
          const sendResult = await sendCampaign.mutateAsync({ campaignId });
          toast.success(`Campaign sent! ${sendResult.totalSent} emails delivered, ${sendResult.totalFailed} failed.`);
        } catch (err: any) {
          toast.error(err.message || "Failed to send campaign");
        } finally {
          setSending(false);
        }
      } else if (status === "scheduled" && campaignId && scheduledAt) {
        await scheduleCampaign.mutateAsync({ campaignId, scheduledAt });
        toast.success("Campaign scheduled successfully");
      } else {
        toast.success(editId ? "Campaign updated" : "Campaign saved as draft");
      }

      onNavigate("campaigns");
    } catch {
      toast.error("Failed to save campaign");
    } finally {
      setSaving(false);
      setSending(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) { toast.error("Enter a test email address"); return; }
    if (!editId) { toast.error("Save the campaign first before sending a test"); return; }
    setSendingTest(true);
    try {
      // First save the latest content
      const contentHtml = generateHtmlFromBlocks(blocks);
      await updateCampaign.mutateAsync({
        id: editId,
        name,
        subject,
        previewText,
        fromName,
        fromEmail,
        replyTo,
        contentJson: blocks,
        contentHtml,
        recipientListId,
      });
      // Then send test
      await sendTestMutation.mutateAsync({ campaignId: editId, testEmail });
      toast.success(`Test email sent to ${testEmail}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  // Spam check
  const spamIssues = useMemo(() => {
    const issues: string[] = [];
    if (!subject) issues.push("Missing subject line");
    if (subject && subject.length > 60) issues.push("Subject line too long (>60 chars)");
    if (subject && /[A-Z]{5,}/.test(subject)) issues.push("Subject contains excessive capitals");
    if (!previewText) issues.push("Missing preview text");
    const hasFooter = blocks.some(b => b.type === "footer");
    if (!hasFooter) issues.push("Missing footer with unsubscribe link");
    const imageBlocks = blocks.filter(b => b.type === "image").length;
    const textBlocks = blocks.filter(b => b.type === "text").length;
    if (imageBlocks > textBlocks * 2) issues.push("Too many images relative to text (may trigger spam filters)");
    return issues;
  }, [subject, previewText, blocks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate("campaigns")} className="p-2 rounded-lg hover:bg-gray-100 text-[#6B7280] transition-colors" title="Back to All Campaigns">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {editId ? "Edit Campaign" : "Create Campaign"}
            </h1>
            <p className="text-[#6B7280] text-sm mt-0.5">Step {step} of 3</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Draft
          </Button>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {[
          { num: 1, label: "Setup" },
          { num: 2, label: "Design" },
          { num: 3, label: "Review & Send" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              step === s.num
                ? "bg-[#0d9488] text-white"
                : step > s.num
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-[#6B7280]"
            }`}
          >
            {step > s.num ? <Check className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">{s.num}</span>}
            {s.label}
          </button>
        ))}
      </div>

      {/* Step 1: Setup */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Campaign Name *</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. March Newsletter" className="max-w-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Subject Line</label>
            <div className="flex gap-2 max-w-lg">
              <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Your Weekly Compliance Update" className="flex-1" />
              <Button variant="outline" onClick={handleGenerateSubjects} disabled={generatingSubjects} className="gap-2 shrink-0">
                {generatingSubjects ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                AI Generate
              </Button>
            </div>
            {subjectSuggestions.length > 0 && (
              <div className="mt-3 space-y-2 max-w-lg">
                <p className="text-xs text-[#6B7280] font-medium">AI Suggestions (click to use):</p>
                {subjectSuggestions.map((s, i) => (
                  <button key={i} onClick={() => { setSubject(s); setSubjectSuggestions([]); }} className="block w-full text-left px-3 py-2 rounded-lg bg-[#0d9488]/5 hover:bg-[#0d9488]/10 text-sm text-[#374151] border border-[#0d9488]/20 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Preview Text</label>
            <Input value={previewText} onChange={e => setPreviewText(e.target.value)} placeholder="Short preview shown in inbox" className="max-w-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">From Name</label>
              <Input value={fromName} onChange={e => setFromName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">From Email</label>
              <Input value={fromEmail} onChange={e => setFromEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Reply-To</label>
              <Input value={replyTo} onChange={e => setReplyTo(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Recipient List</label>
            <select
              value={recipientListId ?? ""}
              onChange={e => setRecipientListId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full max-w-lg rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
            >
              <option value="">Select a list...</option>
              {lists?.map((l: any) => (
                <option key={l.id} value={l.id}>{l.name} ({l.memberCount} contacts)</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
              Next: Design <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Design */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Email Editor */}
          <div className="space-y-4">
            {/* Preview Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
              <button onClick={() => setPreviewMode("desktop")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${previewMode === "desktop" ? "bg-[#0d9488] text-white" : "text-[#6B7280] hover:bg-gray-100"}`}>
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button onClick={() => setPreviewMode("mobile")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${previewMode === "mobile" ? "bg-[#0d9488] text-white" : "text-[#6B7280] hover:bg-gray-100"}`}>
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button onClick={() => setPreviewMode("dark")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${previewMode === "dark" ? "bg-[#0d9488] text-white" : "text-[#6B7280] hover:bg-gray-100"}`}>
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>

            {/* Email Canvas */}
            <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""} ${previewMode === "dark" ? "bg-[#1a1a2e]" : ""}`}>
              <div className="p-4 space-y-3">
                {blocks.map((block, idx) => (
                  <div key={block.id} className="group relative border border-dashed border-transparent hover:border-[#0d9488]/40 rounded-lg transition-colors">
                    {/* Block Controls */}
                    <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-100 px-1 py-0.5 z-10">
                      <button onClick={() => moveBlock(block.id, "up")} disabled={idx === 0} className="p-1 rounded hover:bg-gray-100 text-[#6B7280] disabled:opacity-30">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveBlock(block.id, "down")} disabled={idx === blocks.length - 1} className="p-1 rounded hover:bg-gray-100 text-[#6B7280] disabled:opacity-30">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeBlock(block.id)} className="p-1 rounded hover:bg-red-50 text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Block Render */}
                    <div className="p-3">
                      {block.type === "header" && (
                        <div className="bg-[#0f172a] rounded-lg p-6 text-center">
                          <div className="text-white font-bold text-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            <input
                              value={block.content.title}
                              onChange={e => updateBlockContent(block.id, "title", e.target.value)}
                              className="bg-transparent text-center w-full outline-none text-white font-bold text-xl"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            />
                          </div>
                        </div>
                      )}
                      {block.type === "text" && (
                        <textarea
                          value={block.content.html?.replace(/<[^>]*>/g, "") || ""}
                          onChange={e => updateBlockContent(block.id, "html", `<p>${e.target.value}</p>`)}
                          className="w-full min-h-[80px] text-sm text-[#374151] border border-gray-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
                          placeholder="Enter your text..."
                        />
                      )}
                      {block.type === "image" && (
                        <div className="space-y-2">
                          <Input
                            value={block.content.src}
                            onChange={e => updateBlockContent(block.id, "src", e.target.value)}
                            placeholder="Image URL"
                            className="text-sm"
                          />
                          {block.content.src ? (
                            <img src={block.content.src} alt={block.content.alt} className="w-full rounded-lg" />
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-[#9CA3AF] text-sm">
                              <Image className="w-6 h-6 mr-2" /> Image Preview
                            </div>
                          )}
                        </div>
                      )}
                      {block.type === "button" && (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input value={block.content.text} onChange={e => updateBlockContent(block.id, "text", e.target.value)} placeholder="Button text" className="text-sm" />
                            <Input value={block.content.url} onChange={e => updateBlockContent(block.id, "url", e.target.value)} placeholder="Button URL" className="text-sm" />
                          </div>
                          <div className="text-center">
                            <span className="inline-block px-6 py-2.5 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: block.content.color }}>
                              {block.content.text || "Button"}
                            </span>
                          </div>
                        </div>
                      )}
                      {block.type === "divider" && <hr className="border-gray-200 my-2" />}
                      {block.type === "social" && (
                        <div className="flex items-center justify-center gap-4 py-3">
                          {["LinkedIn", "Facebook", "Instagram", "YouTube"].map(s => (
                            <span key={s} className="text-xs text-[#0d9488] font-medium hover:underline cursor-pointer">{s}</span>
                          ))}
                        </div>
                      )}
                      {block.type === "footer" && (
                        <div className="bg-[#0f172a] rounded-lg p-6 text-center text-xs text-slate-400 space-y-2">
                          <p className="font-medium text-white">{block.content.companyName}</p>
                          <p>{block.content.address}</p>
                          <p>{block.content.phone} | {block.content.email}</p>
                          <div className="flex items-center justify-center gap-3 text-[#0d9488]">
                            <span className="hover:underline cursor-pointer">Website</span>
                            <span className="hover:underline cursor-pointer">Audit</span>
                            <span className="hover:underline cursor-pointer">Recruitment</span>
                            <span className="hover:underline cursor-pointer">Hub</span>
                          </div>
                          <p className="text-slate-500 mt-2">
                            <span className="hover:underline cursor-pointer">Unsubscribe</span> | <span className="hover:underline cursor-pointer">Update Preferences</span> | <span className="hover:underline cursor-pointer">Privacy Policy</span>
                          </p>
                          <p className="text-slate-600">&copy; 2026 Sponsor ComplIANS. All rights reserved.</p>
                        </div>
                      )}
                      {block.type === "cta_card" && (
                        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-xl p-6 text-center border border-[#1B3A5C]/30">
                          <input value={block.content.headline} onChange={e => updateBlockContent(block.id, "headline", e.target.value)} className="bg-transparent text-white font-bold text-lg w-full text-center outline-none mb-2" />
                          <input value={block.content.description} onChange={e => updateBlockContent(block.id, "description", e.target.value)} className="bg-transparent text-slate-400 text-sm w-full text-center outline-none mb-4" />
                          <span className="inline-block px-6 py-2.5 rounded-lg bg-[#0d9488] text-white font-medium text-sm">{block.content.buttonText}</span>
                        </div>
                      )}
                      {block.type === "testimonial" && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <Quote className="w-5 h-5 text-[#0d9488] mb-2" />
                          <textarea value={block.content.quote} onChange={e => updateBlockContent(block.id, "quote", e.target.value)} className="w-full bg-transparent text-sm text-[#374151] italic outline-none resize-none" rows={2} />
                          <div className="mt-3 flex items-center gap-2">
                            <input value={block.content.name} onChange={e => updateBlockContent(block.id, "name", e.target.value)} className="bg-transparent text-sm font-medium text-[#1F2937] outline-none" placeholder="Name" />
                            <span className="text-[#9CA3AF]">—</span>
                            <input value={block.content.company} onChange={e => updateBlockContent(block.id, "company", e.target.value)} className="bg-transparent text-sm text-[#6B7280] outline-none" placeholder="Company" />
                          </div>
                        </div>
                      )}
                      {(block.type === "blog_card" || block.type === "event_card" || block.type === "podcast_card") && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-2">
                          <Badge variant="outline" className="text-xs text-[#0d9488] border-[#0d9488]/30">
                            {block.type === "blog_card" ? "Blog" : block.type === "event_card" ? "Event" : "Podcast"}
                          </Badge>
                          <input value={block.content.title} onChange={e => updateBlockContent(block.id, "title", e.target.value)} className="w-full bg-transparent font-medium text-[#1F2937] outline-none text-sm" placeholder="Title" />
                          <input value={block.content.description || block.content.excerpt} onChange={e => updateBlockContent(block.id, block.type === "blog_card" ? "excerpt" : "description", e.target.value)} className="w-full bg-transparent text-[#6B7280] text-xs outline-none" placeholder="Description" />
                        </div>
                      )}
                      {block.type === "columns2" && (
                        <div className="grid grid-cols-2 gap-3">
                          <textarea value={block.content.left} onChange={e => updateBlockContent(block.id, "left", e.target.value)} className="border border-gray-200 rounded-lg p-3 text-sm resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30" />
                          <textarea value={block.content.right} onChange={e => updateBlockContent(block.id, "right", e.target.value)} className="border border-gray-200 rounded-lg p-3 text-sm resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30" />
                        </div>
                      )}
                      {block.type === "columns3" && (
                        <div className="grid grid-cols-3 gap-3">
                          {["col1", "col2", "col3"].map(col => (
                            <textarea key={col} value={block.content[col]} onChange={e => updateBlockContent(block.id, col, e.target.value)} className="border border-gray-200 rounded-lg p-3 text-sm resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                Next: Review <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Sidebar - AI + Block Palette + Quick Links */}
          <div className="space-y-4">
            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-xl shadow-sm p-4 border border-[#1B3A5C]/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
              </div>
              <textarea
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Describe the email you want, e.g. 'A newsletter about the latest Home Office compliance changes with a CTA to book an audit'"
                className="w-full rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-400 text-xs p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                rows={3}
              />
              <div className="mt-2">
                <label className="block text-[10px] text-slate-400 mb-1">Tone</label>
                <select
                  value={aiTone}
                  onChange={e => setAiTone(e.target.value as any)}
                  className="w-full rounded-lg bg-white/10 border border-white/10 text-white text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500/40 [&>option]:text-[#1F2937]"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="urgent">Urgent</option>
                  <option value="educational">Educational</option>
                  <option value="promotional">Promotional</option>
                </select>
              </div>
              <button
                onClick={handleGenerateContent}
                disabled={generatingContent || !aiPrompt.trim()}
                className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingContent ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5" /> Generate Email Content</>
                )}
              </button>
              {aiGeneratedBlocks && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[10px] font-medium">{aiGeneratedBlocks.length} blocks generated</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleApplyAiContent("replace")}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-medium transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Replace All
                    </button>
                    <button
                      onClick={() => handleApplyAiContent("append")}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-[10px] font-medium transition-colors"
                    >
                      <PlusCircle className="w-3 h-3" /> Append
                    </button>
                    <button
                      onClick={() => setAiGeneratedBlocks(null)}
                      className="flex items-center justify-center px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-medium transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Add Blocks */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-semibold text-[#1F2937] text-sm mb-3">Add Block</h3>
              <div className="grid grid-cols-2 gap-2">
                {BLOCK_TYPES.map(bt => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-gray-100 hover:border-[#0d9488]/30 hover:bg-[#0d9488]/5 text-[#6B7280] hover:text-[#0d9488] transition-all text-xs"
                  >
                    <bt.icon className="w-4 h-4" />
                    <span className="leading-tight text-center">{bt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <button onClick={() => setShowQuickLinks(!showQuickLinks)} className="flex items-center justify-between w-full text-sm font-semibold text-[#1F2937]">
                <span className="flex items-center gap-2"><Link2 className="w-4 h-4 text-[#0d9488]" /> Quick Links</span>
                {showQuickLinks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showQuickLinks && (
                <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto">
                  {QUICK_LINKS.map(link => (
                    <button
                      key={link.url}
                      onClick={() => { navigator.clipboard.writeText(link.url); toast.success(`Copied: ${link.label}`); }}
                      className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs text-[#4B5563] hover:bg-[#0d9488]/5 hover:text-[#0d9488] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Personalisation Tokens */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <button onClick={() => setShowTokens(!showTokens)} className="flex items-center justify-between w-full text-sm font-semibold text-[#1F2937]">
                <span className="flex items-center gap-2"><Type className="w-4 h-4 text-[#3b82f6]" /> Personalisation</span>
                {showTokens ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showTokens && (
                <div className="mt-3 space-y-1.5">
                  {PERSONALISATION_TOKENS.map(t => (
                    <button
                      key={t.token}
                      onClick={() => { navigator.clipboard.writeText(t.token); toast.success(`Copied: ${t.token}`); }}
                      className="flex items-center justify-between w-full px-2 py-1.5 rounded text-xs hover:bg-[#3b82f6]/5 transition-colors"
                    >
                      <span className="text-[#4B5563]">{t.label}</span>
                      <code className="text-[#3b82f6] bg-[#3b82f6]/10 px-1.5 py-0.5 rounded text-[10px]">{t.token}</code>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review & Send */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Campaign Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#6B7280]">Name:</span> <span className="font-medium text-[#1F2937] ml-2">{name || "—"}</span></div>
              <div><span className="text-[#6B7280]">Subject:</span> <span className="font-medium text-[#1F2937] ml-2">{subject || "—"}</span></div>
              <div><span className="text-[#6B7280]">From:</span> <span className="font-medium text-[#1F2937] ml-2">{fromName} &lt;{fromEmail}&gt;</span></div>
              <div><span className="text-[#6B7280]">Reply-To:</span> <span className="font-medium text-[#1F2937] ml-2">{replyTo}</span></div>
              <div><span className="text-[#6B7280]">Preview:</span> <span className="font-medium text-[#1F2937] ml-2">{previewText || "—"}</span></div>
              <div><span className="text-[#6B7280]">Blocks:</span> <span className="font-medium text-[#1F2937] ml-2">{blocks.length} content blocks</span></div>
            </div>
          </div>

          {/* Spam Check */}
          {spamIssues.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-medium text-amber-800 text-sm">Spam Check Warnings</h3>
              </div>
              <ul className="space-y-1">
                {spamIssues.map((issue, i) => (
                  <li key={i} className="text-xs text-amber-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Send Test Email */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Send Test Email</h2>
            <p className="text-xs text-[#6B7280]">Send a preview to yourself before sending to your full list.</p>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  type="email"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="max-w-sm"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleSendTest}
                disabled={sendingTest || !editId}
                className="gap-2"
              >
                {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Test
              </Button>
            </div>
            {!editId && <p className="text-xs text-amber-600">Save the campaign as a draft first to enable test sends.</p>}
          </div>

          {/* Send Options */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Send Options</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setSendMode("now")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${sendMode === "now" ? "border-[#0d9488] bg-[#0d9488]/5" : "border-gray-200 hover:border-gray-300"}`}
              >
                <Send className={`w-5 h-5 mb-2 ${sendMode === "now" ? "text-[#0d9488]" : "text-[#9CA3AF]"}`} />
                <div className={`font-medium text-sm ${sendMode === "now" ? "text-[#0d9488]" : "text-[#4B5563]"}`}>Send Now</div>
                <div className="text-xs text-[#9CA3AF] mt-1">Send immediately to all recipients</div>
              </button>
              <button
                onClick={() => setSendMode("schedule")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${sendMode === "schedule" ? "border-[#0d9488] bg-[#0d9488]/5" : "border-gray-200 hover:border-gray-300"}`}
              >
                <Clock className={`w-5 h-5 mb-2 ${sendMode === "schedule" ? "text-[#0d9488]" : "text-[#9CA3AF]"}`} />
                <div className={`font-medium text-sm ${sendMode === "schedule" ? "text-[#0d9488]" : "text-[#4B5563]"}`}>Schedule</div>
                <div className="text-xs text-[#9CA3AF] mt-1">Choose a specific date and time</div>
              </button>
            </div>

            {sendMode === "schedule" && (
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Schedule Date & Time</label>
                <Input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="max-w-sm" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Design
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave(sendMode === "schedule" ? "scheduled" : "sending")}
                disabled={saving || sending}
                className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
              >
                {(saving || sending) ? <Loader2 className="w-4 h-4 animate-spin" /> : sendMode === "schedule" ? <Clock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {sending ? "Sending..." : sendMode === "schedule" ? "Schedule Campaign" : "Send Campaign"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
