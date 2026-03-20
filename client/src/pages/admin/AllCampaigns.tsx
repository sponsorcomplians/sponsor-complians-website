import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Search, Send, Clock, FileText, MoreHorizontal,
  Eye, Copy, Trash2, Pencil, Mail, BarChart3,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  scheduled: { label: "Scheduled", color: "text-blue-600", bg: "bg-blue-50" },
  sending: { label: "Sending", color: "text-amber-600", bg: "bg-amber-50" },
  sent: { label: "Sent", color: "text-emerald-600", bg: "bg-emerald-50" },
  paused: { label: "Paused", color: "text-orange-600", bg: "bg-orange-50" },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50" },
};

function formatDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatDateTime(d: string | Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AllCampaigns({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const { data, isLoading, refetch } = trpc.emailCampaign.campaigns.list.useQuery({
    limit: 50,
    status: statusFilter,
    search: search || undefined,
  });

  const deleteCampaign = trpc.emailCampaign.campaigns.delete.useMutation({
    onSuccess: () => { toast.success("Campaign deleted"); refetch(); },
    onError: () => toast.error("Failed to delete campaign"),
  });

  const duplicateCampaign = trpc.emailCampaign.campaigns.duplicate.useMutation({
    onSuccess: () => { toast.success("Campaign duplicated"); refetch(); },
    onError: () => toast.error("Failed to duplicate campaign"),
  });

  const campaigns = data?.items ?? [];
  const total = data?.total ?? 0;

  const statusTabs = [
    { key: undefined, label: "All" },
    { key: "draft", label: "Drafts" },
    { key: "scheduled", label: "Scheduled" },
    { key: "sent", label: "Sent" },
    { key: "sending", label: "Sending" },
  ];

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete campaign "${name}"? This cannot be undone.`)) {
      deleteCampaign.mutate({ id });
    }
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            All Campaigns
          </h1>
          <p className="text-[#6B7280] text-sm mt-0.5">
            {total} campaign{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          onClick={() => onNavigate("campaign-new")}
          className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-100 p-1 shadow-sm w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab.key ?? "all"}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? "bg-[#0d9488] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search campaigns..."
          className="pl-9"
        />
      </div>

      {/* Campaign List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-[#0d9488] border-t-transparent rounded-full" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Mail className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1F2937] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {search || statusFilter ? "No campaigns found" : "No campaigns yet"}
          </h3>
          <p className="text-[#6B7280] text-sm mb-6">
            {search || statusFilter
              ? "Try adjusting your search or filter."
              : "Create your first email campaign to start engaging your audience."}
          </p>
          {!search && !statusFilter && (
            <Button
              onClick={() => onNavigate("campaign-new")}
              className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
            >
              <Plus className="w-4 h-4" /> Create Campaign
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Campaign</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Sent</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Opens</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Clicks</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c: any) => {
                const status = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.draft;
                const openRate = c.totalSent > 0 ? ((c.totalOpened / c.totalSent) * 100).toFixed(1) : "—";
                const clickRate = c.totalSent > 0 ? ((c.totalClicked / c.totalSent) * 100).toFixed(1) : "—";

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => onNavigate(`campaign-edit:${c.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1F2937] text-sm">{c.name}</div>
                      {c.subject && (
                        <div className="text-xs text-[#9CA3AF] mt-0.5 truncate max-w-[280px]">{c.subject}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`${status.bg} ${status.color} border-0 text-xs font-medium`}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-[#374151]">{c.totalSent ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-sm text-[#374151]">{c.totalOpened ?? 0}</div>
                      {c.totalSent > 0 && (
                        <div className="text-xs text-[#9CA3AF]">{openRate}%</div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-sm text-[#374151]">{c.totalClicked ?? 0}</div>
                      {c.totalSent > 0 && (
                        <div className="text-xs text-[#9CA3AF]">{clickRate}%</div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-[#6B7280]">
                        {c.sentAt ? formatDateTime(c.sentAt) : formatDate(c.createdAt)}
                      </div>
                      {c.scheduledAt && c.status === "scheduled" && (
                        <div className="text-xs text-blue-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {formatDateTime(c.scheduledAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === c.id ? null : c.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenuId === c.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-8 z-50 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[160px]">
                              <button
                                onClick={(e) => { e.stopPropagation(); onNavigate(`campaign-edit:${c.id}`); setOpenMenuId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-gray-50"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); duplicateCampaign.mutate({ id: c.id }); setOpenMenuId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#374151] hover:bg-gray-50"
                              >
                                <Copy className="w-3.5 h-3.5" /> Duplicate
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(c.id, c.name); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
