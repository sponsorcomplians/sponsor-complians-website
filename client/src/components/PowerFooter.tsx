import { Link } from "wouter";
import { Mail, MapPin } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { Phone } from "lucide-react";
import { SignInButton } from "@clerk/react";
import { useAuth } from "@/_core/hooks/useAuth";

function AuthFooterLink() {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated && user?.role === "admin") {
    return (
      <Link href="/admin" className="text-[#5A7A9A] hover:text-[#8B9EB7] text-xs transition-colors">
        Admin
      </Link>
    );
  }
  if (!isAuthenticated) {
    return (
      <SignInButton mode="modal">
        <button className="text-[#5A7A9A] hover:text-[#8B9EB7] text-xs transition-colors">
          Log In
        </button>
      </SignInButton>
    );
  }
  return null;
}

export default function PowerFooter() {
  return (
    <footer className="bg-[#0F2035] border-t border-white/5">
      <div className="container py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 — Company */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <img src={IMAGES.logoLight} alt="Sponsor ComplIANS" className="h-8 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-extrabold text-base tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>SPONSOR</span>
                <span className="text-[#00C3FF] font-bold text-[10px] tracking-[0.2em]">COMPLIANS</span>
              </div>
            </Link>
            <p className="text-[#8B9EB7] text-sm leading-relaxed mb-6">
              UK sponsor licence compliance consultancy. Audits, recruitment, and HR solutions built on real audit data from 100+ UK sponsor licence holders.
            </p>
            <div className="flex items-center gap-3">
              {[
                { img: IMAGES.socialLinkedin, href: "https://linkedin.com/company/sponsorcomplians", alt: "LinkedIn" },
                { img: IMAGES.socialFacebook, href: "https://facebook.com/profile.php?id=61572202899701", alt: "Facebook" },
                { img: IMAGES.socialInstagram, href: "https://instagram.com/sponsorcomplians", alt: "Instagram" },
                { img: IMAGES.socialYoutube, href: "https://youtube.com/channel/UCWCUNlwdJzgHtkC-pzKWJbg", alt: "YouTube" },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#00C3FF]/20 flex items-center justify-center transition-colors">
                  <img src={social.img} alt={social.alt} className="w-4 h-4 opacity-70" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Solutions */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>Solutions</h4>
            <ul className="space-y-3">
              {[
                { label: "Sponsor Compliance Audit", href: "/sponsor-compliance-audit" },
                { label: "Skilled Worker Recruitment", href: "/skilled-worker-recruitment-solutions" },
                { label: "Sponsor-Ready HR Service", href: "/sponsor-hr-services" },
                { label: "Events & Training", href: "/events" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[#8B9EB7] hover:text-[#00C3FF] text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Blog", href: "/blog" },
                { label: "Newsletter", href: "/newsletter" },
                { label: "Careers", href: "/careers" },
                { label: "Contact Us", href: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[#8B9EB7] hover:text-[#00C3FF] text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:admin@sponsorcomplians.com" className="flex items-start gap-3 text-[#8B9EB7] hover:text-[#00C3FF] text-sm transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  admin@sponsorcomplians.com
                </a>
              </li>
              <li>
                <a href="tel:02036186968" className="flex items-start gap-3 text-[#8B9EB7] hover:text-[#00C3FF] text-sm transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  020 3618 6968
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-[#8B9EB7] text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  915 High Road, North Finchley,<br />London N12 8QJ
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#5A7A9A] text-xs">&copy; {new Date().getFullYear()} Sponsor ComplIANS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-[#5A7A9A] hover:text-[#8B9EB7] text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[#5A7A9A] hover:text-[#8B9EB7] text-xs transition-colors">Terms of Service</Link>
            <AuthFooterLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
