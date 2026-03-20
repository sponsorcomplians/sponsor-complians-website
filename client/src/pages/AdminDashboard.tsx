import { useAuth } from "@/_core/hooks/useAuth";
import { SignInButton } from "@clerk/react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users, Mail, MessageSquare, Download, Eye, Bell,
  UserPlus, Search, ArrowLeft, ChevronRight, Check,
  Trash2, ExternalLink, RefreshCw, BarChart3, Briefcase,
  FileText, X, ChevronDown, ChevronUp, GraduationCap,
  Upload, Pencil, ToggleLeft, ToggleRight, FileSpreadsheet, FileImage, File,
  Building2, Bot, UserCog, MapPin, Clock, Send, AlertCircle, Shield, ShieldCheck, Video,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

type Tab = "overview" | "contacts" | "companies" | "subscribers" | "submissions" | "signups" | "downloads" | "visitors" | "notifications" | "applications" | "webinars" | "jobs" | "chatbot" | "team" | "leads" | "bookings";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#00C3FF] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Admin Access Required</h1>
          <p className="text-[#6B7280] mb-6">Sign in with your admin account to access the dashboard.</p>
          <SignInButton mode="modal">
            <Button className="bg-[#00C3FF] hover:bg-[#00B0E6] text-white font-medium">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Access Denied</h1>
          <p className="text-[#6B7280] mb-6">You do not have admin permissions.</p>
          <Link href="/" className="text-[#00C3FF] hover:underline font-medium">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" />, color: "#00C3FF" },
    { id: "contacts", label: "Contacts", icon: <Users className="w-4 h-4" />, color: "#3B82F6" },
    { id: "companies", label: "Companies", icon: <ExternalLink className="w-4 h-4" />, color: "#8B5CF6" },
    { id: "subscribers", label: "Subscribers", icon: <Mail className="w-4 h-4" />, color: "#10B981" },
    { id: "submissions", label: "Messages", icon: <MessageSquare className="w-4 h-4" />, color: "#F59E0B" },
    { id: "signups", label: "Signups", icon: <UserPlus className="w-4 h-4" />, color: "#EC4899" },
    { id: "downloads", label: "Downloads", icon: <Download className="w-4 h-4" />, color: "#6366F1" },
    { id: "visitors", label: "Visitors", icon: <Eye className="w-4 h-4" />, color: "#14B8A6" },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" />, color: "#EF4444" },
    { id: "applications", label: "Applications", icon: <Briefcase className="w-4 h-4" />, color: "#F97316" },
    { id: "webinars", label: "Webinar Regs", icon: <GraduationCap className="w-4 h-4" />, color: "#A855F7" },
    { id: "jobs", label: "Jobs", icon: <Building2 className="w-4 h-4" />, color: "#0EA5E9" },
    { id: "chatbot", label: "Chatbot", icon: <Bot className="w-4 h-4" />, color: "#F472B6" },
    { id: "team", label: "Team", icon: <Shield className="w-4 h-4" />, color: "#22D3EE" },
    { id: "bookings", label: "Bookings", icon: <Clock className="w-4 h-4" />, color: "#10B981" },
    { id: "leads", label: "Lead Scoring", icon: <ShieldCheck className="w-4 h-4" />, color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="flex">
        {/* Sidebar — keep dark navy */}
        <aside className="w-64 min-h-screen bg-[#0B1929] border-r border-[#1B3A5C]/30 pt-6 sticky top-0 h-screen overflow-y-auto shrink-0">
          <div className="px-4 mb-8">
            <Link href="/" className="flex items-center gap-2 text-[#8B9EB7] hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Site
            </Link>
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>Admin Dashboard</h2>
            <p className="text-[#8B9EB7] text-xs mt-1">Sponsor ComplIANS CRM</p>
          </div>
          <nav className="px-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white font-medium"
                    : "text-[#8B9EB7] hover:text-white hover:bg-white/5"
                }`}
              >
                <span style={{ color: activeTab === tab.id ? tab.color : undefined }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          {/* Email Campaigns Module */}
          <div className="px-2 mt-4 pt-4 border-t border-[#1B3A5C]/40">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-semibold text-[#4B6584] uppercase tracking-wider">Marketing</span>
            </div>
            <Link href="/admin/email-campaigns" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-[#8B9EB7] hover:text-white hover:bg-white/5">
              <Send className="w-4 h-4" style={{ color: "#0d9488" }} />
              <span>Email Campaigns</span>
              <span className="ml-auto text-[10px] bg-[#0d9488]/20 text-[#0d9488] px-1.5 py-0.5 rounded font-medium">NEW</span>
            </Link>
          </div>
          <div className="px-4 mt-8 pt-4 border-t border-[#1B3A5C]/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00C3FF]/20 flex items-center justify-center text-[#00C3FF] text-xs font-bold">
                {user.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{user.name || "Admin"}</div>
                <div className="text-[#8B9EB7] text-xs">{user.email}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content — light theme */}
        <main className="flex-1 p-8 pt-6 min-w-0">
          {activeTab === "overview" && <OverviewPanel />}
          {activeTab === "contacts" && <ContactsPanel />}
          {activeTab === "companies" && <CompaniesPanel />}
          {activeTab === "subscribers" && <SubscribersPanel />}
          {activeTab === "submissions" && <SubmissionsPanel />}
          {activeTab === "signups" && <SignupsPanel />}
          {activeTab === "downloads" && <DownloadsPanel />}
          {activeTab === "visitors" && <VisitorsPanel />}
          {activeTab === "notifications" && <NotificationsPanel />}
          {activeTab === "applications" && <ApplicationsPanel />}
          {activeTab === "webinars" && <WebinarRegistrationsPanel />}
          {activeTab === "jobs" && <JobsManagementPanel />}
          {activeTab === "chatbot" && <ChatbotConversationsPanel />}
          {activeTab === "team" && <TeamManagementPanel />}
          {activeTab === "leads" && <LeadScoringPanel />}
          {activeTab === "bookings" && <BookingsPanel />}
        </main>
      </div>
    </div>
  );
}

// ─── Video Early Access Breakdown ───
function VideoEarlyAccessBreakdown() {
  const { data } = trpc.videoRelease.subscriberCount.useQuery();
  if (!data || data.subscribers.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-white/50 text-sm text-center">No subscribers yet. Signups will appear here with their subscription dates.</p>
      </div>
    );
  }

  // Group subscribers by date
  const grouped: Record<string, number> = {};
  data.subscribers.forEach((s: { email: string; subscribedAt: string | Date }) => {
    const date = new Date(s.subscribedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    grouped[date] = (grouped[date] || 0) + 1;
  });
  const dateEntries = Object.entries(grouped);

  return (
    <div className="mt-4 pt-4 border-t border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90">Subscriber Breakdown by Date</h3>
        <span className="text-xs text-white/50">{dateEntries.length} day{dateEntries.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {dateEntries.map(([date, count]) => (
          <div key={date} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#A78BFA]" />
              <span className="text-sm text-white/80">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{count}</span>
              <span className="text-xs text-white/50">signup{count !== 1 ? "s" : ""}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Subscriber email list */}
      <div className="mt-3 pt-3 border-t border-white/15">
        <h4 className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Recent Subscribers</h4>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {data.subscribers.slice(0, 10).map((s: { email: string; subscribedAt: string | Date }, i: number) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-white/70 truncate max-w-[200px]">{s.email}</span>
              <span className="text-white/40 shrink-0 ml-2">{new Date(s.subscribedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
            </div>
          ))}
          {data.subscribers.length > 10 && (
            <p className="text-white/40 text-xs text-center pt-1">+ {data.subscribers.length - 10} more</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Overview Panel ───
function OverviewPanel() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: recentContacts } = trpc.contacts.list.useQuery({ limit: 5 });
  const { data: recentSubs } = trpc.submissions.list.useQuery({ limit: 5 });
  const { data: webinarData } = trpc.webinar.list.useQuery();

  const statCards = [
    { label: "Total Contacts", value: stats?.contacts ?? 0, icon: <Users className="w-5 h-5" />, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Active Subscribers", value: stats?.subscribers ?? 0, icon: <Mail className="w-5 h-5" />, color: "#10B981", bg: "#ECFDF5" },
    { label: "Form Submissions", value: stats?.submissions ?? 0, icon: <MessageSquare className="w-5 h-5" />, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Signups", value: stats?.signups ?? 0, icon: <UserPlus className="w-5 h-5" />, color: "#EC4899", bg: "#FDF2F8" },
    { label: "Downloads", value: stats?.downloads ?? 0, icon: <Download className="w-5 h-5" />, color: "#6366F1", bg: "#EEF2FF" },
    { label: "Page Views", value: stats?.pageViews ?? 0, icon: <Eye className="w-5 h-5" />, color: "#14B8A6", bg: "#F0FDFA" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Dashboard Overview</h1>

      {/* Video Early Access — Featured Prominent Card */}
      <div className="mb-6 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Video className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Video Early Access Signups</h2>
              <p className="text-white/70 text-sm">Subscribers waiting for the product tour video</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold">{stats?.videoEarlyAccess ?? 0}</div>
            <div className="text-white/60 text-xs mt-1">total subscribers</div>
          </div>
        </div>
        {/* Subscriber Breakdown by Date */}
        <VideoEarlyAccessBreakdown />
      </div>

      {/* Stat Cards — 3-column grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#6B7280] text-sm font-medium">{card.label}</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                  <span style={{ color: card.color }}>{card.icon}</span>
                </div>
              </div>
              <div className="text-[30px] font-bold text-[#1F2937]">{card.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Contacts + Recent Messages — equal width 2-column */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Contacts */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1F2937] font-semibold text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>Recent Contacts</h2>
            <Badge variant="outline" className="border-[#3B82F6]/30 text-[#3B82F6] text-xs bg-[#EFF6FF]">{stats?.contacts ?? 0} total</Badge>
          </div>
          {recentContacts?.items && recentContacts.items.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.items.slice(0, 5).map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] text-xs font-bold shrink-0">
                    {(c.firstName?.[0] || c.email?.[0] || "?").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[#1F2937] text-sm font-medium truncate">{c.firstName} {c.lastName}</div>
                    <div className="text-[#6B7280] text-xs truncate">{c.email}</div>
                  </div>
                  <div className="text-[#9CA3AF] text-xs shrink-0">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#9CA3AF] text-sm text-center py-8">No contacts yet</div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1F2937] font-semibold text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>Recent Messages</h2>
            <Badge variant="outline" className="border-[#F59E0B]/30 text-[#F59E0B] text-xs bg-[#FFFBEB]">{stats?.submissions ?? 0} total</Badge>
          </div>
          {recentSubs?.items && recentSubs.items.length > 0 ? (
            <div className="space-y-3">
              {recentSubs.items.slice(0, 5).map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] text-xs font-bold shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[#1F2937] text-sm font-medium truncate">{s.name || s.firstName || "Unknown"}</div>
                    <div className="text-[#6B7280] text-xs truncate">{s.message?.substring(0, 60) || s.subject || "No message"}{s.message && s.message.length > 60 ? "..." : ""}</div>
                  </div>
                  <div className="text-[#9CA3AF] text-xs shrink-0">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#9CA3AF] text-sm text-center py-8">No messages yet</div>
          )}
        </div>
      </div>

      {/* Webinar Registrations + Quick Actions — equal width 2-column */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Webinar Registrations */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1F2937] font-semibold text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>Webinar Registrations</h2>
            <Badge variant="outline" className="border-[#A855F7]/30 text-[#A855F7] text-xs bg-[#FAF5FF]">
              <GraduationCap className="w-3 h-3 mr-1" />
              {webinarData?.length ?? 0} registered
            </Badge>
          </div>
          {webinarData && webinarData.length > 0 ? (
            <div className="space-y-3">
              {webinarData.slice(0, 5).map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7] text-xs font-bold shrink-0">
                    {(r.fullName?.[0] || "?").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[#1F2937] text-sm font-medium truncate">{r.fullName}</div>
                    <div className="text-[#6B7280] text-xs truncate">{r.email} · {r.companyName || "No company"}</div>
                  </div>
                  <div className="text-[#9CA3AF] text-xs shrink-0">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#9CA3AF] text-sm text-center py-8">No webinar registrations yet</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-[#1F2937] font-semibold text-base mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Quick Actions</h2>
          <div className="space-y-3">
            <a href="/events/25-march-webinar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#E74C3C]/10 flex items-center justify-center text-[#E74C3C] shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[#1F2937] text-sm font-medium group-hover:text-[#00C3FF] transition-colors">25 March Webinar Page</div>
                <div className="text-[#6B7280] text-xs">View the live registration page</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#00C3FF]" />
            </a>
            <a href="/events/hub-launch" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#F39C12]/10 flex items-center justify-center text-[#F39C12] shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[#1F2937] text-sm font-medium group-hover:text-[#00C3FF] transition-colors">Hub Launch Page</div>
                <div className="text-[#6B7280] text-xs">View the Hub launch event page</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#00C3FF]" />
            </a>
            <a href="/contact" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#00C3FF]/10 flex items-center justify-center text-[#00C3FF] shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[#1F2937] text-sm font-medium group-hover:text-[#00C3FF] transition-colors">Contact Page</div>
                <div className="text-[#6B7280] text-xs">View the public contact form</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#00C3FF]" />
            </a>
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[#1F2937] text-sm font-medium group-hover:text-[#00C3FF] transition-colors">View Live Site</div>
                <div className="text-[#6B7280] text-xs">Open the public-facing website</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#00C3FF]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contacts Panel ───
function ContactsPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = trpc.contacts.list.useQuery({ search: search || undefined, limit: 100 });
  const deleteMut = trpc.contacts.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Contact deleted"); } });
  const updateMut = trpc.contacts.update.useMutation({ onSuccess: () => { refetch(); toast.success("Contact updated"); } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>CRM Contacts</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search contacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white border-[#E5E7EB] text-[#1F2937] w-64 focus:border-[#00C3FF] focus:ring-[#00C3FF]/20"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Email</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Company</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Source</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-right text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-[#9CA3AF]">Loading...</td></tr>
              ) : !data?.items.length ? (
                <tr><td colSpan={7} className="text-center py-8 text-[#9CA3AF]">No contacts yet. They will appear here when visitors interact with your forms.</td></tr>
              ) : (
                data.items.map(contact => (
                  <tr key={contact.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3 text-[#1F2937] text-sm font-medium">{contact.firstName} {contact.lastName}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-sm">{contact.email}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-sm">{contact.company || "—"}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-xs border-[#E5E7EB] text-[#6B7280] bg-[#F9FAFB]">{contact.source}</Badge></td>
                    <td className="px-4 py-3">
                      <select
                        value={contact.status}
                        onChange={e => updateMut.mutate({ id: contact.id, status: e.target.value as any })}
                        className="bg-white text-xs text-[#1F2937] border border-[#E5E7EB] rounded-md px-2 py-1 focus:border-[#00C3FF] focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-[#9CA3AF] text-xs">{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate({ id: contact.id })} className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && <div className="px-4 py-3 border-t border-[#E5E7EB] text-[#9CA3AF] text-xs bg-[#F9FAFB]">{data.total} total contacts</div>}
      </div>
    </div>
  );
}

// ─── Companies Panel ───
function CompaniesPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = trpc.companies.list.useQuery({ search: search || undefined });
  const deleteMut = trpc.companies.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Company deleted"); } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Companies</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white border-[#E5E7EB] text-[#1F2937] w-64 focus:border-[#00C3FF]" />
        </div>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Company</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Industry</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Size</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Website</th>
              <th className="text-right text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-[#9CA3AF]">Loading...</td></tr>
            ) : !data?.items.length ? (
              <tr><td colSpan={5} className="text-center py-8 text-[#9CA3AF]">No companies yet. Add them manually from the CRM.</td></tr>
            ) : (
              data.items.map(c => (
                <tr key={c.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 text-[#1F2937] text-sm font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm">{c.industry || "—"}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm">{c.size || "—"}</td>
                  <td className="px-4 py-3 text-[#00C3FF] text-sm">{c.website || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate({ id: c.id })} className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Subscribers Panel ───
function SubscribersPanel() {
  const { data, isLoading, refetch } = trpc.subscribers.list.useQuery({});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Newsletter Subscribers</h1>
        <Button variant="outline" size="icon" onClick={() => refetch()} className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Email</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Source</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-[#9CA3AF]">Loading...</td></tr>
            ) : !data?.items.length ? (
              <tr><td colSpan={5} className="text-center py-8 text-[#9CA3AF]">No subscribers yet.</td></tr>
            ) : (
              data.items.map(s => (
                <tr key={s.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 text-[#1F2937] text-sm font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm">{s.firstName || ""} {s.lastName || ""}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm">{s.source || "website"}</td>
                  <td className="px-4 py-3">
                    <Badge className={s.isActive ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}>
                      {s.isActive ? "Active" : "Unsubscribed"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data && <div className="px-4 py-3 border-t border-[#E5E7EB] text-[#9CA3AF] text-xs bg-[#F9FAFB]">{data.total} total subscribers</div>}
      </div>
    </div>
  );
}

// ─── Submissions Panel ───
function SubmissionsPanel() {
  const { data, isLoading, refetch } = trpc.submissions.list.useQuery({});
  const updateStatus = trpc.submissions.updateStatus.useMutation({ onSuccess: () => { refetch(); toast.success("Status updated"); } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Contact Form Submissions</h1>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-[#9CA3AF] text-center py-8">Loading...</div>
        ) : !data?.items.length ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-[#9CA3AF] shadow-sm">No submissions yet.</div>
        ) : (
          data.items.map(sub => (
            <div key={sub.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[#1F2937] font-medium">{sub.firstName} {sub.lastName}</div>
                  <div className="text-[#6B7280] text-sm">{sub.email} {sub.phone && `• ${sub.phone}`}</div>
                  {sub.company && <div className="text-[#9CA3AF] text-xs mt-1">{sub.company}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={sub.status}
                    onChange={e => updateStatus.mutate({ id: sub.id, status: e.target.value as any })}
                    className="bg-white text-xs text-[#1F2937] border border-[#E5E7EB] rounded-md px-2 py-1 focus:border-[#00C3FF] focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <span className="text-[#9CA3AF] text-xs">{new Date(sub.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {sub.subject && <div className="text-[#00C3FF] text-sm font-medium mb-2">{sub.subject}</div>}
              <p className="text-[#4B5563] text-sm leading-relaxed">{sub.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Signups Panel ───
function SignupsPanel() {
  const { data, isLoading } = trpc.signups.list.useQuery({});

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hub Signups / Early Access</h1>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Email</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Company</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Interest</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-[#9CA3AF]">Loading...</td></tr>
            ) : !data?.items.length ? (
              <tr><td colSpan={5} className="text-center py-8 text-[#9CA3AF]">No signups yet.</td></tr>
            ) : (
              data.items.map(s => (
                <tr key={s.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 text-[#1F2937] text-sm font-medium">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm">{s.email}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm">{s.company || "—"}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm">{s.interest || "—"}</td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data && <div className="px-4 py-3 border-t border-[#E5E7EB] text-[#9CA3AF] text-xs bg-[#F9FAFB]">{data.total} total signups</div>}
      </div>
    </div>
  );
}

// ─── Downloads Panel ───
const FILE_CATEGORIES = ["Compliance Guide", "Checklist", "Template", "Policy Document", "Training Material", "Case Study", "Whitepaper", "Report", "Other"];

const fileIconMap: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  doc: <FileText className="w-5 h-5 text-blue-500" />,
  docx: <FileText className="w-5 h-5 text-blue-500" />,
  xls: <FileSpreadsheet className="w-5 h-5 text-green-500" />,
  xlsx: <FileSpreadsheet className="w-5 h-5 text-green-500" />,
  png: <FileImage className="w-5 h-5 text-purple-500" />,
  jpg: <FileImage className="w-5 h-5 text-purple-500" />,
  jpeg: <FileImage className="w-5 h-5 text-purple-500" />,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function DownloadsPanel() {
  const utils = trpc.useUtils();
  const { data: allDownloads, isLoading } = trpc.downloads.listAll.useQuery();
  const uploadMutation = trpc.downloads.upload.useMutation({
    onSuccess: () => { utils.downloads.listAll.invalidate(); toast.success("Document uploaded successfully!"); setShowUpload(false); resetForm(); },
    onError: (e) => toast.error("Upload failed: " + e.message),
  });
  const updateMutation = trpc.downloads.update.useMutation({
    onSuccess: () => { utils.downloads.listAll.invalidate(); toast.success("Document updated!"); setEditingId(null); },
    onError: (e) => toast.error("Update failed: " + e.message),
  });
  const deleteMutation = trpc.downloads.delete.useMutation({
    onSuccess: () => { utils.downloads.listAll.invalidate(); toast.success("Document deleted."); },
    onError: (e) => toast.error("Delete failed: " + e.message),
  });
  const togglePublishMutation = trpc.downloads.update.useMutation({
    onSuccess: () => { utils.downloads.listAll.invalidate(); },
    onError: (e) => toast.error("Toggle failed: " + e.message),
  });

  const [showUpload, setShowUpload] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const resetForm = () => { setTitle(""); setDescription(""); setCategory(""); setIsPublished(true); setSelectedFile(null); };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) { toast.error("Please provide a title and select a file."); return; }
    if (selectedFile.size > 16 * 1024 * 1024) { toast.error("File size must be under 16 MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await uploadMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        fileName: selectedFile.name,
        fileBase64: base64,
        contentType: selectedFile.type || "application/octet-stream",
        fileType: selectedFile.name.split(".").pop()?.toLowerCase() || "file",
        fileSize: formatFileSize(selectedFile.size),
        category: category || undefined,
        isPublished,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const startEdit = (d: any) => {
    setEditingId(d.id);
    setEditTitle(d.title);
    setEditDescription(d.description || "");
    setEditCategory(d.category || "");
  };

  const saveEdit = async () => {
    if (!editingId || !editTitle.trim()) return;
    await updateMutation.mutateAsync({ id: editingId, title: editTitle.trim(), description: editDescription.trim() || undefined, category: editCategory || undefined });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Documents &amp; Lead Magnets</h1>
        <Button onClick={() => { setShowUpload(!showUpload); if (showUpload) resetForm(); }} className="bg-[#00C3FF] hover:bg-[#00C3FF]/80 text-[#0D1B2A] font-semibold">
          {showUpload ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Upload className="w-4 h-4 mr-2" /> Upload Document</>}
        </Button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-base font-semibold text-[#1F2937] mb-4">Upload New Document</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Title *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Right to Work Checklist" className="bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm">
                <option value="">Select category...</option>
                {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#374151] mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this resource..." rows={2} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm resize-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#374151] mb-1">File * (max 16 MB)</label>
            <div className="border-2 border-dashed border-[#D1D5DB] rounded-lg p-6 text-center hover:border-[#00C3FF] transition-colors cursor-pointer" onClick={() => document.getElementById("file-upload-input")?.click()}>
              <input id="file-upload-input" type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip" onChange={e => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  {fileIconMap[selectedFile.name.split(".").pop()?.toLowerCase() || ""] || <File className="w-5 h-5 text-[#6B7280]" />}
                  <span className="text-sm text-[#1F2937] font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-[#9CA3AF]">({formatFileSize(selectedFile.size)})</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                  <p className="text-sm text-[#6B7280]">Click to select a file or drag and drop</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">PDF, DOC, DOCX, XLS, XLSX, PPT, PNG, JPG, ZIP</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <button type="button" onClick={() => setIsPublished(!isPublished)} className="text-[#00C3FF]">
                {isPublished ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-[#9CA3AF]" />}
              </button>
              <span className="text-sm text-[#374151]">{isPublished ? "Published (visible on site)" : "Draft (hidden from site)"}</span>
            </label>
            <Button onClick={handleUpload} disabled={uploadMutation.isPending || !selectedFile || !title.trim()} className="bg-[#00C3FF] hover:bg-[#00C3FF]/80 text-[#0D1B2A] font-semibold">
              {uploadMutation.isPending ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Upload &amp; Save</>}
            </Button>
          </div>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Document</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Category</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Size</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3 text-center">Downloads</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-[#9CA3AF]">Loading...</td></tr>
            ) : !allDownloads?.length ? (
              <tr><td colSpan={6} className="text-center py-12 text-[#9CA3AF]">
                <Upload className="w-10 h-10 mx-auto mb-3 text-[#D1D5DB]" />
                <p className="font-medium text-[#6B7280]">No documents uploaded yet</p>
                <p className="text-sm mt-1">Click "Upload Document" to add your first lead magnet.</p>
              </td></tr>
            ) : (
              allDownloads.map(d => (
                editingId === d.id ? (
                  <tr key={d.id} className="border-b border-[#F3F4F6] bg-[#F0FDFA]">
                    <td className="px-4 py-3" colSpan={4}>
                      <div className="flex flex-col gap-2">
                        <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" className="bg-white text-sm" />
                        <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Description" rows={2} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm resize-none" />
                        <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm">
                          <option value="">No category</option>
                          {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3" colSpan={2}>
                      <div className="flex flex-col gap-2 items-end">
                        <Button size="sm" onClick={saveEdit} disabled={updateMutation.isPending} className="bg-[#00C3FF] hover:bg-[#00C3FF]/80 text-[#0D1B2A] text-xs w-20">
                          {updateMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-xs w-20">Cancel</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={d.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {fileIconMap[d.fileType || ""] || <File className="w-5 h-5 text-[#6B7280]" />}
                        <div>
                          <div className="text-[#1F2937] text-sm font-medium">{d.title}</div>
                          {d.description && <div className="text-[#9CA3AF] text-xs mt-0.5 line-clamp-1 max-w-xs">{d.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] text-sm">{d.category || "—"}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-sm">{d.fileSize || "—"}</td>
                    <td className="px-4 py-3 text-[#00C3FF] text-sm font-semibold text-center">{d.downloadCount}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublishMutation.mutate({ id: d.id, isPublished: !d.isPublished })} className="cursor-pointer">
                        <Badge className={d.isPublished ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100" : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"}>
                          {d.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937] transition-colors" title="Preview file">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => startEdit(d)} className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937] transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {deleteConfirmId === d.id ? (
                          <div className="flex items-center gap-1 ml-1">
                            <Button size="sm" variant="destructive" onClick={() => { deleteMutation.mutate({ id: d.id }); setDeleteConfirmId(null); }} className="h-7 text-xs px-2">Confirm</Button>
                            <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(null)} className="h-7 text-xs px-2">Cancel</Button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirmId(d.id)} className="p-1.5 rounded-md hover:bg-red-50 text-[#6B7280] hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Download Logs */}
      {allDownloads && allDownloads.length > 0 && <DownloadLogsSection />}
    </div>
  );
}

function DownloadLogsSection() {
  const { data: logs, isLoading } = trpc.downloads.logs.useQuery({});
  if (isLoading) return null;
  if (!logs?.length) return null;
  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-[#1F2937] mb-4">Recent Download Activity</h3>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Email</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 20).map((log, i) => (
              <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                <td className="px-4 py-2 text-sm text-[#1F2937]">{log.email || "Anonymous"}</td>
                <td className="px-4 py-2 text-sm text-[#6B7280]">{[log.firstName, log.lastName].filter(Boolean).join(" ") || "—"}</td>
                <td className="px-4 py-2 text-sm text-[#9CA3AF]">{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Visitors Panel ───
function VisitorsPanel() {
  const { data: stats, isLoading: statsLoading } = trpc.tracking.stats.useQuery({ days: 30 });
  const { data: recent, isLoading: recentLoading } = trpc.tracking.recentVisitors.useQuery({ limit: 50 });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Visitor Analytics (Last 30 Days)</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="text-[#6B7280] text-sm mb-2">Total Page Views</div>
          <div className="text-[30px] font-bold text-[#1F2937]">{statsLoading ? "..." : stats?.totalViews.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="text-[#6B7280] text-sm mb-2">Unique Visitors</div>
          <div className="text-[30px] font-bold text-[#1F2937]">{statsLoading ? "..." : stats?.uniqueVisitors.toLocaleString()}</div>
        </div>
      </div>

      {/* Top Pages */}
      {stats?.topPages && stats.topPages.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-[#1F2937] font-semibold text-sm uppercase tracking-wider mb-4">Top Pages</h3>
          <div className="space-y-2">
            {stats.topPages.map((page, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                <span className="text-[#4B5563] text-sm">{page.path}</span>
                <span className="text-[#00C3FF] text-sm font-medium">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Visitors */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <h3 className="text-[#1F2937] font-semibold text-sm uppercase tracking-wider">Recent Visitors</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Page</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Referrer</th>
              <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentLoading ? (
              <tr><td colSpan={3} className="text-center py-8 text-[#9CA3AF]">Loading...</td></tr>
            ) : !recent?.length ? (
              <tr><td colSpan={3} className="text-center py-8 text-[#9CA3AF]">No visitor data yet. Page views will be tracked automatically.</td></tr>
            ) : (
              recent.map((v, i) => (
                <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 text-[#1F2937] text-sm">{v.path}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-sm truncate max-w-[200px]">{v.referrer || "Direct"}</td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs">{new Date(v.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Notifications Panel ───
function NotificationsPanel() {
  const { data, isLoading, refetch } = trpc.notifications.list.useQuery({});
  const markRead = trpc.notifications.markRead.useMutation({ onSuccess: () => refetch() });
  const markAllRead = trpc.notifications.markAllRead.useMutation({ onSuccess: () => { refetch(); toast.success("All marked as read"); } });

  const typeColors: Record<string, string> = {
    signup: "#EC4899",
    contact: "#F59E0B",
    subscriber: "#10B981",
    download: "#6366F1",
    system: "#9CA3AF",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Notifications</h1>
          {data && <p className="text-[#6B7280] text-sm mt-1">{data.unreadCount} unread</p>}
        </div>
        <Button variant="outline" onClick={() => markAllRead.mutate()} className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB] text-xs">
          <Check className="w-3.5 h-3.5 mr-1" /> Mark All Read
        </Button>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-[#9CA3AF] text-center py-8">Loading...</div>
        ) : !data?.items.length ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-[#9CA3AF] shadow-sm">
            No notifications yet. You will be notified when visitors interact with your site.
          </div>
        ) : (
          data.items.map(n => (
            <div
              key={n.id}
              className={`bg-white border rounded-xl p-4 transition-all cursor-pointer hover:shadow-md ${
                n.isRead ? "border-[#E5E7EB]" : "border-[#00C3FF]/40 shadow-sm shadow-[#00C3FF]/5"
              }`}
              onClick={() => !n.isRead && markRead.mutate({ id: n.id })}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: typeColors[n.type] || "#9CA3AF" }} />
                  <div>
                    <div className="text-[#1F2937] font-medium text-sm">{n.title}</div>
                    <div className="text-[#6B7280] text-sm mt-1">{n.message}</div>
                  </div>
                </div>
                <span className="text-[#9CA3AF] text-xs shrink-0 ml-4">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Applications Panel ───
function ApplicationsPanel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const limit = 20;

  const { data, isLoading, refetch } = trpc.jobs.listApplications.useQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    sector: sectorFilter || undefined,
    limit,
    offset: page * limit,
  });

  const { data: detail, isLoading: detailLoading } = trpc.jobs.getApplication.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  const updateStatus = trpc.jobs.updateApplicationStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Status updated"); },
  });

  const statusColors: Record<string, string> = {
    new: "#3B82F6",
    reviewed: "#F59E0B",
    shortlisted: "#10B981",
    interviewed: "#8B5CF6",
    offered: "#14B8A6",
    rejected: "#EF4444",
  };

  const sectors = ["Healthcare", "IT and Digital", "Business and Finance", "Engineering", "Construction", "Hospitality", "Education", "Logistics"];

  // CSV Export
  const exportCSV = () => {
    if (!data?.items?.length) { toast.error("No applications to export"); return; }
    const headers = ["ID", "Name", "Email", "Mobile", "Job Title", "Employer", "Sector", "Status", "Right to Work", "NI Number", "Postcode", "Available Start", "Applied Date"];
    const rows = data.items.map((a: any) => [
      a.id,
      `${a.firstName} ${a.surname}`,
      a.email,
      a.mobile,
      a.jobTitle || "",
      a.employerName || "",
      a.sector || "",
      a.status,
      a.rightToWork || "",
      a.nationalInsuranceNumber || "",
      a.postcode,
      a.availableStartDate || "",
      new Date(a.createdAt).toLocaleDateString("en-GB"),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Job Applications
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">{data?.total ?? 0} total applications</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm" className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button onClick={exportCSV} size="sm" className="bg-[#00C3FF] hover:bg-[#00B0E6] text-white">
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 bg-white border-[#E5E7EB] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#00C3FF]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          className="bg-white border border-[#E5E7EB] text-[#1F2937] rounded-md px-3 py-2 text-sm focus:border-[#00C3FF] focus:outline-none"
        >
          <option value="">All Statuses</option>
          {Object.keys(statusColors).map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select
          value={sectorFilter}
          onChange={e => { setSectorFilter(e.target.value); setPage(0); }}
          className="bg-white border border-[#E5E7EB] text-[#1F2937] rounded-md px-3 py-2 text-sm focus:border-[#00C3FF] focus:outline-none"
        >
          <option value="">All Sectors</option>
          {sectors.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card className="bg-white border-[#E5E7EB] shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-[#00C3FF] border-t-transparent rounded-full" />
            </div>
          ) : !data?.items?.length ? (
            <div className="text-center py-16 text-[#9CA3AF]">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    <th className="text-left px-4 py-3 text-[#6B7280] font-medium">Applicant</th>
                    <th className="text-left px-4 py-3 text-[#6B7280] font-medium">Position</th>
                    <th className="text-left px-4 py-3 text-[#6B7280] font-medium">Sector</th>
                    <th className="text-left px-4 py-3 text-[#6B7280] font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[#6B7280] font-medium">Applied</th>
                    <th className="text-left px-4 py-3 text-[#6B7280] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((app: any) => (
                    <tr key={app.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-[#1F2937] font-medium">{app.firstName} {app.surname}</div>
                        <div className="text-[#9CA3AF] text-xs">{app.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[#1F2937]">{app.jobTitle || "—"}</div>
                        <div className="text-[#9CA3AF] text-xs">{app.employerName || ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#6B7280]">{app.sector || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className="text-xs font-medium"
                          style={{ backgroundColor: `${statusColors[app.status] || "#6B7280"}15`, color: statusColors[app.status] || "#6B7280", border: `1px solid ${statusColors[app.status] || "#6B7280"}30` }}
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#9CA3AF] text-xs">
                        {new Date(app.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedId(app.id)}
                            className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB] h-7 px-2 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" /> View
                          </Button>
                          <select
                            value={app.status}
                            onChange={e => updateStatus.mutate({ id: app.id, status: e.target.value as any })}
                            className="bg-white border border-[#E5E7EB] text-[#1F2937] rounded px-1 py-0.5 text-xs h-7 focus:border-[#00C3FF] focus:outline-none"
                          >
                            {Object.keys(statusColors).map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[#6B7280] text-sm">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="border-[#E5E7EB] text-[#6B7280]">
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="border-[#E5E7EB] text-[#6B7280]">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal — light theme */}
      {selectedId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 overflow-y-auto">
          <div className="bg-white border border-[#E5E7EB] rounded-xl w-full max-w-3xl mx-4 mb-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Application Detail
                </h2>
                {detail && (
                  <p className="text-[#6B7280] text-sm mt-1">{detail.firstName} {detail.surname} — {detail.jobTitle}</p>
                )}
              </div>
              <button onClick={() => setSelectedId(null)} className="text-[#9CA3AF] hover:text-[#1F2937] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-[#00C3FF] border-t-transparent rounded-full" />
                </div>
              ) : detail ? (
                <>
                  {/* Status & Admin */}
                  <div className="flex items-center gap-3">
                    <Badge
                      className="text-sm"
                      style={{ backgroundColor: `${statusColors[detail.status] || "#6B7280"}15`, color: statusColors[detail.status] || "#6B7280", border: `1px solid ${statusColors[detail.status] || "#6B7280"}30` }}
                    >
                      {detail.status}
                    </Badge>
                    <select
                      value={detail.status}
                      onChange={e => updateStatus.mutate({ id: detail.id, status: e.target.value as any })}
                      className="bg-white border border-[#E5E7EB] text-[#1F2937] rounded-md px-2 py-1 text-sm focus:border-[#00C3FF] focus:outline-none"
                    >
                      {Object.keys(statusColors).map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <span className="text-[#9CA3AF] text-xs ml-auto">Applied: {new Date(detail.createdAt).toLocaleDateString("en-GB")}</span>
                  </div>

                  {/* Step 1: Position */}
                  <DetailSection title="Position & Availability">
                    <DetailRow label="Position" value={detail.jobTitle} />
                    <DetailRow label="Employer" value={detail.employerName} />
                    <DetailRow label="Sector" value={detail.sector} />
                    <DetailRow label="Available Start" value={detail.availableStartDate} />
                  </DetailSection>

                  {/* Step 2: Personal */}
                  <DetailSection title="Personal Information">
                    <DetailRow label="Name" value={`${detail.firstName} ${detail.surname}`} />
                    <DetailRow label="NI Number" value={detail.nationalInsuranceNumber} />
                    <DetailRow label="Address" value={[detail.addressLine1, detail.addressLine2, detail.postcode, detail.country].filter(Boolean).join(", ")} />
                    <DetailRow label="Mobile" value={detail.mobile} />
                    <DetailRow label="Email" value={detail.email} />
                    <DetailRow label="Right to Work" value={detail.rightToWork} />
                    <DetailRow label="UK Driving Licence" value={detail.hasUkDrivingLicence} />
                  </DetailSection>

                  {/* Step 3: Employment History */}
                  <DetailSection title="Employment History">
                    {Array.isArray(detail.employmentHistory) && detail.employmentHistory.length > 0 ? (
                      detail.employmentHistory.map((emp: any, i: number) => (
                        <div key={i} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 mb-2">
                          <div className="text-[#1F2937] font-medium text-sm">{emp.jobTitle} at {emp.employer}</div>
                          <div className="text-[#6B7280] text-xs">{emp.startDate} — {emp.endDate || "Present"}</div>
                          {emp.reasonForLeaving && <div className="text-[#9CA3AF] text-xs mt-1">Reason: {emp.reasonForLeaving}</div>}
                        </div>
                      ))
                    ) : (
                      <p className="text-[#9CA3AF] text-sm">No employment history provided</p>
                    )}
                  </DetailSection>

                  {/* Step 4: Address History */}
                  <DetailSection title="Address History">
                    {Array.isArray(detail.addressHistory) && detail.addressHistory.length > 0 ? (
                      detail.addressHistory.map((addr: any, i: number) => (
                        <div key={i} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 mb-2">
                          <div className="text-[#1F2937] text-sm">{addr.address}, {addr.postcode}</div>
                          <div className="text-[#6B7280] text-xs">{addr.fromDate} — {addr.toDate || "Present"}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#9CA3AF] text-sm">No address history provided</p>
                    )}
                  </DetailSection>

                  {/* Step 5: Qualifications */}
                  <DetailSection title="Education & Qualifications">
                    {Array.isArray(detail.qualifications) && detail.qualifications.length > 0 ? (
                      detail.qualifications.map((q: any, i: number) => (
                        <div key={i} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 mb-2">
                          <div className="text-[#1F2937] text-sm font-medium">{q.qualification}</div>
                          <div className="text-[#6B7280] text-xs">{q.institution} — {q.yearObtained}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#9CA3AF] text-sm">No qualifications provided</p>
                    )}
                  </DetailSection>

                  {/* Step 6: Sector Certifications */}
                  <DetailSection title="Sector Certifications">
                    {detail.sectorCertifications ? (
                      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                        <pre className="text-[#6B7280] text-xs whitespace-pre-wrap">{JSON.stringify(detail.sectorCertifications, null, 2)}</pre>
                      </div>
                    ) : (
                      <p className="text-[#9CA3AF] text-sm">No sector certifications provided</p>
                    )}
                  </DetailSection>

                  {/* Step 7: Sector Experience */}
                  <DetailSection title="Sector Experience">
                    {detail.sectorExperience ? (
                      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                        <pre className="text-[#6B7280] text-xs whitespace-pre-wrap">{JSON.stringify(detail.sectorExperience, null, 2)}</pre>
                      </div>
                    ) : (
                      <p className="text-[#9CA3AF] text-sm">No sector experience provided</p>
                    )}
                  </DetailSection>

                  {/* Step 8: Driving & Location */}
                  <DetailSection title="Driving & Location">
                    <DetailRow label="Valid Driving Licence" value={detail.hasValidDrivingLicence} />
                    <DetailRow label="Vehicle Access" value={detail.hasVehicleAccess} />
                    <DetailRow label="Business Insurance" value={detail.hasBusinessInsurance} />
                    <DetailRow label="Lives Within 10 Miles" value={detail.livesWithin10Miles} />
                    <DetailRow label="Willing to Relocate" value={detail.willingToRelocate} />
                    <DetailRow label="Can Start Within 4 Weeks" value={detail.canStartWithin4Weeks} />
                  </DetailSection>

                  {/* Step 9: References */}
                  <DetailSection title="References">
                    {Array.isArray(detail.references) && detail.references.length > 0 ? (
                      detail.references.map((ref: any, i: number) => (
                        <div key={i} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 mb-2">
                          <div className="text-[#1F2937] text-sm font-medium">{ref.name}</div>
                          <div className="text-[#6B7280] text-xs">{ref.relationship} — {ref.company}</div>
                          <div className="text-[#6B7280] text-xs">{ref.phone} | {ref.email}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#9CA3AF] text-sm">No references provided</p>
                    )}
                  </DetailSection>

                  {/* Step 10: Screening & Declaration */}
                  <DetailSection title="Screening & Declaration">
                    <DetailRow label="Screening Q1" value={detail.screeningQ1} />
                    <DetailRow label="Screening Q2" value={detail.screeningQ2} />
                    <DetailRow label="Screening Q3" value={detail.screeningQ3} />
                    <DetailRow label="Criminal Conviction" value={detail.hasCriminalConviction} />
                    {detail.criminalConvictionDetails && <DetailRow label="Conviction Details" value={detail.criminalConvictionDetails} />}
                    <DetailRow label="CV" value={detail.cvUrl ? "Uploaded" : "Not uploaded"} />
                    {detail.cvUrl && (
                      <a href={detail.cvUrl} target="_blank" rel="noopener noreferrer" className="text-[#00C3FF] text-sm hover:underline flex items-center gap-1 mt-1">
                        <FileText className="w-3 h-3" /> Download CV
                      </a>
                    )}
                    <DetailRow label="Declaration Accepted" value={detail.declarationAccepted ? "Yes" : "No"} />
                    <DetailRow label="Print Name" value={detail.printName} />
                    <DetailRow label="Declaration Date" value={detail.declarationDate} />
                  </DetailSection>

                  {/* Admin Notes */}
                  <DetailSection title="Admin Notes">
                    <textarea
                      defaultValue={detail.adminNotes || ""}
                      onBlur={e => {
                        if (e.target.value !== (detail.adminNotes || "")) {
                          updateStatus.mutate({ id: detail.id, status: detail.status, adminNotes: e.target.value });
                        }
                      }}
                      placeholder="Add notes about this application..."
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#1F2937] rounded-lg p-3 text-sm resize-y min-h-[80px] placeholder:text-[#9CA3AF] focus:border-[#00C3FF] focus:outline-none"
                    />
                  </DetailSection>
                </>
              ) : (
                <p className="text-[#9CA3AF] text-center py-8">Application not found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Webinar Registrations Panel ───
function WebinarRegistrationsPanel() {
  const [filterSlug, setFilterSlug] = useState("");
  const { data, isLoading, refetch } = trpc.webinar.list.useQuery(
    filterSlug ? { eventSlug: filterSlug } : {}
  );

  const eventLabels: Record<string, string> = {
    "25-march-webinar": "25 March Webinar",
    "hub-launch": "Hub Launch",
    "new-website-launch": "New Website Launch",
    "sponsorship-files-launch": "Podcast Launch",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Webinar Registrations</h1>
          {data && <p className="text-[#6B7280] text-sm mt-1">{data.length} registration{data.length !== 1 ? "s" : ""}</p>}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterSlug}
            onChange={e => setFilterSlug(e.target.value)}
            className="bg-white border border-[#E5E7EB] text-[#1F2937] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#00C3FF]"
          >
            <option value="">All Events</option>
            {Object.entries(eventLabels).map(([slug, label]) => (
              <option key={slug} value={slug}>{label}</option>
            ))}
          </select>
          <Button variant="outline" size="icon" onClick={() => refetch()} className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Email</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Company</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Workers</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Licence</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Event</th>
                <th className="text-left text-[#6B7280] text-xs font-medium uppercase tracking-wider px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-[#9CA3AF]">Loading...</td></tr>
              ) : !data?.length ? (
                <tr><td colSpan={7} className="text-center py-8 text-[#9CA3AF]">No webinar registrations yet.</td></tr>
              ) : (
                data.map((reg: any) => (
                  <tr key={reg.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3 text-[#1F2937] text-sm font-medium">{reg.fullName}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${reg.email}`} className="text-[#00C3FF] text-sm hover:underline">{reg.email}</a>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] text-sm">{reg.companyName || "—"}</td>
                    <td className="px-4 py-3 text-[#6B7280] text-sm">{reg.sponsoredWorkers || "—"}</td>
                    <td className="px-4 py-3">
                      {reg.hasSponsorLicence ? (
                        <Badge className={`text-xs ${
                          reg.hasSponsorLicence === "Yes" ? "bg-green-50 text-green-600 border border-green-200" :
                          reg.hasSponsorLicence === "No" ? "bg-red-50 text-red-600 border border-red-200" :
                          "bg-yellow-50 text-yellow-600 border border-yellow-200"
                        }`}>
                          {reg.hasSponsorLicence}
                        </Badge>
                      ) : (
                        <span className="text-[#9CA3AF] text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 text-xs">
                        {eventLabels[reg.eventSlug] || reg.eventSlug}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[#9CA3AF] text-xs">{new Date(reg.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Helpers ───
function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[#1F2937] font-semibold text-sm mb-2 flex items-center gap-2">
        <div className="w-1 h-4 bg-[#00C3FF] rounded-full" />
        {title}
      </h3>
      <div className="pl-3">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-[#6B7280] text-sm min-w-[140px]">{label}:</span>
      <span className="text-[#1F2937] text-sm">{value || "—"}</span>
    </div>
  );
}

// ─── Jobs Management Panel ───
function JobsManagementPanel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [page, setPage] = useState(0);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [viewingJob, setViewingJob] = useState<any>(null);
  const limit = 20;

  const { data: statsData } = trpc.jobs.stats.useQuery();
  const { data, isLoading, refetch } = trpc.jobs.listAll.useQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    tier: tierFilter || undefined,
    limit,
    offset: page * limit,
  });

  const updateJob = trpc.jobs.update.useMutation({
    onSuccess: () => { refetch(); toast.success("Job updated"); setEditingJob(null); },
    onError: (e) => toast.error(e.message),
  });

  const deleteJob = trpc.jobs.delete.useMutation({
    onSuccess: () => { refetch(); toast.success("Job deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const statusColors: Record<string, string> = {
    draft: "#9CA3AF", pending: "#F59E0B", active: "#10B981", expired: "#EF4444", closed: "#6B7280",
  };
  const tierColors: Record<string, string> = {
    free: "#6B7280", sponsored: "#3B82F6", premium: "#F59E0B", managed: "#8B5CF6",
  };

  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  const exportCSV = () => {
    if (!data?.items?.length) { toast.error("No jobs to export"); return; }
    const headers = ["ID", "Title", "Company", "Location", "Sector", "Status", "Tier", "Salary", "Type", "Views", "Applications", "Posted"];
    const rows = data.items.map((j: any) => [
      j.id, j.title, j.company, j.location, j.sector, j.status, j.tier,
      j.salaryMin && j.salaryMax ? `£${j.salaryMin.toLocaleString()}-£${j.salaryMax.toLocaleString()}` : "Not specified",
      j.jobType, j.viewCount, j.applicationCount,
      new Date(j.createdAt).toLocaleDateString("en-GB"),
    ]);
    const csv = [headers.join(","), ...rows.map((r: any) => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `jobs-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  if (viewingJob) {
    return (
      <div>
        <Button variant="outline" size="sm" onClick={() => setViewingJob(null)} className="mb-4 border-[#E5E7EB] text-[#6B7280]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Jobs
        </Button>
        <Card className="bg-white border border-[#E5E7EB] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">{viewingJob.title}</h2>
                <p className="text-[#6B7280] mt-1">{viewingJob.company} — {viewingJob.location}</p>
              </div>
              <div className="flex gap-2">
                <Badge style={{ backgroundColor: statusColors[viewingJob.status] || "#6B7280", color: "#fff" }}>{viewingJob.status}</Badge>
                <Badge style={{ backgroundColor: tierColors[viewingJob.tier] || "#6B7280", color: "#fff" }}>{viewingJob.tier}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">Sector</p>
                <p className="text-sm font-medium text-[#1F2937]">{viewingJob.sector}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">Salary</p>
                <p className="text-sm font-medium text-[#1F2937]">
                  {viewingJob.salaryMin && viewingJob.salaryMax ? `£${viewingJob.salaryMin.toLocaleString()} - £${viewingJob.salaryMax.toLocaleString()} ${viewingJob.salaryType}` : "Not specified"}
                </p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">Job Type</p>
                <p className="text-sm font-medium text-[#1F2937]">{viewingJob.jobType?.replace("_", " ")}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">SOC Code</p>
                <p className="text-sm font-medium text-[#1F2937]">{viewingJob.socCode || "—"}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">Views</p>
                <p className="text-sm font-medium text-[#1F2937]">{viewingJob.viewCount}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">Applications</p>
                <p className="text-sm font-medium text-[#1F2937]">{viewingJob.applicationCount}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">Sponsorship</p>
                <p className="text-sm font-medium text-[#1F2937]">{viewingJob.sponsorshipOffered ? "Yes" : "No"}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-xs text-[#6B7280]">Contact</p>
                <p className="text-sm font-medium text-[#1F2937] truncate">{viewingJob.contactEmail}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#1F2937] mb-2">Description</h3>
              <p className="text-sm text-[#6B7280] whitespace-pre-wrap">{viewingJob.description}</p>
            </div>
            {viewingJob.requirements && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#1F2937] mb-2">Requirements</h3>
                <p className="text-sm text-[#6B7280] whitespace-pre-wrap">{viewingJob.requirements}</p>
              </div>
            )}
            {viewingJob.benefits && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#1F2937] mb-2">Benefits</h3>
                <p className="text-sm text-[#6B7280] whitespace-pre-wrap">{viewingJob.benefits}</p>
              </div>
            )}
            {/* Compliance Pre-Qualification Section */}
            {(viewingJob.sponsorLicenceStatus || viewingJob.cosAvailability || viewingJob.homeOfficeInspection) && (() => {
              const flaggedValues = ["Yes \u2014 but currently suspended", "No \u2014 I don't have one yet", "No \u2014 I need to request more", "Yes \u2014 licence downgraded", "Yes \u2014 licence revoked (now reinstated)"];
              const licenceFlagged = flaggedValues.includes(viewingJob.sponsorLicenceStatus);
              const cosFlagged = flaggedValues.includes(viewingJob.cosAvailability);
              const inspectionFlagged = flaggedValues.includes(viewingJob.homeOfficeInspection);
              const anyFlagged = licenceFlagged || cosFlagged || inspectionFlagged;
              return (
                <div className={`mb-4 border rounded-lg p-4 ${anyFlagged ? 'border-[#EF4444]/40 bg-[#FEF2F2]' : 'border-[#10B981]/30 bg-[#ECFDF5]'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className={`w-4 h-4 ${anyFlagged ? 'text-[#EF4444]' : 'text-[#10B981]'}`} />
                    <h3 className="text-sm font-semibold text-[#1F2937]">Compliance Pre-Qualification</h3>
                    {anyFlagged && <Badge className="bg-[#EF4444] text-white text-[10px] px-2 py-0.5 ml-auto">FLAGGED — Extra Scrutiny Required</Badge>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className={`rounded-lg p-3 ${licenceFlagged ? 'bg-[#FEE2E2] border border-[#EF4444]/30' : 'bg-white/60'}`}>
                      <p className="text-xs text-[#6B7280] mb-1">Sponsor Licence</p>
                      <p className={`text-sm font-medium ${licenceFlagged ? 'text-[#EF4444]' : 'text-[#1F2937]'}`}>
                        {licenceFlagged && <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444] mr-1.5 align-middle" />}
                        {viewingJob.sponsorLicenceStatus}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${cosFlagged ? 'bg-[#FEE2E2] border border-[#EF4444]/30' : 'bg-white/60'}`}>
                      <p className="text-xs text-[#6B7280] mb-1">CoS Availability</p>
                      <p className={`text-sm font-medium ${cosFlagged ? 'text-[#EF4444]' : 'text-[#1F2937]'}`}>
                        {cosFlagged && <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444] mr-1.5 align-middle" />}
                        {viewingJob.cosAvailability}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${inspectionFlagged ? 'bg-[#FEE2E2] border border-[#EF4444]/30' : 'bg-white/60'}`}>
                      <p className="text-xs text-[#6B7280] mb-1">Home Office Inspection</p>
                      <p className={`text-sm font-medium ${inspectionFlagged ? 'text-[#EF4444]' : 'text-[#1F2937]'}`}>
                        {inspectionFlagged && <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444] mr-1.5 align-middle" />}
                        {viewingJob.homeOfficeInspection}
                      </p>
                    </div>
                  </div>
                  {viewingJob.inspectionOutcomeDetail && (
                    <div className="mt-3 bg-white/60 rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Inspection Outcome Detail</p>
                      <p className="text-sm text-[#1F2937] whitespace-pre-wrap">{viewingJob.inspectionOutcomeDetail}</p>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="flex gap-2 mt-6 pt-4 border-t border-[#E5E7EB]">
              <p className="text-xs text-[#9CA3AF] mr-auto">Change status:</p>
              {(["pending", "active", "closed", "expired"] as const).map(s => (
                <Button key={s} size="sm" variant={viewingJob.status === s ? "default" : "outline"}
                  className={viewingJob.status === s ? "text-white" : "border-[#E5E7EB] text-[#6B7280]"}
                  style={viewingJob.status === s ? { backgroundColor: statusColors[s] } : {}}
                  onClick={() => { updateJob.mutate({ id: viewingJob.id, status: s }); setViewingJob({ ...viewingJob, status: s }); }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Jobs Management</h1>
          <p className="text-[#6B7280] text-sm mt-1">{data?.total ?? 0} total jobs</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm" className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button onClick={exportCSV} size="sm" className="bg-[#00C3FF] hover:bg-[#00B0E6] text-white">
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total", value: statsData.total, color: "#0EA5E9", bg: "#F0F9FF" },
            { label: "Pending Review", value: statsData.pending, color: "#F59E0B", bg: "#FFFBEB" },
            { label: "Active", value: statsData.active, color: "#10B981", bg: "#ECFDF5" },
            { label: "Expired/Closed", value: (statsData.expired ?? 0) + (statsData.closed ?? 0), color: "#EF4444", bg: "#FEF2F2" },
            { label: "Featured", value: statsData.featured, color: "#8B5CF6", bg: "#F5F3FF" },
          ].map(s => (
            <Card key={s.label} className="border border-[#E5E7EB] shadow-sm" style={{ backgroundColor: s.bg }}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#6B7280] mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input placeholder="Search title, company..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 bg-white border-[#E5E7EB] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#00C3FF]" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937]">
          <option value="">All Statuses</option>
          {["draft", "pending", "active", "expired", "closed"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={tierFilter} onChange={e => { setTierFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 rounded-md border border-[#E5E7EB] bg-white text-sm text-[#1F2937]">
          <option value="">All Tiers</option>
          {["free", "sponsored", "premium", "managed"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Jobs Table */}
      <Card className="bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left p-3 text-[#6B7280] font-medium">Job</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Location</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Sector</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Tier</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Status</th>
                <th className="text-center p-3 text-[#6B7280] font-medium">Compliance</th>
                <th className="text-center p-3 text-[#6B7280] font-medium">Views</th>
                <th className="text-center p-3 text-[#6B7280] font-medium">Apps</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Posted</th>
                <th className="text-right p-3 text-[#6B7280] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={10} className="p-8 text-center text-[#9CA3AF]">Loading...</td></tr>
              ) : !data?.items?.length ? (
                <tr><td colSpan={10} className="p-8 text-center text-[#9CA3AF]">No jobs found</td></tr>
              ) : data.items.map((job: any) => (
                <tr key={job.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] cursor-pointer" onClick={() => setViewingJob(job)}>
                  <td className="p-3">
                    <div className="font-medium text-[#1F2937]">{job.title}</div>
                    <div className="text-xs text-[#9CA3AF]">{job.company}</div>
                  </td>
                  <td className="p-3 text-[#6B7280]">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</div>
                  </td>
                  <td className="p-3 text-[#6B7280]">{job.sector}</td>
                  <td className="p-3">
                    <Badge className="text-white text-xs" style={{ backgroundColor: tierColors[job.tier] || "#6B7280" }}>{job.tier}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className="text-white text-xs" style={{ backgroundColor: statusColors[job.status] || "#6B7280" }}>{job.status}</Badge>
                  </td>
                  <td className="p-3 text-center">
                    {(() => {
                      const fv = ["Yes \u2014 but currently suspended", "No \u2014 I don't have one yet", "No \u2014 I need to request more", "Yes \u2014 licence downgraded", "Yes \u2014 licence revoked (now reinstated)"];
                      const flagged = fv.some(v => v === job.sponsorLicenceStatus || v === job.cosAvailability || v === job.homeOfficeInspection);
                      if (!job.sponsorLicenceStatus && !job.cosAvailability && !job.homeOfficeInspection) return <span className="text-[#9CA3AF] text-xs">—</span>;
                      if (flagged) return <Badge className="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.5">\u26a0 Flagged</Badge>;
                      return <Badge className="bg-[#10B981] text-white text-[10px] px-1.5 py-0.5">\u2713 OK</Badge>;
                    })()}
                  </td>
                  <td className="p-3 text-center text-[#6B7280]">{job.viewCount}</td>
                  <td className="p-3 text-center text-[#6B7280]">{job.applicationCount}</td>
                  <td className="p-3 text-[#9CA3AF] text-xs">{new Date(job.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      {job.status === "pending" && (
                        <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-white h-7 px-2 text-xs"
                          onClick={() => updateJob.mutate({ id: job.id, status: "active" })}>
                          <Check className="w-3 h-3 mr-1" /> Approve
                        </Button>
                      )}
                      {job.status === "active" && (
                        <Button size="sm" variant="outline" className="border-[#F59E0B] text-[#F59E0B] h-7 px-2 text-xs"
                          onClick={() => updateJob.mutate({ id: job.id, status: "closed" })}>
                          Close
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-[#E5E7EB] text-[#6B7280] h-7 px-2 text-xs"
                        onClick={() => updateJob.mutate({ id: job.id, isFeatured: !job.isFeatured })}>
                        {job.isFeatured ? "★" : "☆"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#EF4444] text-[#EF4444] h-7 px-2 text-xs"
                        onClick={() => { if (confirm("Delete this job?")) deleteJob.mutate({ id: job.id }); }}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#9CA3AF]">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="border-[#E5E7EB] text-[#6B7280]">Previous</Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="border-[#E5E7EB] text-[#6B7280]">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Chatbot Conversations Panel ───
function ChatbotConversationsPanel() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: conversations, isLoading, refetch } = trpc.chatbot.listConversations.useQuery({ limit: 100 });
  const { data: detail, isLoading: detailLoading } = trpc.chatbot.getConversation.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );
  const updateStatus = trpc.chatbot.updateConversationStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Status updated"); },
  });

  const statusColors: Record<string, string> = {
    active: "#10B981", closed: "#6B7280", flagged: "#EF4444",
  };

  if (selectedId && detail) {
    const conv = detail.conversation;
    const msgs = detail.messages || [];
    return (
      <div>
        <Button variant="outline" size="sm" onClick={() => setSelectedId(null)} className="mb-4 border-[#E5E7EB] text-[#6B7280]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Conversations
        </Button>
        <Card className="bg-white border border-[#E5E7EB] shadow-sm">
          <CardHeader className="pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-[#1F2937]">
                  Conversation #{conv?.id}
                </CardTitle>
                <p className="text-sm text-[#6B7280] mt-1">
                  {conv?.visitorName || "Anonymous"} {conv?.visitorEmail ? `(${conv.visitorEmail})` : ""} — Started {conv?.createdAt ? new Date(conv.createdAt).toLocaleString("en-GB") : ""}
                </p>
                {conv?.intentTags && (
                  <div className="flex gap-1 mt-2">
                    {String(conv.intentTags).split(",").map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs border-[#E5E7EB] text-[#6B7280]">{tag.trim()}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {(["active", "closed", "flagged"] as const).map(s => (
                  <Button key={s} size="sm" variant={conv?.status === s ? "default" : "outline"}
                    className={conv?.status === s ? "text-white" : "border-[#E5E7EB] text-[#6B7280]"}
                    style={conv?.status === s ? { backgroundColor: statusColors[s] } : {}}
                    onClick={() => updateStatus.mutate({ id: selectedId, status: s })}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
              {msgs.length === 0 ? (
                <p className="text-[#9CA3AF] text-center py-8">No messages in this conversation</p>
              ) : msgs.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#0EA5E9] text-white rounded-br-sm"
                      : msg.role === "assistant"
                      ? "bg-[#F3F4F6] text-[#1F2937] rounded-bl-sm"
                      : "bg-[#FEF3C7] text-[#92400E] rounded-bl-sm"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium opacity-75">
                        {msg.role === "user" ? (conv?.visitorName || "Visitor") : msg.role === "assistant" ? "IANS" : "System"}
                      </span>
                      <span className="text-xs opacity-50">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Chatbot Conversations</h1>
          <p className="text-[#6B7280] text-sm mt-1">{conversations?.conversations?.length ?? 0} conversations</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      {conversations?.conversations && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Active", value: conversations.conversations.filter((c: any) => c.status === "active").length, color: "#10B981", bg: "#ECFDF5" },
            { label: "Closed", value: conversations.conversations.filter((c: any) => c.status === "closed").length, color: "#6B7280", bg: "#F9FAFB" },
            { label: "Flagged", value: conversations.conversations.filter((c: any) => c.status === "flagged").length, color: "#EF4444", bg: "#FEF2F2" },
          ].map(s => (
            <Card key={s.label} className="border border-[#E5E7EB] shadow-sm" style={{ backgroundColor: s.bg }}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#6B7280] mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Conversations List */}
      <Card className="bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left p-3 text-[#6B7280] font-medium">ID</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Visitor</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Intent Tags</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Status</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Messages</th>
                <th className="text-left p-3 text-[#6B7280] font-medium">Started</th>
                <th className="text-right p-3 text-[#6B7280] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-[#9CA3AF]">Loading...</td></tr>
              ) : !conversations?.conversations?.length ? (
                <tr><td colSpan={7} className="p-8 text-center text-[#9CA3AF]">No conversations yet</td></tr>
              ) : conversations.conversations.map((conv: any) => (
                <tr key={conv.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] cursor-pointer" onClick={() => setSelectedId(conv.id)}>
                  <td className="p-3 text-[#6B7280]">#{conv.id}</td>
                  <td className="p-3">
                    <div className="font-medium text-[#1F2937]">{conv.visitorName || "Anonymous"}</div>
                    <div className="text-xs text-[#9CA3AF]">{conv.visitorEmail || "No email"}</div>
                  </td>
                  <td className="p-3">
                    {conv.intentTags ? String(conv.intentTags).split(",").slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs mr-1 border-[#E5E7EB] text-[#6B7280]">{tag.trim()}</Badge>
                    )) : <span className="text-[#9CA3AF] text-xs">—</span>}
                  </td>
                  <td className="p-3">
                    <Badge className="text-white text-xs" style={{ backgroundColor: statusColors[conv.status] || "#6B7280" }}>{conv.status}</Badge>
                  </td>
                  <td className="p-3 text-[#6B7280]">{conv.messageCount ?? "—"}</td>
                  <td className="p-3 text-[#9CA3AF] text-xs">{new Date(conv.createdAt).toLocaleString("en-GB")}</td>
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" className="border-[#E5E7EB] text-[#6B7280] h-7 px-2 text-xs"
                        onClick={() => setSelectedId(conv.id)}>
                        <MessageSquare className="w-3 h-3 mr-1" /> View
                      </Button>
                      {conv.status !== "flagged" && (
                        <Button size="sm" variant="outline" className="border-[#EF4444] text-[#EF4444] h-7 px-2 text-xs"
                          onClick={() => updateStatus.mutate({ id: conv.id, status: "flagged" })}>
                          <AlertCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Team Management Panel ───
function TeamManagementPanel() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "user">("admin");

  const { data: members, isLoading: membersLoading, refetch: refetchMembers } = trpc.team.members.useQuery();
  const { data: invitations, isLoading: invitationsLoading, refetch: refetchInvitations } = trpc.team.invitations.useQuery();

  const inviteMutation = trpc.team.invite.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      setShowInviteForm(false);
      setInviteEmail("");
      setInviteName("");
      refetchInvitations();
    },
    onError: (err) => toast.error(err.message),
  });

  const revokeMutation = trpc.team.revokeInvitation.useMutation({
    onSuccess: () => { toast.success("Invitation revoked"); refetchInvitations(); },
  });

  const removeMutation = trpc.team.removeMember.useMutation({
    onSuccess: () => { toast.success("Member removed from team"); refetchMembers(); },
    onError: (err) => toast.error(err.message),
  });

  const handleInvite = () => {
    if (!inviteEmail) return;
    inviteMutation.mutate({ email: inviteEmail, name: inviteName || undefined, role: inviteRole });
  };

  const statusColors: Record<string, string> = {
    pending: "#F59E0B", accepted: "#10B981", expired: "#6B7280", revoked: "#EF4444",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Team Management</h1>
          <p className="text-[#6B7280] text-sm mt-1">Manage admin team members and invitations</p>
        </div>
        <Button onClick={() => setShowInviteForm(!showInviteForm)} className="bg-[#00C3FF] hover:bg-[#00B0E6] text-white">
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <Card className="bg-white border border-[#E5E7EB] shadow-sm mb-6">
          <CardHeader className="pb-3 border-b border-[#E5E7EB]">
            <CardTitle className="text-base text-[#1F2937]">Send Invitation</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-[#374151] mb-1 block">Email *</label>
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="border-[#E5E7EB] text-[#1F2937]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] mb-1 block">Name (optional)</label>
                <Input
                  placeholder="John Smith"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="border-[#E5E7EB] text-[#1F2937]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] mb-1 block">Role</label>
                <div className="flex gap-2">
                  <Button size="sm" variant={inviteRole === "admin" ? "default" : "outline"}
                    className={inviteRole === "admin" ? "bg-[#00C3FF] text-white" : "border-[#E5E7EB] text-[#6B7280]"}
                    onClick={() => setInviteRole("admin")}>
                    <Shield className="w-3 h-3 mr-1" /> Admin
                  </Button>
                  <Button size="sm" variant={inviteRole === "user" ? "default" : "outline"}
                    className={inviteRole === "user" ? "bg-[#10B981] text-white" : "border-[#E5E7EB] text-[#6B7280]"}
                    onClick={() => setInviteRole("user")}>
                    <Users className="w-3 h-3 mr-1" /> User
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleInvite} disabled={!inviteEmail || inviteMutation.isPending}
                className="bg-[#00C3FF] hover:bg-[#00B0E6] text-white">
                {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)} className="border-[#E5E7EB] text-[#6B7280]">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Team Members */}
      <Card className="bg-white border border-[#E5E7EB] shadow-sm mb-6">
        <CardHeader className="pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[#1F2937]">
              <Shield className="w-4 h-4 inline mr-2 text-[#00C3FF]" />
              Team Members ({members?.length ?? 0})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetchMembers()} className="border-[#E5E7EB] text-[#6B7280] h-7">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {membersLoading ? (
            <div className="p-8 text-center text-[#9CA3AF]">Loading...</div>
          ) : !members?.length ? (
            <div className="p-8 text-center text-[#9CA3AF]">No team members found</div>
          ) : (
            <div className="divide-y divide-[#F3F4F6]">
              {members.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-4 hover:bg-[#F9FAFB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00C3FF]/10 flex items-center justify-center text-[#00C3FF] font-bold text-sm">
                      {(member.name?.[0] || member.email?.[0] || "?").toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-[#1F2937]">{member.name || "Unnamed"}</div>
                      <div className="text-xs text-[#9CA3AF]">{member.email || "No email"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="text-white text-xs bg-[#00C3FF]">Admin</Badge>
                    <span className="text-xs text-[#9CA3AF]">Joined {new Date(member.createdAt).toLocaleDateString("en-GB")}</span>
                    <Button size="sm" variant="outline" className="border-[#EF4444] text-[#EF4444] h-7 px-2 text-xs"
                      onClick={() => { if (confirm(`Remove ${member.name || member.email} from the team?`)) removeMutation.mutate({ userId: member.id }); }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invitations */}
      <Card className="bg-white border border-[#E5E7EB] shadow-sm">
        <CardHeader className="pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[#1F2937]">
              <Send className="w-4 h-4 inline mr-2 text-[#F59E0B]" />
              Invitations ({invitations?.length ?? 0})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetchInvitations()} className="border-[#E5E7EB] text-[#6B7280] h-7">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {invitationsLoading ? (
            <div className="p-8 text-center text-[#9CA3AF]">Loading...</div>
          ) : !invitations?.length ? (
            <div className="p-8 text-center text-[#9CA3AF]">No invitations sent yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left p-3 text-[#6B7280] font-medium">Email</th>
                    <th className="text-left p-3 text-[#6B7280] font-medium">Name</th>
                    <th className="text-left p-3 text-[#6B7280] font-medium">Role</th>
                    <th className="text-left p-3 text-[#6B7280] font-medium">Status</th>
                    <th className="text-left p-3 text-[#6B7280] font-medium">Sent</th>
                    <th className="text-left p-3 text-[#6B7280] font-medium">Expires</th>
                    <th className="text-right p-3 text-[#6B7280] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv: any) => (
                    <tr key={inv.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                      <td className="p-3 text-[#1F2937]">{inv.email}</td>
                      <td className="p-3 text-[#6B7280]">{inv.name || "—"}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs border-[#E5E7EB] text-[#6B7280]">{inv.role}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="text-white text-xs" style={{ backgroundColor: statusColors[inv.status] || "#6B7280" }}>{inv.status}</Badge>
                      </td>
                      <td className="p-3 text-[#9CA3AF] text-xs">{new Date(inv.createdAt).toLocaleDateString("en-GB")}</td>
                      <td className="p-3 text-[#9CA3AF] text-xs">{new Date(inv.expiresAt).toLocaleDateString("en-GB")}</td>
                      <td className="p-3 text-right">
                        {inv.status === "pending" && (
                          <Button size="sm" variant="outline" className="border-[#EF4444] text-[#EF4444] h-7 px-2 text-xs"
                            onClick={() => revokeMutation.mutate({ id: inv.id })}>
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Lead Scoring Panel ───
function LeadScoringPanel() {
  const [classification, setClassification] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 25;

  const statsQ = trpc.visitorScoring.stats.useQuery();
  const leadsQ = trpc.visitorScoring.leads.useQuery({
    classification: classification || undefined,
    search: search || undefined,
    limit,
    offset: page * limit,
  });
  const eventsQ = trpc.visitorScoring.recentEvents.useQuery({ limit: 30 });

  const stats = statsQ.data ?? { total: 0, hot: 0, warm: 0, cold: 0 };
  const leads = leadsQ.data?.leads ?? [];
  const totalLeads = leadsQ.data?.total ?? 0;
  const events = eventsQ.data ?? [];

  const classificationBadge = (c: string) => {
    const colors: Record<string, string> = {
      hot: "bg-red-100 text-red-700 border-red-200",
      warm: "bg-amber-100 text-amber-700 border-amber-200",
      cold: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return (
      <Badge variant="outline" className={`text-xs font-semibold uppercase ${colors[c] || "bg-gray-100 text-gray-600"}`}>
        {c === "hot" ? "🔥 Hot" : c === "warm" ? "🌡️ Warm" : "❄️ Cold"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Lead Scoring</h2>
          <p className="text-[#6B7280] text-sm mt-1">Visitor behaviour tracking and lead classification</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => { statsQ.refetch(); leadsQ.refetch(); eventsQ.refetch(); }}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Score Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setClassification(""); setPage(0); }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-[#1F2937] mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#6B7280]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setClassification("hot"); setPage(0); }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-500 uppercase tracking-wide font-medium">Hot Leads</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.hot}</p>
                <p className="text-xs text-[#6B7280] mt-1">Score 50+</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                🔥
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setClassification("warm"); setPage(0); }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-500 uppercase tracking-wide font-medium">Warm Leads</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.warm}</p>
                <p className="text-xs text-[#6B7280] mt-1">Score 20-49</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
                🌡️
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setClassification("cold"); setPage(0); }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wide font-medium">Cold Leads</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.cold}</p>
                <p className="text-xs text-[#6B7280] mt-1">Score 0-19</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                ❄️
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scoring Rules Reference */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#1F2937]">Scoring Rules</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            {[
              { event: "Page View", pts: 1 },
              { event: "CTA Click", pts: 3 },
              { event: "Chatbot Open", pts: 3 },
              { event: "Form Start", pts: 5 },
              { event: "Chatbot Message", pts: 5 },
              { event: "Video Play", pts: 5 },
              { event: "Pricing View", pts: 8 },
              { event: "Download", pts: 10 },
              { event: "Newsletter", pts: 10 },
              { event: "Form Submit", pts: 15 },
              { event: "Emergency Select", pts: 20 },
              { event: "Webinar Register", pts: 20 },
              { event: "Consultation Book", pts: 25 },
            ].map(r => (
              <div key={r.event} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1.5">
                <span className="text-[#6B7280]">{r.event}</span>
                <span className="font-bold text-[#1F2937]">+{r.pts}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#1F2937]">
              {classification ? `${classification.charAt(0).toUpperCase() + classification.slice(1)} Leads` : "All Leads"} ({totalLeads})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                <Input
                  placeholder="Search by email..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(0); }}
                  className="pl-8 h-8 text-sm w-56 bg-white border-gray-200"
                />
              </div>
              {classification && (
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setClassification("")}>
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {leadsQ.isLoading ? (
            <div className="p-8 text-center text-[#6B7280]">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <ShieldCheck className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-[#6B7280] text-sm">No leads tracked yet. Visitor behaviour data will appear here as prospects interact with the site.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-100">
                      <th className="text-left p-3 font-medium text-[#6B7280]">Email</th>
                      <th className="text-center p-3 font-medium text-[#6B7280]">Score</th>
                      <th className="text-center p-3 font-medium text-[#6B7280]">Class</th>
                      <th className="text-center p-3 font-medium text-[#6B7280]">Pages</th>
                      <th className="text-center p-3 font-medium text-[#6B7280]">Forms</th>
                      <th className="text-center p-3 font-medium text-[#6B7280]">Chat</th>
                      <th className="text-center p-3 font-medium text-[#6B7280]">Downloads</th>
                      <th className="text-left p-3 font-medium text-[#6B7280]">First Seen</th>
                      <th className="text-left p-3 font-medium text-[#6B7280]">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead: any) => (
                      <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-medium text-[#1F2937]">{lead.email}</td>
                        <td className="p-3 text-center">
                          <span className="font-bold text-lg text-[#1F2937]">{lead.totalScore}</span>
                        </td>
                        <td className="p-3 text-center">{classificationBadge(lead.classification)}</td>
                        <td className="p-3 text-center text-[#6B7280]">{lead.pageViewCount}</td>
                        <td className="p-3 text-center text-[#6B7280]">{lead.formSubmitCount}</td>
                        <td className="p-3 text-center text-[#6B7280]">{lead.chatbotMessageCount}</td>
                        <td className="p-3 text-center text-[#6B7280]">{lead.downloadCount}</td>
                        <td className="p-3 text-[#6B7280] text-xs">{lead.firstSeenAt ? new Date(lead.firstSeenAt).toLocaleDateString() : "—"}</td>
                        <td className="p-3 text-[#6B7280] text-xs">{lead.lastEventAt ? new Date(lead.lastEventAt).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalLeads > limit && (
                <div className="flex items-center justify-between p-3 border-t border-gray-100">
                  <p className="text-xs text-[#6B7280]">
                    Showing {page * limit + 1}–{Math.min((page + 1) * limit, totalLeads)} of {totalLeads}
                  </p>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                      Previous
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" disabled={(page + 1) * limit >= totalLeads} onClick={() => setPage(p => p + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Events Feed */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#1F2937]">Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280] text-sm">No events recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="text-left p-3 font-medium text-[#6B7280]">Time</th>
                    <th className="text-left p-3 font-medium text-[#6B7280]">Session</th>
                    <th className="text-left p-3 font-medium text-[#6B7280]">Email</th>
                    <th className="text-left p-3 font-medium text-[#6B7280]">Event</th>
                    <th className="text-left p-3 font-medium text-[#6B7280]">Value</th>
                    <th className="text-center p-3 font-medium text-[#6B7280]">Points</th>
                    <th className="text-left p-3 font-medium text-[#6B7280]">Page</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev: any) => (
                    <tr key={ev.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 text-[#6B7280] text-xs whitespace-nowrap">{ev.createdAt ? new Date(ev.createdAt).toLocaleString() : "—"}</td>
                      <td className="p-3 text-[#6B7280] text-xs font-mono">{ev.sessionId?.slice(0, 12)}...</td>
                      <td className="p-3 text-[#1F2937] text-xs">{ev.email || "—"}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">{ev.eventType}</Badge>
                      </td>
                      <td className="p-3 text-[#6B7280] text-xs max-w-[200px] truncate">{ev.eventValue || "—"}</td>
                      <td className="p-3 text-center font-bold text-[#1F2937]">+{ev.points}</td>
                      <td className="p-3 text-[#6B7280] text-xs max-w-[150px] truncate">{ev.pageUrl || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Bookings Management Panel ─── */
function BookingsPanel() {
  const { data: appointments, isLoading, refetch } = trpc.booking.list.useQuery();
  const { data: consultationTypes } = trpc.booking.getConsultationTypes.useQuery();
  const updateStatusMutation = trpc.booking.updateStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Appointment updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const items = appointments?.items || [];
  const filtered = items.filter((a: any) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        a.firstName?.toLowerCase().includes(q) ||
        a.lastName?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusCounts = items.reduce((acc: Record<string, number>, a: any) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    no_show: "bg-gray-100 text-gray-800",
    rescheduled: "bg-purple-100 text-purple-800",
  };

  const formatDate = (d: string) => {
    try { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
    catch { return d; }
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Bookings</h1>
          <p className="text-[#6B7280] text-sm mt-1">Manage consultation appointments</p>
        </div>
        <Link href="/book-consultation" className="inline-flex items-center gap-2 bg-[#00C3FF] hover:bg-[#00B0E6] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
          <ExternalLink className="w-4 h-4" /> View Booking Page
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-[#6B7280] font-medium">Total Bookings</p>
            <p className="text-2xl font-bold text-[#1F2937] mt-1">{items.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-[#6B7280] font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.pending || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-[#6B7280] font-medium">Confirmed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.confirmed || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-[#6B7280] font-medium">Completed</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{statusCounts.completed || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-[#F9FAFB] border-[#E5E7EB] text-sm"
              />
            </div>
            <div className="flex gap-1">
              {["all", "pending", "confirmed", "completed", "cancelled"].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s ? "bg-[#00C3FF] text-white" : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  {s !== "all" && statusCounts[s] ? ` (${statusCounts[s]})` : ""}
                </button>
              ))}
            </div>
            <button onClick={() => refetch()} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-[#00C3FF] border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-[#6B7280]">No appointments found</p>
              <p className="text-[#9CA3AF] text-sm mt-1">Bookings will appear here when prospects schedule consultations.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Date & Time</th>
                    <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Contact</th>
                    <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appt: any) => {
                    const ct = consultationTypes?.find((c: any) => c.id === appt.consultationTypeId);
                    return (
                      <tr key={appt.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1F2937]">{formatDate(appt.date)}</p>
                          <p className="text-[#9CA3AF] text-xs">{formatTime(appt.startTime)} – {formatTime(appt.endTime)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1F2937]">{appt.firstName} {appt.lastName}</p>
                          <p className="text-[#9CA3AF] text-xs">{appt.email}</p>
                          {appt.company && <p className="text-[#9CA3AF] text-xs">{appt.company}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ct?.color || "#00C3FF" }} />
                            <span className="text-[#4B5563] text-xs">{ct?.name || "Consultation"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[appt.status] || "bg-gray-100 text-gray-800"}`}>
                            {appt.status}
                          </span>
                          {appt.urgencyType === "home_office_email" && (
                            <span className="ml-1 inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">URGENT</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {appt.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateStatusMutation.mutate({ id: appt.id, status: "confirmed" })}
                                  className="p-1.5 hover:bg-green-50 rounded text-green-600 transition-colors"
                                  title="Confirm"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateStatusMutation.mutate({ id: appt.id, status: "cancelled" })}
                                  className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {appt.status === "confirmed" && (
                              <>
                                <button
                                  onClick={() => updateStatusMutation.mutate({ id: appt.id, status: "completed" })}
                                  className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                                  title="Mark Completed"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateStatusMutation.mutate({ id: appt.id, status: "no_show" })}
                                  className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                                  title="No Show"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {appt.notes && (
                              <button
                                onClick={() => toast.info(appt.notes)}
                                className="p-1.5 hover:bg-[#F3F4F6] rounded text-[#9CA3AF] transition-colors"
                                title="View Notes"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
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
        </CardContent>
      </Card>

      {/* Consultation Types Reference */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#1F2937]">Consultation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {consultationTypes?.map((ct: any) => (
              <div key={ct.id} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ct.color || "#00C3FF" }} />
                <div>
                  <p className="text-xs font-medium text-[#1F2937]">{ct.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{ct.durationMinutes} min</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
