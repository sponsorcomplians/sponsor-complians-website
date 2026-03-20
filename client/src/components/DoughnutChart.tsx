import { useEffect, useRef, useState } from "react";

interface DoughnutChartProps {
  percentage: number;
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
  labelColor?: string;
}

export default function DoughnutChart({
  percentage,
  label,
  sublabel,
  size = 160,
  strokeWidth = 14,
  color = "#00C3FF",
  bgColor = "rgba(255,255,255,0.08)",
  textColor = "#FFFFFF",
  labelColor = "rgba(255,255,255,0.6)",
}: DoughnutChartProps) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate from 0 to target
          let start = 0;
          const duration = 1200;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedPct(Math.round(eased * percentage));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedPct / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Animated foreground ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>
      {/* Center text overlay */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          className="font-extrabold leading-none"
          style={{ color: textColor, fontSize: size * 0.22, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {animatedPct}%
        </span>
      </div>
      <div className="text-center mt-1">
        <p className="font-bold text-sm" style={{ color: textColor }}>{label}</p>
        {sublabel && <p className="text-xs mt-0.5" style={{ color: labelColor }}>{sublabel}</p>}
      </div>
    </div>
  );
}

/* Wrapper that positions the doughnut with its center text */
export function DoughnutKPI(props: DoughnutChartProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      <DoughnutChart {...props} />
    </div>
  );
}
