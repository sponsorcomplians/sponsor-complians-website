import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import TopNav from "./components/TopNav";
import Ticker from "./components/Ticker";
import PowerFooter from "./components/PowerFooter";
import Home from "./pages/Home";
import Audit from "./pages/Audit";
import Recruitment from "./pages/Recruitment";
import HRServices from "./pages/HRServices";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Newsletter from "./pages/Newsletter";
import HubSoftware from "./pages/HubSoftware";
import Podcast from "./pages/Podcast";
import ProviderWebsites from "./pages/ProviderWebsites";
import CaseStudyDivine from "./pages/CaseStudyDivine";
import AdminDashboard from "./pages/AdminDashboard";
import EmailCampaignAdmin from "./pages/admin/EmailCampaignAdmin";
import Downloads from "./pages/Downloads";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import Advertise from "./pages/Advertise";
import EventWebsiteLaunch from "./pages/EventWebsiteLaunch";
import EventWebinar25March from "./pages/EventWebinar25March";
import EventPodcastLaunch from "./pages/EventPodcastLaunch";
import EventHubLaunch from "./pages/EventHubLaunch";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HubDemo from "./pages/HubDemo";
import { Redirect } from "wouter";
import TermsOfService from "./pages/TermsOfService";
import BookConsultation from "./pages/BookConsultation";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { usePageTracking } from "./hooks/usePageTracking";
import { useVisitorTracking } from "./hooks/useVisitorTracking";
import CookieConsent from "./components/CookieConsent";
import ChatbotWidget from "./components/ChatbotWidget";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sponsor-compliance-audit" component={Audit} />
      <Route path="/skilled-worker-recruitment-solutions" component={Recruitment} />
      <Route path="/skilled-worker-recruitment" component={Recruitment} />
      <Route path="/sponsor-hr-services" component={HRServices} />
      <Route path="/sponsor-ready-hr-service" component={HRServices} />
      <Route path="/events" component={Events} />
      <Route path="/events/new-website-launch" component={EventWebsiteLaunch} />
      <Route path="/events/25-march-webinar" component={EventWebinar25March} />
      <Route path="/events/sponsorship-files-launch" component={EventPodcastLaunch} />
      <Route path="/events/hub-launch" component={EventHubLaunch} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/careers" component={Careers} />
      <Route path="/contact" component={Contact} />
      <Route path="/newsletter" component={Newsletter} />
      <Route path="/sponsor-complians-newsletter" component={Newsletter} />
      <Route path="/sponsor-complians-hub" component={HubSoftware} />
      <Route path="/the-sponsorship-files" component={Podcast} />
      <Route path="/provider-websites" component={ProviderWebsites} />
      <Route path="/hub-demo" component={HubDemo} />
      <Route path="/features/sw001">{() => <Redirect to="/hub-demo" />}</Route>
      <Route path="/case-studies/divine-health-services" component={CaseStudyDivine} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/email-campaigns" component={EmailCampaignAdmin} />
      <Route path="/downloads" component={Downloads} />
      <Route path="/signup" component={Signup} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/advertise" component={Advertise} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/book-consultation" component={BookConsultation} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    // Don't scroll to top if there's a hash (anchor link)
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location]);
  return null;
}

function AppLayout() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  usePageTracking();
  useVisitorTracking(); // Behaviour scoring: auto-tracks page views

  if (isAdmin) {
    return (
      <main className="flex-1">
        <ScrollToTop />
        <Router />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <div className="relative z-20">
          <TopNav />
        </div>
        <div className="relative z-10">
          <Ticker />
        </div>
      </div>
      <main className="flex-1 pt-[108px] transition-[padding] duration-300">
        <Router />
      </main>
      <PowerFooter />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppLayout />
          <CookieConsent />
          <ChatbotWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
