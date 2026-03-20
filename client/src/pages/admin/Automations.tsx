import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Zap, Trash2, Edit, Loader2, Search, Play, Pause,
  ArrowRight, Mail, Clock, Tag, Users, Bell, GitBranch,
  X, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

const PRE_BUILT_AUTOMATIONS = [
  {
    name: "Welcome Series",
    description: "New subscriber → Welcome email → Day 2: What we do → Day 5: Book audit → Day 10: Meet the Hub",
    trigger: "subscriber_added",
    steps: 4,
    icon: "👋",
  },
  {
    name: "Webinar Follow-up",
    description: "Attended webinar → Thank you → Day 1: Recording → Day 3: Book consultation",
    trigger: "tag_added",
    steps: 3,
    icon: "🎓",
  },
  {
    name: "Re-engagement",
    description: "No opens in 60 days → We miss you → 7 days → Last chance → 7 days → Move to inactive",
    trigger: "inactivity",
    steps: 3,
    icon: "🔄",
  },
  {
    name: "Blog Digest",
    description: "Weekly automatic email with latest blog posts every Monday morning",
    trigger: "schedule",
    steps: 1,
    icon: "📰",
  },
  {
    name: "Event Reminder",
    description: "Event in 7 days → Reminder → 1 day → Final reminder → Event passed → Follow-up",
    trigger: "date_based",
    steps: 4,
    icon: "📅",
  },
];

const triggerColors: Record<string, string> = {
  subscriber_added: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  tag_added: "bg-blue-500/10 text-blue-600 border-blue-200",
  email_opened: "bg-purple-500/10 text-purple-600 border-purple-200",
  link_clicked: "bg-amber-500/10 text-amber-600 border-amber-200",
  date_based: "bg-orange-500/10 text-orange-600 border-orange-200",
  inactivity: "bg-red-500/10 text-red-600 border-red-200",
  schedule: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  custom: "bg-slate-500/10 text-slate-600 border-slate-200",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  paused: "bg-amber-500/10 text-amber-600 border-amber-200",
  draft: "bg-slate-500/10 text-slate-600 border-slate-200",
};

