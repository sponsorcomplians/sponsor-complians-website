import { useEffect, useRef, useState } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  suffix?: string;
  note?: string;
  color?: "blue" | "navy" | "sky" | "red";
  variant?: "dark" | "light";
}

export default function KpiCard({ label, value, suffix = "", note, color = "blue", variant = "light" }: KpiCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const lightColorMap = {
    blue: { text: "text-sky", border: "border-sky/20", glow: "shadow-[0_0_30px_rgba(59,130,246,0.08)]" },
    navy: { text: "text-navy", border: "border-navy/20", glow: "shadow-[0_0_30px_rgba(11,29,58,0.08)]" },
    sky: { text: "text-sky-bright", border: "border-sky-bright/20", glow: "shadow-[0_0_30px_rgba(37,99,235,0.08)]" },
    red: { text: "text-red-500", border: "border-red-500/20", glow: "shadow-[0_0_30px_rgba(239,68,68,0.08)]" },
  };

  const darkColorMap = {
    blue: { text: "text-sky-light", border: "border-sky-light/20", glow: "shadow-[0_0_30px_rgba(96,165,250,0.1)]" },
    navy: { text: "text-white", border: "border-white/15", glow: "shadow-[0_0_30px_rgba(255,255,255,0.05)]" },
    sky: { text: "text-sky-pale", border: "border-sky-pale/20", glow: "shadow-[0_0_30px_rgba(147,197,253,0.1)]" },
    red: { text: "text-red-400", border: "border-red-400/20", glow: "shadow-[0_0_30px_rgba(239,68,68,0.1)]" },
  };

  const c = variant === "dark" ? darkColorMap[color] : lightColorMap[color];

  return (
    <div
      ref={ref}
      className={`p-6 rounded-2xl text-center ${c.border} ${c.glow} transition-all duration-700 ${
        variant === "dark" 
          ? "bg-white/5 border backdrop-blur-sm" 
          : "bg-white border shadow-sm"
      } ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <span className={`text-xs font-bold tracking-wider uppercase block mb-2 ${
        variant === "dark" ? "text-white/50" : "text-slate-muted"
      }`}>
        {label}
      </span>
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-3xl md:text-4xl font-extrabold ${c.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {value}
        </span>
        {suffix && <span className={`text-lg font-bold ${c.text}`}>{suffix}</span>}
      </div>
      {note && <span className={`text-xs mt-2 block ${variant === "dark" ? "text-white/40" : "text-slate-dim"}`}>{note}</span>}
    </div>
  );
}
