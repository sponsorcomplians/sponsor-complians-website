import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Wand2, Loader2, Check, X, Clock, Send, RefreshCw, SkipForward,
  Eye, Smartphone, Monitor, Edit, Calendar, Rss, Plus, Trash2,
  ExternalLink, Globe, Newspaper, Podcast, Briefcase,
} from "lucide-react";
import { toast } from "sonner";

const DAY_FORMATS: Record<string, { label: string; description: string }> = {
  monday: { label: "Weekly Compliance Briefing", description: "Top 3 news stories + upcoming events" },
  tuesday: { label: "Deep Dive", description: "One topic explored in depth from recent content" },
  wednesday: { label: "Quick Tips", description: "3 practical compliance tips with links" },
  thursday: { label: "Industry Pulse", description: "Latest stats, data, Home Office updates" },
  friday: { label: "Weekend Read", description: "Featured blog post or podcast + what's next week" },
};

export default function AIDailyEmail({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState<"drafts" | "sources" | "settings">("drafts");
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceType, setNewSourceType] = useState("rss");

  const { data: drafts, isLoading: draftsLoading } = trpc.emailCampaign.dailyEmail.list.useQuery({ limit: 14 });
  const { data: sources, isLoading: sourcesLoading } = trpc.emailCampaign.contentSources.list.useQuery();
  const approveDraft = trpc.emailCampaign.dailyEmail.approve.useMutation();
  const skipDraft = trpc.emailCampaign.dailyEmail.reject.useMutation();
  const regenerateDraft = trpc.emailCampaign.dailyEmail.regenerate.useMutation();
  const createSource = trpc.emailCampaign.contentSources.create.useMutation();
  const deleteSource = trpc.emailCampaign.contentSources.delete.useMutation();
  const utils = trpc.useUtils();

  const handleApprove = async (id: number, subjectOption?: number) => {
    try {
      await approveDraft.mutateAsync({ id });
      utils.emailCampaign.dailyEmail.list.invalidate();
      toast.success("Email approved and scheduled!");
    } catch {
      toast.error("Failed to approve email");
    }
  };

  const handleSkip = async (id: number) => {
    try {
      await skipDraft.mutateAsync({ id });
      utils.emailCampaign.dailyEmail.list.invalidate();
      toast.success("Email skipped for today");
    } catch {
      toast.error("Failed to skip email");
    }
  };

  const handleRegenerate = async (id: number) => {
    try {
      await regenerateDraft.mutateAsync({ id });
      utils.emailCampaign.dailyEmail.list.invalidate();
      toast.success("Regenerating email...");
    } catch {
      toast.error("Failed to regenerate");
    }
  };

  const handleAddSource = async () => {
    if (!newSourceName.trim()) { toast.error("Source name is required"); return; }
    try {
      await createSource.mutateAsync({
        name: newSourceName,
        type: newSourceType as any,
        url: newSourceUrl || undefined,
      });
      utils.emailCampaign.contentSources.list.invalidate();
      setShowAddSource(false);
      setNewSourceName("");
      setNewSourceUrl("");
      toast.success("Content source added");
    } catch {
      toast.error("Failed to add source");
    }
  };

  const handleDeleteSource = async (id: number) => {
    if (!confirm("Remove this content source?")) return;
    try {
      await deleteSource.mutateAsync({ id });
      utils.emailCampaign.contentSources.list.invalidate();
      toast.success("Source removed");
    } catch {
      toast.error("Failed to remove source");
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-200",
    approved: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    sent: "bg-blue-500/10 text-blue-600 border-blue-200",
    skipped: "bg-slate-500/10 text-slate-500 border-slate-200",
    generating: "bg-purple-500/10 text-purple-600 border-purple-200",
  };

  const sourceTypeIcons: Record<string, React.ReactNode> = {
    rss: <Rss className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />,
    api: <Newspaper className="w-4 h-4" />,
    manual: <Edit className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Wand2 className="w-6 h-6 inline-block mr-2 text-[#0d9488]" />
            AI Daily Email
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">AI-generated daily emails with your approval before sending</p>
        </div>
      </div>

      {/* Day Format Schedule */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-xl p-5 border border-[#1B3A5C]/30">
        <h3 className="text-white font-medium text-sm mb-3">Weekly Email Schedule</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(DAY_FORMATS).map(([day, format]) => (
            <div key={day} className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-[#0d9488] text-xs font-medium capitalize mb-1">{day}</div>
              <div className="text-white text-xs font-medium">{format.label}</div>
              <div className="text-slate-400 text-[10px] mt-1">{format.description}</div>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-[10px] mt-3">Saturday & Sunday: No auto-generation (manual trigger available)</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { id: "drafts" as const, label: "Daily Drafts" },
          { id: "sources" as const, label: "Content Sources" },
          { id: "settings" as const, label: "Settings" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Drafts Tab */}
      {activeTab === "drafts" && (
        <div className="space-y-4">
          {draftsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#0d9488]" />
            </div>
          ) : !drafts?.length ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <Wand2 className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
              <h3 className="text-[#6B7280] font-medium mb-2">No daily email drafts yet</h3>
              <p className="text-[#9CA3AF] text-sm mb-4">AI will generate daily drafts by 8pm UK time. Check back later.</p>
            </div>
          ) : (
            drafts.map((draft: any) => (
              <div key={draft.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-[#1F2937]">
                          {new Date(draft.targetDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </h3>
                        <Badge variant="outline" className={`text-[10px] ${statusColors[draft.status] || statusColors.pending}`}>
                          {draft.status}
                        </Badge>
                      </div>
                      {draft.dayType && (
                        <p className="text-xs text-[#0d9488] font-medium">{DAY_FORMATS[draft.dayType]?.label || draft.dayType}</p>
                      )}
                    </div>
                    <div className="text-xs text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {draft.scheduledSendTime ? new Date(draft.scheduledSendTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "7:30 AM"}
                    </div>
                  </div>

                  {/* Subject Lines */}
                  {draft.subjectOptions && (
                    <div className="mb-4">
                      <p className="text-xs text-[#6B7280] font-medium mb-2">Subject Line Options:</p>
                      <div className="space-y-1.5">
                        {(typeof draft.subjectOptions === "string" ? JSON.parse(draft.subjectOptions) : draft.subjectOptions)?.map?.((subj: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => draft.status === "pending" && handleApprove(draft.id, idx)}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                              draft.selectedSubjectIndex === idx
                                ? "border-[#0d9488] bg-[#0d9488]/5 text-[#0d9488]"
                                : "border-gray-100 text-[#4B5563] hover:border-[#0d9488]/30 hover:bg-[#0d9488]/5"
                            }`}
                          >
                            <span className="text-xs text-[#9CA3AF] mr-2">#{idx + 1}</span>
                            {subj}
                          </button>
                        )) || <p className="text-[#9CA3AF] text-xs">No subject options generated</p>}
                      </div>
                    </div>
                  )}

                  {/* Preview Text */}
                  {draft.previewText && (
                    <p className="text-sm text-[#6B7280] mb-4 italic">{draft.previewText}</p>
                  )}

                  {/* Actions */}
                  {draft.status === "pending" && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                      <Button size="sm" onClick={() => handleApprove(draft.id)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-1 text-xs">
                        <Check className="w-3 h-3" /> Approve & Schedule
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRegenerate(draft.id)} className="gap-1 text-xs">
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSkip(draft.id)} className="gap-1 text-xs text-[#9CA3AF]">
                        <SkipForward className="w-3 h-3" /> Skip Today
                      </Button>
                    </div>
                  )}
                  {draft.status === "approved" && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600 font-medium">Approved — sending at scheduled time</span>
                    </div>
                  )}
                  {draft.status === "sent" && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Send className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-600 font-medium">Sent successfully</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content Sources Tab */}
      {activeTab === "sources" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddSource(true)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add Source
            </Button>
          </div>

          {/* Add Source Modal */}
          {showAddSource && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#1F2937]">Add Content Source</h2>
                  <button onClick={() => setShowAddSource(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Source Name *</label>
                    <Input value={newSourceName} onChange={e => setNewSourceName(e.target.value)} placeholder="e.g. Gov.uk Immigration News" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Type</label>
                    <select value={newSourceType} onChange={e => setNewSourceType(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30">
                      <option value="rss">RSS Feed</option>
                      <option value="website">Website</option>
                      <option value="api">API</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">URL</label>
                    <Input value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowAddSource(false)}>Cancel</Button>
                    <Button onClick={handleAddSource} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white">Add Source</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Default Sources */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-medium text-[#1F2937] mb-3 text-sm">Recommended Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { name: "Sponsor ComplIANS Blog", url: "sponsorcomplians.com/blog", type: "rss" },
                { name: "The Sponsorship Files Podcast", url: "sponsorcomplians.com/the-sponsorship-files", type: "rss" },
                { name: "UKVI News (Gov.uk)", url: "gov.uk/government/organisations/uk-visas-and-immigration", type: "website" },
                { name: "Home Office News", url: "gov.uk/government/organisations/home-office", type: "website" },
                { name: "Free Movement Blog", url: "freemovement.org.uk/feed", type: "rss" },
                { name: "CQC News", url: "cqc.org.uk/news", type: "website" },
                { name: "Skills for Care", url: "skillsforcare.org.uk/news", type: "website" },
              ].map(src => (
                <div key={src.url} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    {sourceTypeIcons[src.type]}
                    <span className="text-[#4B5563] font-medium">{src.name}</span>
                  </div>
                  <span className="text-[#9CA3AF] truncate max-w-[150px]">{src.url}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Sources */}
          {sourcesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#0d9488]" />
            </div>
          ) : sources?.length ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-medium text-[#1F2937] mb-3 text-sm">Your Content Sources</h3>
              <div className="space-y-2">
                {sources.map((src: any) => (
                  <div key={src.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0d9488]/10 flex items-center justify-center text-[#0d9488]">
                        {sourceTypeIcons[src.type] || <Globe className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1F2937]">{src.name}</div>
                        {src.url && <div className="text-[10px] text-[#9CA3AF] truncate max-w-[300px]">{src.url}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] ${src.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                        {src.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <button onClick={() => handleDeleteSource(src.id)} className="p-1 rounded hover:bg-red-50 text-[#9CA3AF] hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-medium text-[#1F2937] mb-4">AI Daily Email Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Default Send Time</label>
                <Input type="time" defaultValue="07:30" className="max-w-[200px]" />
                <p className="text-[10px] text-[#9CA3AF] mt-1">UK time</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Approval Deadline</label>
                <Input type="time" defaultValue="20:00" className="max-w-[200px]" />
                <p className="text-[10px] text-[#9CA3AF] mt-1">If not approved by this time, email will not be sent</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Active Days</label>
                <div className="flex gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                    <button
                      key={day}
                      className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                        idx < 5
                          ? "bg-[#0d9488] text-white"
                          : "bg-gray-100 text-[#9CA3AF]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Frequency Cap</label>
                <select className="w-full max-w-[200px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30">
                  <option value="daily">Daily (Mon-Fri)</option>
                  <option value="3x">3x per week (AI picks best days)</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-medium text-[#1F2937] mb-3">Tone & Style</h3>
            <p className="text-sm text-[#6B7280] mb-3">Professional but approachable. Not salesy. Informative. Position Sponsor ComplIANS as the expert authority.</p>
            <div className="max-w-lg">
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Max Content Blocks per Email</label>
              <select className="w-full max-w-[200px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30">
                <option value="3">3 blocks</option>
                <option value="4">4 blocks</option>
                <option value="5" selected>5 blocks (recommended)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Settings saved")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white">
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
