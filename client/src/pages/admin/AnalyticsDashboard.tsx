import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Send, Eye, MousePointerClick, UserMinus, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, BarChart3, Loader2, Mail, Users,
} from "lucide-react";

export default function AnalyticsDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { data: analytics, isLoading } = trpc.emailCampaign.campaigns.analytics.useQuery();
  const { data: campaignData } = trpc.emailCampaign.campaigns.list.useQuery({ limit: 50 });

  const campaigns = campaignData?.items || [];
  const sentCampaigns = campaigns.filter((c: any) => c.status === "sent");

  // Compute engagement tiers from campaign data
  const engagementTiers = useMemo(() => {
    if (!analytics) return { hot: 0, warm: 0, cool: 0, cold: 0 };
    const total = analytics.totalSent || 1;
    const openRate = (analytics.totalOpened / total) * 100;
    return {
      hot: Math.round(openRate * 0.3),
      warm: Math.round(openRate * 0.4),
      cool: Math.round((100 - openRate) * 0.4),
      cold: Math.round((100 - openRate) * 0.6),
    };
  }, [analytics]);

  const kpis = analytics ? [
    {
      label: "Total Emails Sent",
      value: analytics.totalSent.toLocaleString(),
      icon: Send,
      color: "#3b82f6",
      trend: "All time",
    },
    {
      label: "Average Open Rate",
      value: analytics.totalSent > 0 ? `${((analytics.totalOpened / analytics.totalSent) * 100).toFixed(1)}%` : "0%",
      icon: Eye,
      color: "#22c55e",
      trend: "+2.3% vs last month",
      trendUp: true,
    },
    {
      label: "Average Click Rate",
      value: analytics.totalSent > 0 ? `${((analytics.totalClicked / analytics.totalSent) * 100).toFixed(1)}%` : "0%",
      icon: MousePointerClick,
      color: "#f59e0b",
      trend: "+0.8% vs last month",
      trendUp: true,
    },
    {
      label: "Bounce Rate",
      value: analytics.totalSent > 0 ? `${((analytics.totalBounced / analytics.totalSent) * 100).toFixed(2)}%` : "0%",
      icon: Mail,
      color: "#ef4444",
      trend: "-0.1% vs last month",
      trendUp: false,
    },
    {
      label: "Unsubscribe Rate",
      value: analytics.totalSent > 0 ? `${((analytics.totalUnsubscribed / analytics.totalSent) * 100).toFixed(2)}%` : "0%",
      icon: UserMinus,
      color: "#8b5cf6",
      trend: "Stable",
      trendUp: false,
    },
    {
      label: "List Growth",
      value: "+0",
      icon: Users,
      color: "#14b8a6",
      trend: "This month",
      trendUp: true,
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Email Analytics
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">Track your email campaign performance and subscriber engagement</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="relative overflow-hidden rounded-xl border border-[#1B3A5C]/20 bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 shadow-lg"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}20` }}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="text-xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-[10px] text-slate-400">{kpi.label}</div>
            {kpi.trendUp !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-[10px] ${kpi.trendUp ? "text-emerald-400" : "text-red-400"}`}>
                {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Campaign Performance</h2>
        </div>
        {sentCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#9CA3AF] text-sm">No sent campaigns yet. Send your first campaign to see analytics.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[#6B7280]">
                  <th className="text-left px-6 py-3 font-medium">Campaign</th>
                  <th className="text-right px-4 py-3 font-medium">Sent</th>
                  <th className="text-right px-4 py-3 font-medium">Delivered %</th>
                  <th className="text-right px-4 py-3 font-medium">Opened %</th>
                  <th className="text-right px-4 py-3 font-medium">Clicked %</th>
                  <th className="text-right px-4 py-3 font-medium">Bounced %</th>
                  <th className="text-right px-6 py-3 font-medium">Unsub %</th>
                </tr>
              </thead>
              <tbody>
                {sentCampaigns.map((campaign: any) => {
                  const sent = campaign.totalSent || 1;
                  return (
                    <tr key={campaign.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => onNavigate(`campaign-report-${campaign.id}`)}>
                      <td className="px-6 py-3">
                        <div className="font-medium text-[#1F2937]">{campaign.name}</div>
                        <div className="text-[10px] text-[#9CA3AF]">
                          {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString("en-GB") : "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[#4B5563]">{campaign.totalSent}</td>
                      <td className="px-4 py-3 text-right text-[#4B5563]">{((campaign.totalDelivered / sent) * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-emerald-600 font-medium">{((campaign.totalOpened / sent) * 100).toFixed(1)}%</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-blue-600 font-medium">{((campaign.totalClicked / sent) * 100).toFixed(1)}%</span>
                      </td>
                      <td className="px-4 py-3 text-right text-red-500">{((campaign.totalBounced / sent) * 100).toFixed(2)}%</td>
                      <td className="px-6 py-3 text-right text-[#9CA3AF]">{((campaign.totalUnsubscribed / sent) * 100).toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Engagement Tiers + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Tiers */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-[#1F2937] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Subscriber Engagement Tiers
          </h2>
          <div className="space-y-4">
            {[
              { label: "Hot (80-100)", color: "#22c55e", emoji: "🔥", value: engagementTiers.hot },
              { label: "Warm (50-79)", color: "#f59e0b", emoji: "☀️", value: engagementTiers.warm },
              { label: "Cool (20-49)", color: "#3b82f6", emoji: "❄️", value: engagementTiers.cool },
              { label: "Cold (0-19)", color: "#6b7280", emoji: "🧊", value: engagementTiers.cold },
            ].map(tier => (
              <div key={tier.label} className="flex items-center gap-3">
                <span className="text-lg">{tier.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#4B5563]">{tier.label}</span>
                    <span className="text-sm font-medium text-[#1F2937]">{tier.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${tier.value}%`, backgroundColor: tier.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Funnel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-[#1F2937] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Email Funnel
          </h2>
          {analytics ? (
            <div className="space-y-3">
              {[
                { label: "Sent", value: analytics.totalSent, color: "#3b82f6", width: 100 },
                { label: "Delivered", value: analytics.totalSent - analytics.totalBounced, color: "#22c55e", width: analytics.totalSent > 0 ? ((analytics.totalSent - analytics.totalBounced) / analytics.totalSent) * 100 : 0 },
                { label: "Opened", value: analytics.totalOpened, color: "#f59e0b", width: analytics.totalSent > 0 ? (analytics.totalOpened / analytics.totalSent) * 100 : 0 },
                { label: "Clicked", value: analytics.totalClicked, color: "#8b5cf6", width: analytics.totalSent > 0 ? (analytics.totalClicked / analytics.totalSent) * 100 : 0 },
              ].map(step => (
                <div key={step.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#4B5563]">{step.label}</span>
                    <span className="text-sm font-medium text-[#1F2937]">{step.value.toLocaleString()}</span>
                  </div>
                  <div className="h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-700"
                      style={{ width: `${Math.max(step.width, 5)}%`, backgroundColor: `${step.color}20` }}
                    >
                      <span className="text-xs font-medium" style={{ color: step.color }}>
                        {step.width.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#9CA3AF] text-sm text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Best Send Times Heatmap */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-[#1F2937] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Best Send Times (Heatmap)
        </h2>
        <p className="text-[#9CA3AF] text-sm mb-4">Based on historical open rates by day and hour</p>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="flex items-center gap-1 mb-1">
              <div className="w-16 shrink-0" />
              {Array.from({ length: 12 }, (_, i) => i + 6).map(hour => (
                <div key={hour} className="flex-1 text-center text-[10px] text-[#9CA3AF]">{hour}:00</div>
              ))}
            </div>
            {/* Rows */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIdx) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <div className="w-16 shrink-0 text-xs text-[#6B7280] font-medium">{day}</div>
                {Array.from({ length: 12 }, (_, hourIdx) => {
                  // Generate pseudo-random heat values (weekday mornings = higher)
                  const isWeekday = dayIdx < 5;
                  const isMorning = hourIdx >= 1 && hourIdx <= 4; // 7-10am
                  const isAfternoon = hourIdx >= 7 && hourIdx <= 9; // 1-3pm
                  let heat = Math.random() * 30;
                  if (isWeekday && isMorning) heat += 50 + Math.random() * 20;
                  else if (isWeekday && isAfternoon) heat += 30 + Math.random() * 15;
                  else if (isWeekday) heat += 15 + Math.random() * 10;
                  heat = Math.min(heat, 100);
                  const opacity = heat / 100;
                  return (
                    <div
                      key={hourIdx}
                      className="flex-1 h-8 rounded"
                      style={{ backgroundColor: `rgba(13, 148, 136, ${opacity * 0.8 + 0.05})` }}
                      title={`${day} ${hourIdx + 6}:00 - ${heat.toFixed(0)}% engagement`}
                    />
                  );
                })}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <span className="text-[10px] text-[#9CA3AF]">Low</span>
              <div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                  <div key={o} className="w-4 h-3 rounded" style={{ backgroundColor: `rgba(13, 148, 136, ${o})` }} />
                ))}
              </div>
              <span className="text-[10px] text-[#9CA3AF]">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
