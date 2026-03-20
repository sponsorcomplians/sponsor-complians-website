import { useState } from "react";
import { allTestimonials, PASTEL_COLORS, type Testimonial } from "@/lib/testimonials";
import { Quote, Star } from "lucide-react";

const CATEGORIES = ["all", "support", "compliance", "training", "general"] as const;
type FilterCategory = (typeof CATEGORIES)[number];

interface TestimonialsGridProps {
  /** If provided, only show these testimonials. Otherwise show all. */
  testimonials?: Testimonial[];
  /** Show category filter tabs. Default true. */
  showFilter?: boolean;
  /** Unused — kept for API compat */
  initialCount?: number;
  /** Section title override */
  title?: string;
  /** Section subtitle override */
  subtitle?: string;
}

/* ─── Carousel Row — infinite CSS scroll ─── */
function CarouselRow({
  items,
  direction = "left",
  speed = 50,
}: {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: number;
}) {
  /* Duplicate items 3× so the track always has enough content for seamless loop */
  const tripled = [...items, ...items, ...items];

  return (
    <div
      className="group relative overflow-hidden"
    >
      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 z-10"
        style={{ background: "linear-gradient(to right, #0D1B2A, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 z-10"
        style={{ background: "linear-gradient(to left, #0D1B2A, transparent)" }}
      />

      <div
        className="flex gap-5 group-hover:[animation-play-state:paused]"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {tripled.map((t, i) => (
          <div key={`${t.name}-${i}`} className="flex-shrink-0 w-[340px] md:w-[380px]">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function TestimonialsGrid({
  testimonials: propTestimonials,
  showFilter = true,
  title = "What Our Clients Say",
  subtitle = "Real feedback from UK sponsor licence holders we've supported",
}: TestimonialsGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const source = propTestimonials || allTestimonials;
  const filtered =
    activeFilter === "all"
      ? source
      : source.filter((t) => t.category === activeFilter);

  /* Split into 2 rows */
  const mid = Math.ceil(filtered.length / 2);
  const row1 = filtered.slice(0, mid);
  const row2 = filtered.slice(mid);

  return (
    <section className="py-20 lg:py-28 overflow-hidden" style={{ background: "#0D1B2A" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-[#00C3FF] text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Client Success
          </span>
          <h2
            className="text-3xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {title}
          </h2>
          <p className="text-[#8B9EB7] text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Filter Tabs */}
        {showFilter && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat;
              const color =
                cat === "all" ? "#00C3FF" : PASTEL_COLORS[cat].badge;
              const count =
                cat === "all"
                  ? source.length
                  : source.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: isActive ? color : "transparent",
                    color: isActive ? "#fff" : "#8B9EB7",
                    border: `1.5px solid ${isActive ? color : "#1B3A5C"}`,
                  }}
                >
                  {cat === "all" ? "All" : PASTEL_COLORS[cat].label}{" "}
                  <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Carousel Rows — full-bleed (outside container for edge-to-edge scroll) */}
      <div className="space-y-5">
        <CarouselRow items={row1} direction="left" speed={120} />
        {row2.length > 0 && (
          <CarouselRow items={row2} direction="right" speed={130} />
        )}
      </div>

      <div className="container">
        {/* Trust Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-14">
          {[
            { num: "34", label: "Client Testimonials" },
            { num: "100%", label: "Audit Pass Rate" },
            { num: "500+", label: "UK Sponsors Supported" },
            { num: "4.9/5", label: "Client Rating" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-2xl lg:text-3xl font-extrabold text-[#00C3FF]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.num}
              </div>
              <div className="text-[#8B9EB7] text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

/* ─── Individual Card ─── */
function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  const colors = PASTEL_COLORS[t.category];

  return (
    <div
      className="rounded-2xl p-6 lg:p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg h-full"
      style={{
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
      }}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${colors.badge}18`,
            color: colors.badge,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: colors.badge }}
          />
          {colors.label}
        </span>
        {t.source === "Google Review" && (
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        )}
      </div>

      {/* Quote Icon */}
      <Quote
        className="w-7 h-7 mb-3 opacity-30"
        style={{ color: colors.accent }}
      />

      {/* Quote Text */}
      <p
        className="text-[15px] leading-relaxed mb-5 font-medium line-clamp-5"
        style={{ color: colors.accent }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: colors.badge }}
        >
          {t.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div
            className="font-bold text-sm truncate"
            style={{ color: colors.accent }}
          >
            {t.name}
          </div>
          <div className="text-xs opacity-70 truncate" style={{ color: colors.accent }}>
            {[t.role, t.company].filter(Boolean).join(" · ") || t.source}
          </div>
        </div>
      </div>
    </div>
  );
}
