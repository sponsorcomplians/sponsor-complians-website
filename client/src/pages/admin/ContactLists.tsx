import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Users, Trash2, Edit, Loader2, Search, LayoutList, X,
  UserPlus, UserMinus, ArrowLeft, LayoutGrid, List, Mail,
  Phone, Building2, Eye,
} from "lucide-react";
import { toast } from "sonner";

/* ─── List Detail View (shows members of a single list) ─── */
function ListDetail({ listId, onBack, onNavigate }: {
  listId: number;
  onBack: () => void;
  onNavigate: (page: string) => void;
}) {
  const [memberView, setMemberView] = useState<"table" | "grid">("table");
  const { data: listInfo, isLoading: listLoading } = trpc.emailCampaign.lists.getById.useQuery({ id: listId });
  const { data: members, isLoading: membersLoading } = trpc.emailCampaign.lists.members.useQuery({ listId });
  const removeMember = trpc.emailCampaign.lists.removeMember.useMutation();
  const utils = trpc.useUtils();

  const handleRemoveMember = async (contactId: number) => {
    if (!confirm("Remove this contact from the list?")) return;
    try {
      await removeMember.mutateAsync({ listId, contactId });
      utils.emailCampaign.lists.members.invalidate({ listId });
      utils.emailCampaign.lists.list.invalidate();
      toast.success("Contact removed from list");
    } catch {
      toast.error("Failed to remove contact");
    }
  };

  if (listLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  const list = listInfo as any;
  const memberList = (members || []) as any[];

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0d9488] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Lists
      </button>

      {/* List Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {list?.name || "List"}
              </h1>
              {list?.description && <p className="text-sm text-[#6B7280] mt-0.5">{list.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`text-xs ${list?.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
              {list?.isActive ? "Active" : "Inactive"}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1F2937]">{memberList.length}</div>
              <div className="text-[10px] text-[#9CA3AF]">members</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setMemberView("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${memberView === "table" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}
          >
            <List className="w-3.5 h-3.5" /> Table
          </button>
          <button
            onClick={() => setMemberView("grid")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${memberView === "grid" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Grid
          </button>
        </div>
      </div>

      {/* Members */}
      {memberList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Users className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-[#6B7280] font-medium mb-2">No members in this list</h3>
          <p className="text-[#9CA3AF] text-sm">Add contacts to this list from the Contacts page</p>
        </div>
      ) : memberView === "table" ? (
        /* Table View */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Company</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member: any) => {
                  const c = member.contact || member;
                  return (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onNavigate(`contact:${c.id}`)}
                          className="flex items-center gap-2 hover:text-[#0d9488] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(c.firstName?.[0] || "?").toUpperCase()}
                          </div>
                          <span className="font-medium text-[#1F2937]">{c.firstName} {c.lastName}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{c.email}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{c.phone || "—"}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{c.company || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px]">{c.status || "new"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onNavigate(`contact:${c.id}`)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF] hover:text-[#0d9488] transition-colors"
                            title="View Contact"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(c.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors"
                            title="Remove from List"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberList.map((member: any) => {
            const c = member.contact || member;
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => onNavigate(`contact:${c.id}`)}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {(c.firstName?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-[#1F2937] text-sm">{c.firstName} {c.lastName}</div>
                      <div className="text-[10px] text-[#9CA3AF]">{c.email}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRemoveMember(c.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors"
                    title="Remove from List"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-xs text-[#6B7280]">
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-[#9CA3AF]" /> {c.phone}
                    </div>
                  )}
                  {c.company && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-[#9CA3AF]" /> {c.company}
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">{c.status || "new"}</Badge>
                  <Button variant="ghost" size="sm" className="text-[10px] h-7 gap-1 text-[#0d9488]" onClick={() => onNavigate(`contact:${c.id}`)}>
                    <Eye className="w-3 h-3" /> View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Contact Lists Page ─── */
export default function ContactLists({ onNavigate, initialListId }: {
  onNavigate: (page: string) => void;
  initialListId?: number;
}) {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(initialListId ?? null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: lists, isLoading } = trpc.emailCampaign.lists.list.useQuery({ search: search || undefined });
  const createList = trpc.emailCampaign.lists.create.useMutation();
  const deleteList = trpc.emailCampaign.lists.delete.useMutation();
  const utils = trpc.useUtils();

  // Update selectedListId when initialListId changes
  useEffect(() => {
    if (initialListId) setSelectedListId(initialListId);
  }, [initialListId]);

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error("List name is required"); return; }
    setCreating(true);
    try {
      await createList.mutateAsync({ name: newName, description: newDescription || undefined });
      utils.emailCampaign.lists.list.invalidate();
      utils.emailCampaign.lists.listForSelect.invalidate();
      setShowCreate(false);
      setNewName("");
      setNewDescription("");
      toast.success("List created");
    } catch {
      toast.error("Failed to create list");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this list? Contacts will not be deleted.")) return;
    try {
      await deleteList.mutateAsync({ id });
      utils.emailCampaign.lists.list.invalidate();
      utils.emailCampaign.lists.listForSelect.invalidate();
      toast.success("List deleted");
    } catch {
      toast.error("Failed to delete list");
    }
  };

  // Show list detail if selected
  if (selectedListId) {
    return (
      <ListDetail
        listId={selectedListId}
        onBack={() => setSelectedListId(null)}
        onNavigate={onNavigate}
      />
    );
  }

  const sortedLists = [...(lists || [])].sort((a: any, b: any) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Contact Lists
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">{sortedLists.length} lists — organise contacts for targeted campaigns</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
          <Plus className="w-4 h-4" /> New List
        </Button>
      </div>

      {/* Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lists..." className="pl-9" />
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${viewMode === "grid" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${viewMode === "table" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}
          >
            <List className="w-3.5 h-3.5" /> Table
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1F2937]">New Contact List</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">List Name *</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Newsletter Subscribers" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Description</label>
                <Input value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Optional description" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={creating} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Create List
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lists */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#0d9488]" />
        </div>
      ) : !sortedLists.length ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <LayoutList className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-[#6B7280] font-medium mb-2">No lists yet</h3>
          <p className="text-[#9CA3AF] text-sm mb-4">Create your first contact list to organise your subscribers.</p>
          <Button onClick={() => setShowCreate(true)} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
            <Plus className="w-4 h-4" /> Create List
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLists.map((list: any) => (
            <div
              key={list.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setSelectedListId(list.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1F2937] text-sm group-hover:text-[#0d9488] transition-colors">{list.name}</h3>
                    {list.description && <p className="text-[#9CA3AF] text-xs mt-0.5 line-clamp-1">{list.description}</p>}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(list.id, e)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#1F2937]">{list.memberCount ?? 0}</div>
                    <div className="text-[10px] text-[#9CA3AF]">Contacts</div>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${list.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                  {list.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">List Name</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Description</th>
                  <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Members</th>
                  <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLists.map((list: any) => (
                  <tr
                    key={list.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedListId(list.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[#22c55e]" />
                        </div>
                        <span className="font-medium text-[#1F2937] hover:text-[#0d9488]">{list.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] max-w-[200px] truncate">{list.description || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-[#1F2937]">{list.memberCount ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${list.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                        {list.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => handleDelete(list.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors"
                        title="Delete List"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