export default function Automations({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showPreBuilt, setShowPreBuilt] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState("subscriber_added");
  const [creating, setCreating] = useState(false);

  const { data: automations, isLoading } = trpc.emailCampaign.automations.list.useQuery();
  const createAutomation = trpc.emailCampaign.automations.create.useMutation();
  const updateAutomation = trpc.emailCampaign.automations.update.useMutation();
  const deleteAutomation = trpc.emailCampaign.automations.delete.useMutation();
  const utils = trpc.useUtils();

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error("Automation name is required"); return; }
    setCreating(true);
    try {
      await createAutomation.mutateAsync({
        name: newName,
        trigger: newTrigger as any,
        status: "draft",
      });
      utils.emailCampaign.automations.list.invalidate();
      setShowCreate(false);
      setNewName("");
      toast.success("Automation created");
    } catch {
      toast.error("Failed to create automation");
    } finally {
      setCreating(false);
    }
  };

  const handleCreatePreBuilt = async (preset: typeof PRE_BUILT_AUTOMATIONS[0]) => {
    try {
      await createAutomation.mutateAsync({
        name: preset.name,
        description: preset.description,
        trigger: preset.trigger as any,
        status: "draft",
      });
      utils.emailCampaign.automations.list.invalidate();
      setShowPreBuilt(false);
      toast.success(`"${preset.name}" automation created`);
    } catch {
      toast.error("Failed to create automation");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      await updateAutomation.mutateAsync({ id, status: newStatus as any });
      utils.emailCampaign.automations.list.invalidate();
      toast.success(`Automation ${newStatus}`);
    } catch {
      toast.error("Failed to update automation");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this automation?")) return;
    try {
      await deleteAutomation.mutateAsync({ id });
      utils.emailCampaign.automations.list.invalidate();
      toast.success("Automation deleted");
    } catch {
      toast.error("Failed to delete automation");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Automations
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Set up automated email workflows triggered by subscriber actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreBuilt(true)} className="gap-2 border-[#0d9488]/30 text-[#0d9488] hover:bg-[#0d9488]/5">
            <Zap className="w-4 h-4" /> Pre-built Flows
          </Button>
          <Button onClick={() => setShowCreate(true)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
            <Plus className="w-4 h-4" /> New Automation
          </Button>
        </div>
      </div>

      {/* Pre-built Automations Modal */}
      {showPreBuilt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-[#1F2937] text-lg">Pre-built Automation Flows</h2>
                <p className="text-[#6B7280] text-sm mt-1">Start with a proven workflow and customise it</p>
              </div>
              <button onClick={() => setShowPreBuilt(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {PRE_BUILT_AUTOMATIONS.map((preset, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-5 hover:border-[#0d9488]/30 hover:bg-[#0d9488]/5 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{preset.icon}</span>
                      <div>
                        <h3 className="font-medium text-[#1F2937]">{preset.name}</h3>
                        <p className="text-[#6B7280] text-sm mt-1">{preset.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className={`text-[10px] ${triggerColors[preset.trigger]}`}>
                            {preset.trigger.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-[10px] text-[#9CA3AF]">{preset.steps} steps</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleCreatePreBuilt(preset)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white text-xs shrink-0">
                      Use This
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1F2937]">New Automation</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Automation Name *</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Welcome Series" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Trigger</label>
                <select
                  value={newTrigger}
                  onChange={e => setNewTrigger(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
                >
                  <option value="subscriber_added">Subscriber Added</option>
                  <option value="tag_added">Tag Added</option>
                  <option value="email_opened">Email Opened</option>
                  <option value="link_clicked">Link Clicked</option>
                  <option value="date_based">Date Based</option>
                  <option value="inactivity">Inactivity</option>
                  <option value="custom">Custom Event</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={creating} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#0d9488]" />
        </div>
      ) : !automations?.length ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Zap className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-[#6B7280] font-medium mb-2">No automations yet</h3>
          <p className="text-[#9CA3AF] text-sm mb-4">Create your first automation or start with a pre-built flow.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setShowPreBuilt(true)} className="gap-2">
              <Zap className="w-4 h-4" /> Pre-built Flows
            </Button>
            <Button onClick={() => setShowCreate(true)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
              <Plus className="w-4 h-4" /> Create Automation
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {automations.map((auto: any) => (
            <div key={auto.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d9488]/20 to-[#14b8a6]/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#0d9488]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1F2937]">{auto.name}</h3>
                    {auto.description && <p className="text-[#9CA3AF] text-xs mt-0.5 max-w-md line-clamp-1">{auto.description}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className={`text-[10px] ${triggerColors[auto.triggerType] || triggerColors.custom}`}>
                        {auto.triggerType?.replace(/_/g, " ") || "custom"}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] ${statusColors[auto.status] || statusColors.draft}`}>
                        {auto.status}
                      </Badge>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {auto.enrolledCount ?? 0} enrolled
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(auto.id, auto.status)}
                    className={`p-2 rounded-lg transition-colors ${
                      auto.status === "active"
                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                    title={auto.status === "active" ? "Pause" : "Activate"}
                  >
                    {auto.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => toast.info("Automation editor coming soon")} className="p-2 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#0d9488] transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(auto.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#6B7280] hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Simple Flow Visualization */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0d9488]/10 text-[#0d9488] text-xs font-medium shrink-0">
                    <Bell className="w-3 h-3" /> Trigger
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D1D5DB] shrink-0" />
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium shrink-0">
                    <Mail className="w-3 h-3" /> Send Email
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D1D5DB] shrink-0" />
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-medium shrink-0">
                    <Clock className="w-3 h-3" /> Wait
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D1D5DB] shrink-0" />
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-xs font-medium shrink-0">
                    <GitBranch className="w-3 h-3" /> Condition
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] shrink-0 ml-2">+ more steps</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
