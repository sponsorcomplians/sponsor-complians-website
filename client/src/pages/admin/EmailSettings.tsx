import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings, Mail, Shield, Globe, FileText, Bell, Save,
  CheckCircle, AlertTriangle, ExternalLink, Lock, Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function EmailSettings({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeSection, setActiveSection] = useState("sender");

  const sections = [
    { id: "sender", label: "Sender Defaults", icon: Mail },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "branding", label: "Branding", icon: Globe },
    { id: "gdpr", label: "GDPR / Consent", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Email Settings
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">Configure your email campaign defaults, compliance, and branding</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                  activeSection === section.id
                    ? "border-l-[#0d9488] bg-[#0d9488]/5 text-[#0d9488]"
                    : "border-l-transparent text-[#6B7280] hover:bg-gray-50 hover:text-[#1F2937]"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Sender Defaults */}
          {activeSection === "sender" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="font-semibold text-[#1F2937]">Sender Defaults</h2>
              <p className="text-sm text-[#6B7280]">These values are used as defaults when creating new campaigns.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">From Name</label>
                  <Input defaultValue="Sponsor ComplIANS" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">From Email</label>
                  <Input defaultValue="hello@sponsorcomplians.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Reply-To Email</label>
                  <Input defaultValue="info@sponsorcomplians.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Default Subject Prefix</label>
                  <Input placeholder="e.g. [SC Update]" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium text-[#1F2937] text-sm mb-3">Email Service Provider</h3>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 max-w-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">ESP not configured</p>
                    <p className="text-xs text-amber-600 mt-0.5">Connect an email service provider (e.g. SendGrid, Mailgun, Amazon SES) to start sending campaigns.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Sender defaults saved")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Compliance */}
          {activeSection === "compliance" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="font-semibold text-[#1F2937]">Compliance Settings</h2>
              <p className="text-sm text-[#6B7280]">Ensure all emails meet UK GDPR and PECR requirements.</p>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Company Name</label>
                  <Input defaultValue="Sponsor ComplIANS Ltd" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Registered Address</label>
                  <Input defaultValue="915 High Road, North Finchley, London N12 8QJ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Company Registration Number</label>
                  <Input placeholder="e.g. 12345678" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">ICO Registration Number</label>
                  <Input placeholder="e.g. ZA123456" />
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Auto-compliance Features</span>
                  </div>
                  <div className="space-y-2 text-xs text-blue-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" /> Unsubscribe link automatically added to every email footer
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" /> Physical address included in all email footers
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" /> Double opt-in available for new subscribers
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" /> Consent records stored with timestamp and source
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" /> Data export and deletion requests handled automatically
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Compliance settings saved")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Branding */}
          {activeSection === "branding" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="font-semibold text-[#1F2937]">Email Branding</h2>
              <p className="text-sm text-[#6B7280]">Set default branding for all email templates.</p>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Logo URL</label>
                  <Input placeholder="https://..." />
                  <p className="text-[10px] text-[#9CA3AF] mt-1">Recommended: 200x50px PNG with transparent background</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Primary Colour</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: "#0d9488" }} />
                      <Input defaultValue="#0d9488" className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Secondary Colour</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ backgroundColor: "#0D1B2A" }} />
                      <Input defaultValue="#0D1B2A" className="flex-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Email Footer Text</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 min-h-[80px]"
                    defaultValue="You are receiving this email because you subscribed to updates from Sponsor ComplIANS. If you no longer wish to receive these emails, you can unsubscribe at any time."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Social Links</label>
                  <div className="space-y-2">
                    <Input placeholder="LinkedIn URL" defaultValue="https://linkedin.com/company/sponsorcomplians" />
                    <Input placeholder="Twitter/X URL" />
                    <Input placeholder="Facebook URL" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Branding saved")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* GDPR / Consent */}
          {activeSection === "gdpr" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="font-semibold text-[#1F2937]">GDPR & Consent Management</h2>
              <p className="text-sm text-[#6B7280]">Manage consent preferences and data processing for email subscribers.</p>
              <div className="space-y-4 max-w-2xl">
                <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#374151]">Double Opt-in</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">Enabled</Badge>
                  </div>
                  <p className="text-xs text-[#6B7280]">New subscribers must confirm their email address before being added to your list. Required under UK GDPR.</p>
                </div>
                <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#374151]">Consent Record Keeping</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">Active</Badge>
                  </div>
                  <p className="text-xs text-[#6B7280]">All consent actions are logged with timestamp, IP address, and source for audit purposes.</p>
                </div>
                <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#374151]">Right to Erasure</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">Automated</Badge>
                  </div>
                  <p className="text-xs text-[#6B7280]">When a contact requests data deletion, all personal data is removed within 72 hours. Campaign analytics are anonymised.</p>
                </div>
                <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#374151]">Data Export</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">Available</Badge>
                  </div>
                  <p className="text-xs text-[#6B7280]">Contacts can request a full export of their data in machine-readable format (JSON/CSV).</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Privacy Policy URL</label>
                  <Input defaultValue="https://sponsorcomplians.com/privacy-policy" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Consent Text (shown on subscribe forms)</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 min-h-[80px]"
                    defaultValue="I agree to receive email communications from Sponsor ComplIANS. I understand I can unsubscribe at any time. View our Privacy Policy."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("GDPR settings saved")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="font-semibold text-[#1F2937]">Email Notifications</h2>
              <p className="text-sm text-[#6B7280]">Configure when you receive notifications about your email campaigns.</p>
              <div className="space-y-3 max-w-2xl">
                {[
                  { label: "Campaign sent successfully", description: "Receive a notification when a campaign finishes sending", enabled: true },
                  { label: "Daily AI email ready for review", description: "Get notified when the AI generates a new daily email draft", enabled: true },
                  { label: "Bounce rate exceeds threshold", description: "Alert when bounce rate exceeds 5% on any campaign", enabled: true },
                  { label: "New subscriber", description: "Notification for each new subscriber (can be noisy)", enabled: false },
                  { label: "Unsubscribe", description: "Notification when someone unsubscribes", enabled: false },
                  { label: "Weekly performance digest", description: "Summary of all campaign performance sent every Monday", enabled: true },
                ].map(notif => (
                  <div key={notif.label} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div>
                      <div className="text-sm font-medium text-[#374151]">{notif.label}</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">{notif.description}</div>
                    </div>
                    <button
                      className={`relative w-11 h-6 rounded-full transition-colors ${notif.enabled ? "bg-[#0d9488]" : "bg-gray-200"}`}
                      onClick={() => toast.info("Feature coming soon")}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notif.enabled ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Notification settings saved")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
