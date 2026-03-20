import { Link } from "wouter";

interface GDPRConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function GDPRConsent({ checked, onChange, className = "" }: GDPRConsentProps) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#00C3FF] focus:ring-[#00C3FF] cursor-pointer shrink-0"
      />
      <span className="text-xs text-[#8B9EB7] leading-relaxed">
        I consent to Sponsor ComplIANS processing my personal data in accordance with the{" "}
        <Link
          href="/privacy-policy"
          className="text-[#00C3FF] hover:underline"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          Privacy Policy
        </Link>
        . I understand I can withdraw consent at any time.
      </span>
    </label>
  );
}
