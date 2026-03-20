import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { IMAGES } from "@/lib/images";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Solutions",
    dropdown: [
      { label: "Sponsor Compliance Audit", href: "/sponsor-compliance-audit" },
      { label: "Skilled Worker Recruitment", href: "/skilled-worker-recruitment-solutions" },
      { label: "Sponsor-Ready HR Service", href: "/sponsor-hr-services" },
      { label: "Sponsor ComplIANS Hub", href: "/sponsor-complians-hub" },
      { label: "Sponsor Compliance Website Service", href: "/provider-websites" },
      { label: "Hub Interactive Demo", href: "/hub-demo" },
    ],
  },
  {
    label: "Resources",
    dropdown: [
      { label: "Events", href: "/events" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Blog", href: "/blog" },
      { label: "The Sponsorship Files", href: "/the-sponsorship-files" },
      { label: "Case Studies", href: "/case-studies/divine-health-services" },
    ],
  },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "/contact" },
];

export default function TopNav() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (item: NavItem) => {
    if (item.href) return location === item.href;
    if (item.dropdown) return item.dropdown.some((d) => location === d.href);
    return false;
  };

  return (
    <header
      className={`w-full transition-all duration-300 relative z-10 ${
        scrolled
          ? "bg-[#0D1B2A] shadow-lg"
          : "bg-[#0D1B2A]/80 backdrop-blur-md"
      }`}
    >
      <div className="container flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src={IMAGES.logoLight}
            alt="Sponsor ComplIANS"
            className="h-9 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-extrabold text-lg tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              SPONSOR
            </span>
            <span className="text-[#00C3FF] font-bold text-[11px] tracking-[0.2em]">
              COMPLIANS
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={`flex items-center gap-1 px-4 py-2 text-[14px] font-medium transition-colors rounded-md ${
                      isActive(item)
                        ? "text-[#00C3FF]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-[#0D1B2A] border border-white/10 rounded-xl py-2 shadow-2xl z-[60]">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            location === sub.href
                              ? "text-[#00C3FF] bg-white/5 font-medium"
                              : sub.href === "/hub-demo"
                                ? "text-[#00E5FF] hover:text-white hover:bg-[#00C3FF]/10 font-medium"
                                : "text-[#8B9EB7] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {sub.label}
                            {sub.href === "/hub-demo" && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30">
                                New
                              </span>
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={`px-4 py-2 text-[14px] font-medium transition-colors rounded-md ${
                    isActive(item)
                      ? "text-[#00C3FF]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:02036186968"
            className="flex items-center gap-2 text-[#8B9EB7] hover:text-white text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>020 3618 6968</span>
          </a>
          <Link href="/jobs" className="border border-[#00C9A7]/50 text-[#00C9A7] hover:bg-[#00C9A7]/10 text-[13px] font-semibold py-2.5 px-5 rounded-lg transition-all inline-block">
            Post a Free Vacancy
          </Link>
          <Link href="/book-consultation" className="btn-teal text-[13px] !py-2.5 !px-6 inline-block">
            Book Free Consultation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu — full screen overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-[#0D1B2A] z-40 overflow-y-auto">
          <div className="container py-6 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      className="flex items-center justify-between w-full px-3 py-3.5 text-base font-medium text-white/80"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-1 pb-2">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-3 py-2.5 text-sm ${
                              location === sub.href
                                ? "text-[#00C3FF] font-medium"
                                : "text-[#8B9EB7] hover:text-white"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`block px-3 py-3.5 text-base font-medium ${
                      isActive(item) ? "text-[#00C3FF]" : "text-white/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-4 mt-4">
              <a
                href="tel:02036186968"
                className="flex items-center gap-2 px-3 text-[#8B9EB7] text-sm"
              >
                <Phone className="w-4 h-4" />
                020 3618 6968
              </a>
              <Link href="/jobs" className="block px-3">
                <span className="block text-center text-sm border border-[#00C9A7]/50 text-[#00C9A7] font-semibold py-2.5 rounded-lg">
                  Post a Free Vacancy
                </span>
              </Link>
              <Link href="/book-consultation" className="block px-3">
                <span className="btn-teal block text-center text-sm">
                  Book Free Consultation
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
