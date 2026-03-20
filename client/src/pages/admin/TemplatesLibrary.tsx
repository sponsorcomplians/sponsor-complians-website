import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus, FileText, Copy, Trash2, Edit, Loader2, Search,
  LayoutGrid, List, Calendar, X,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "newsletter", label: "Newsletter" },
  { value: "announcement", label: "Announcement" },
  { value: "event", label: "Event" },
  { value: "alert", label: "Alert" },
  { value: "welcome", label: "Welcome" },
  { value: "reengagement", label: "Re-engagement" },
  { value: "plain", label: "Plain Text" },
];

const categoryColors: Record<string, string> = {
  newsletter: "bg-blue-500/10 text-blue-600 border-blue-200",
  announcement: "bg-purple-500/10 text-purple-600 border-purple-200",
  event: "bg-amber-500/10 text-amber-600 border-amber-200",
  alert: "bg-red-500/10 text-red-600 border-red-200",
  welcome: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  reengagement: "bg-orange-500/10 text-orange-600 border-orange-200",
  plain: "bg-slate-500/10 text-slate-600 border-slate-200",
};

export default function TemplatesLibrary({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"newsletter" | "promotional" | "transactional" | "compliance" | "onboarding" | "custom">("newsletter");
  const [creating, setCreating] = useState(false);

  const { data: templates, isLoading } = trpc.emailCampaign.templates.list.useQuery({
    category: category === "all" ? undefined : category,
    search: search || undefined,
  });
  const createTemplate = trpc.emailCampaign.templates.create.useMutation();
  const deleteTemplate = trpc.emailCampaign.templates.delete.useMutation();
  const duplicateTemplate = trpc.emailCampaign.templates.duplicate.useMutation();
  const utils = trpc.useUtils();

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error("Template name is required"); return; }
    setCreating(true);
    try {
      await createTemplate.mutateAsync({
        name: newName,
        category: newCategory,
        contentJson: [
          { id: "h1", type: "header", content: { logoUrl: "", title: "Sponsor ComplIANS" } },
          { id: "t1", type: "text", content: { html: "<p>Enter your content here...</p>" } },
          { id: "f1", type: "footer", content: { companyName: "Sponsor ComplIANS", address: "915 High Road, North Finchley, London N12 8QJ", phone: "020 3618 6968", email: "info@sponsorcomplians.com" } },
        ],
      });
      utils.emailCampaign.templates.list.invalidate();
      setShowCreate(false);
      setNewName("");
      toast.success("Template created");
    } catch {
      toast.error("Failed to create template");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this template?")) return;
    try {
      await deleteTemplate.mutateAsync({ id });
      utils.emailCampaign.templates.list.invalidate();
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateTemplate.mutateAsync({ id });
      utils.emailCampaign.templates.list.invalidate();
      toast.success("Template duplicated");
    } catch {
      toast.error("Failed to duplicate template");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Email Templates
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Pre-built branded templates for your campaigns</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat.value
                  ? "bg-[#0d9488] text-white"
                  : "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-200 text-[#1F2937]" : "text-[#9CA3AF] hover:bg-gray-100"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-200 text-[#1F2937]" : "text-[#9CA3AF] hover:bg-gray-100"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1F2937]">New Template</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Template Name</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Monthly Newsletter" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
                >
                  {CATEGORIES.filter(c => c.value !== "all").map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
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

      {/* Templates Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#0d9488]" />
        </div>
      ) : !templates?.length ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <FileText className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-[#6B7280] font-medium mb-2">No templates yet</h3>
          <p className="text-[#9CA3AF] text-sm mb-4">Create your first email template to get started.</p>
          <Button onClick={() => setShowCreate(true)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
            <Plus className="w-4 h-4" /> Create Template
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((tpl: any) => (
            <div key={tpl.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Template Preview */}
              <div className="h-40 bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center relative">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-[#0d9488]/50 mx-auto mb-2" />
                  <span className="text-white/60 text-xs">{tpl.name}</span>
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <button onClick={() => onNavigate(`template-edit-${tpl.id}`)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDuplicate(tpl.id)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(tpl.id)} className="p-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-[#1F2937] text-sm truncate">{tpl.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className={`text-[10px] ${categoryColors[tpl.category] || categoryColors.plain}`}>
                    {tpl.category}
                  </Badge>
                  <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(tpl.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[#6B7280]">
                <th className="text-left px-6 py-3 font-medium">Template</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Updated</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl: any) => (
                <tr key={tpl.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-medium text-[#1F2937]">{tpl.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${categoryColors[tpl.category] || categoryColors.plain}`}>
                      {tpl.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs">
                    {new Date(tpl.updatedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onNavigate(`template-edit-${tpl.id}`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#0d9488]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDuplicate(tpl.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#3b82f6]">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(tpl.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
