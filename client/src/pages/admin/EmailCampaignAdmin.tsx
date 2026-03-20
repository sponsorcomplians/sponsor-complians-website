import { useAuth } from "@/_core/hooks/useAuth";
import { SignInButton } from "@clerk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowLeft, BarChart3, Send, FileText, Users, Zap, Wand2,
  Settings, LayoutGrid, Mail, ListChecks, Upload, UserSearch,
  Building2, TrendingUp,
} from "lucide-react";

// Import email campaign sub-pages
import CampaignDashboard from "./CampaignDashboard";
import CampaignBuilder from "./CampaignBuilder";
import TemplatesLibrary from "./TemplatesLibrary";
import ContactLists from "./ContactLists";
import AllContacts from "./AllContacts";
import ImportContacts from "./ImportContacts";
import Automations from "./Automations";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AIDailyEmail from "./AIDailyEmail";
import EmailSettings from "./EmailSettings";
import ContactProfile from "./ContactProfile";
import CompaniesPage from "./CompaniesPage";
import Pipeline from "./Pipeline";

type EmailPage =
  | "dashboard"
  | "campaigns"
  | "templates"
  | "lists"
  | "contacts"
  | "import"
  | "companies"
  | "pipeline"
  | "automations"
  | "analytics"
  | "ai-daily"
  | "settings"
  | string; // allows dynamic pages like "contact-123" or "company:Name"

export default function EmailCampaignAdmin() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<EmailPage>("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#0d9488] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Admin Access Required</h1>
          <p className="text-[#6B7280] mb-6">Sign in with your admin account to access the email campaign system.</p>
          <SignInButton mode="modal">
            <Button className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white font-medium">
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
          <Link href="/" className="text-[#0d9488] hover:underline font-medium">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  const navSections = [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutGrid, color: "#0d9488" },
        { id: "analytics", label: "Analytics", icon: BarChart3, color: "#3b82f6" },
      ],
    },
    {
      label: "Campaigns",
      items: [
        { id: "campaigns", label: "All Campaigns", icon: Send, color: "#f59e0b" },
        { id: "templates", label: "Templates", icon: FileText, color: "#8b5cf6" },
        { id: "ai-daily", label: "AI Daily Email", icon: Wand2, color: "#ec4899" },
      ],
    },
    {
      label: "Audience",
      items: [
        { id: "contacts", label: "Contacts", icon: UserSearch, color: "#0d9488" },
        { id: "lists", label: "Lists", icon: Users, color: "#22c55e" },
        { id: "companies", label: "Companies", icon: Building2, color: "#6366f1" },
        { id: "import", label: "Import Contacts", icon: Upload, color: "#6366f1" },
      ],
    },
    {
      label: "Sales",
      items: [
        { id: "pipeline", label: "Pipeline", icon: TrendingUp, color: "#f59e0b" },
      ],
    },
    {
      label: "Automation",
      items: [
        { id: "automations", label: "Automations", icon: Zap, color: "#f97316" },
      ],
    },
    {
      label: "Configuration",
      items: [
        { id: "settings", label: "Settings", icon: Settings, color: "#6b7280" },
      ],
    },
  ];

  const handleNavigate = (page: string) => {
    // Handle "contact:123" format from various pages
    if (page.startsWith("contact:")) {
      const contactId = page.replace("contact:", "");
      setActivePage(`contact-${contactId}`);
      return;
    }
    // Handle "company:CompanyName" format from contact profile
    if (page.startsWith("company:")) {
      const companyName = decodeURIComponent(page.replace("company:", ""));
      setActivePage(`company-name:${companyName}`);
      return;
    }
    // Handle "list:123" format from contact lists
    if (page.startsWith("list:")) {
      const listId = page.replace("list:", "");
      setActivePage(`list-detail-${listId}`);
      return;
    }
    setActivePage(page);
  };

  // Determine active nav item (for highlighting)
  const getActiveNavId = () => {
    if (activePage.startsWith("contact-")) return "contacts";
    if (activePage.startsWith("company-name:")) return "companies";
    if (activePage.startsWith("list-detail-")) return "lists";
    return activePage;
  };
  const activeNavId = getActiveNavId();

  // Parse dynamic pages
  const renderContent = () => {
    if (activePage === "dashboard") return <CampaignDashboard onNavigate={handleNavigate} />;
    if (activePage === "campaigns") return <CampaignBuilder onNavigate={handleNavigate} />;
    if (activePage === "templates") return <TemplatesLibrary onNavigate={handleNavigate} />;
    if (activePage === "lists") return <ContactLists onNavigate={handleNavigate} />;
    if (activePage === "contacts") return <AllContacts onNavigate={handleNavigate} />;
    if (activePage === "import") return <ImportContacts onNavigate={handleNavigate} />;
    if (activePage === "companies") return <CompaniesPage onNavigate={handleNavigate} />;
    if (activePage === "pipeline") return <Pipeline onNavigate={handleNavigate} />;
    if (activePage === "automations") return <Automations onNavigate={handleNavigate} />;
    if (activePage === "analytics") return <AnalyticsDashboard onNavigate={handleNavigate} />;
    if (activePage === "ai-daily") return <AIDailyEmail onNavigate={handleNavigate} />;
    if (activePage === "settings") return <EmailSettings onNavigate={handleNavigate} />;

    // Dynamic pages
    if (activePage.startsWith("contact-")) {
      const contactId = parseInt(activePage.replace("contact-", ""), 10);
      if (!isNaN(contactId)) return <ContactProfile contactId={contactId} onNavigate={handleNavigate} />;
    }
    if (activePage.startsWith("company-name:")) {
      const companyName = activePage.replace("company-name:", "");
      return <CompaniesPage onNavigate={handleNavigate} initialCompanyName={companyName} />;
    }
    if (activePage.startsWith("list-detail-")) {
      const listId = parseInt(activePage.replace("list-detail-", ""), 10);
      if (!isNaN(listId)) return <ContactLists onNavigate={handleNavigate} initialListId={listId} />;
    }

    return <CampaignDashboard onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#0B1929] border-r border-[#1B3A5C]/30 pt-6 sticky top-0 h-screen overflow-y-auto shrink-0">
          <div className="px-4 mb-6">
            <Link href="/admin" className="flex items-center gap-2 text-[#8B9EB7] hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email Campaigns</h2>
                <p className="text-[#8B9EB7] text-[10px]">Marketing Automation</p>
              </div>
            </div>
          </div>

          <nav className="px-2 space-y-4">
            {navSections.map(section => (
              <div key={section.label}>
                <div className="px-3 mb-1.5">
                  <span className="text-[10px] font-semibold text-[#4B6584] uppercase tracking-wider">{section.label}</span>
                </div>
                <div className="space-y-0.5">
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        activeNavId === item.id
                          ? "bg-white/10 text-white font-medium"
                          : "text-[#8B9EB7] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4" style={{ color: activeNavId === item.id ? item.color : undefined }} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User Info */}
          <div className="px-4 mt-8 pt-4 border-t border-[#1B3A5C]/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0d9488]/20 flex items-center justify-center text-[#0d9488] text-xs font-bold">
                {user.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{user.name || "Admin"}</div>
                <div className="text-[#8B9EB7] text-xs">{user.email}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 pt-6 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
