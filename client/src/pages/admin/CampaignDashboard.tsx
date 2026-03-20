import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail, Send, Eye, MousePointerClick, UserMinus, Plus,
  LayoutList, Users, BarChart3, Clock, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Copy, Trash2, FileText, Zap, Loader2,
} from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  scheduled: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  sending: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  sent: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  paused: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function CampaignDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { data: campaignData, isLoading: campaignsLoading } = trpc.emailCampaign.campaigns.list.useQuery({ limit: 10 });
  const { data: analytics, isLoading: analyticsLoading } = trpc.emailCampaign.campaigns.analytics.useQuery();
  const { data: contactStats } = trpc.contacts.stats.useQuery();
  const deleteCampaign = trpc.emailCampaign.campaigns.delete.useMutation();
  const duplicateCampaign = trpc.emailCampaign.campaigns.duplicate.useMutation();
  const utils = trpc.useUtils();

  const kpis = [
    {
      label: "Total Subscribers",
      value: contactStats?.total ?? 0,
      icon: Users,
      color: "#14b8a6",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Emails Sent",
      value: analytics?.totalSent ?? 0,
      icon: Send,
      color: "#3b82f6",
      trend: "This month",
      trendUp: true,
    },
    {
      label: "Avg Open Rate",
      value: analytics && analytics.totalSent > 0 ? `${((analytics.totalOpened / analytics.totalSent) * 100).toFixed(1)}%` : "0%",
      icon: Eye,
      color: "#22c55e",
      trend: "+2.3%",
      trendUp: true,
    },
    {
      label: "Avg Click Rate",
      value: analytics && analytics.totalSent > 0 ? `${((analytics.totalClicked / analytics.totalSent) * 100).toFixed(1)}%` : "0%",
      icon: MousePointerClick,
      color: "#f59e0b",
      trend: "+0.8%",
      trendUp: true,
    },
    {
      label: "Unsubscribe Rate",
      value: analytics && analytics.totalSent > 0 ? `${((analytics.totalUnsubscribed / analytics.totalSent) * 100).toFixed(2)}%` : "0%",
      icon: UserMinus,
      color: "#ef4444",
      trend: "-0.1%",
      trendUp: false,
    },
  ];

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign.mutateAsync({ id });
      utils.emailCampaign.campaigns.list.invalidate();
      toast.success("Campaign deleted");
    } catch {
      toast.error("Failed to delete campaign");
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      const result = await duplicateCampaign.mutateAsync({ id });
      utils.emailCampaign.campaigns.list.invalidate();
      toast.success("Campaign duplicated");
    } catch {
      toast.error("Failed to duplicate campaign");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Email Campaigns
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Manage your email marketing campaigns</p>
        </div>
        <Button
          onClick={() => onNavigate("campaign-builder")}
          className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="relative overflow-hidden rounded-xl border border-[#1B3A5C]/20 bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 shadow-lg"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}20` }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-xs text-slate-400">{kpi.label}</div>
            <div className={`flex items-center gap-1 mt-2 text-xs ${kpi.trendUp ? "text-emerald-400" : "text-red-400"}`}>
              {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" onClick={() => onNavigate("campaign-builder")} className="gap-2 border-[#1B3A5C]/30 text-[#4B5563] hover:bg-[#0d9488]/10 hover:text-[#0d9488] hover:border-[#0d9488]/30">
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("templates")} className="gap-2 border-[#1B3A5C]/30 text-[#4B5563] hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/30">
          <FileText className="w-4 h-4" /> Templates
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("contact-lists")} className="gap-2 border-[#1B3A5C]/30 text-[#4B5563] hover:bg-[#8b5cf6]/10 hover:text-[#8b5cf6] hover:border-[#8b5cf6]/30">
          <LayoutList className="w-4 h-4" /> Manage Lists
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("analytics")} className="gap-2 border-[#1B3A5C]/30 text-[#4B5563] hover:bg-[#f59e0b]/10 hover:text-[#f59e0b] hover:border-[#f59e0b]/30">
          <BarChart3 className="w-4 h-4" /> Analytics
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("automations")} className="gap-2 border-[#1B3A5C]/30 text-[#4B5563] hover:bg-[#ec4899]/10 hover:text-[#ec4899] hover:border-[#ec4899]/30">
          <Zap className="w-4 h-4" /> Automations
        </Button>
      </div>

      {/* Recent Campaigns Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Recent Campaigns</h2>
          <span className="text-xs text-[#6B7280]">{campaignData?.total ?? 0} total</span>
        </div>

        {campaignsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#0d9488]" />
          </div>
        ) : !campaignData?.items?.length ? (
          <div className="text-center py-16">
            <Mail className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
            <h3 className="text-[#6B7280] font-medium mb-2">No campaigns yet</h3>
            <p className="text-[#9CA3AF] text-sm mb-4">Create your first email campaign to get started.</p>
            <Button onClick={() => onNavigate("campaign-builder")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
              <Plus className="w-4 h-4" /> Create Campaign
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[#6B7280]">
                  <th className="text-left px-6 py-3 font-medium">Campaign</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Recipients</th>
                  <th className="text-right px-4 py-3 font-medium">Open Rate</th>
                  <th className="text-right px-4 py-3 font-medium">Click Rate</th>
                  <th className="text-right px-4 py-3 font-medium">Sent</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.items.map((campaign: any) => {
                  const openRate = campaign.totalSent > 0 ? ((campaign.totalOpened / campaign.totalSent) * 100).toFixed(1) : "—";
                  const clickRate = campaign.totalSent > 0 ? ((campaign.totalClicked / campaign.totalSent) * 100).toFixed(1) : "—";
                  return (
                    <tr key={campaign.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#1F2937]">{campaign.name}</div>
                        {campaign.subject && <div className="text-xs text-[#9CA3AF] mt-0.5 truncate max-w-[250px]">{campaign.subject}</div>}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={`text-xs ${statusColors[campaign.status] || statusColors.draft}`}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right text-[#4B5563]">{campaign.recipientCount ?? 0}</td>
                      <td className="px-4 py-4 text-right text-[#4B5563]">{openRate}%</td>
                      <td className="px-4 py-4 text-right text-[#4B5563]">{clickRate}%</td>
                      <td className="px-4 py-4 text-right text-[#9CA3AF] text-xs">
                        {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {campaign.status === "sent" && (
                            <button onClick={() => onNavigate(`campaign-report-${campaign.id}`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#0d9488] transition-colors" title="View Report">
                              <BarChart3 className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDuplicate(campaign.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#3b82f6] transition-colors" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(campaign.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Scheduled Campaigns */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-[#1F2937] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Clock className="w-4 h-4 inline-block mr-2 text-[#f59e0b]" />
          Upcoming Scheduled
        </h2>
        {campaignData?.items?.filter((c: any) => c.status === "scheduled").length ? (
          <div className="space-y-3">
            {campaignData.items.filter((c: any) => c.status === "scheduled").map((campaign: any) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div>
                  <div className="font-medium text-[#1F2937] text-sm">{campaign.name}</div>
                  <div className="text-xs text-[#9CA3AF]">
                    {campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleString("en-GB") : "Not scheduled"}
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">
                  Scheduled
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#9CA3AF] text-sm">No scheduled campaigns</p>
        )}
      </div>
    </div>
  );
}
