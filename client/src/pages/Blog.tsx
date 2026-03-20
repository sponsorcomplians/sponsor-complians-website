/**
 * Blog.tsx — Compliance Insights Blog
 * Power Theme 3-col grid style with all 19 articles from blogData
 * Hub palette: #0D1B2A / #1B3A5C / #00C3FF
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, Tag, Search } from "lucide-react";
import { blogArticles, categoryColors } from "@/lib/blogData";
import BlogNewsletterSignup from "@/components/BlogNewsletterSignup";

/* ─── Scroll-reveal ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...Array.from(new Set(blogArticles.map(a => a.category)))];

  const filtered = blogArticles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="-mt-[108px]">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80"
            alt="Blog hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/80 to-[#0A1628]/30" />
        </div>

        <div className="container relative z-10 pb-16 pt-[200px]">
          <Reveal>
            <span className="inline-block text-[#00C3FF] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Compliance Insights
            </span>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.95] tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Blog
            </h1>
            <p className="mt-4 text-white/60 text-lg max-w-2xl">
              Expert analysis, case studies, and practical guides for UK sponsor licence holders.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ FILTERS ═══ */}
      <section className="bg-[#0A1628] py-8 border-b border-[#1B3A5C]/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-[#00C3FF] text-[#0D1B2A]"
                      : "bg-[#1B3A5C]/30 text-white/60 hover:bg-[#1B3A5C]/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0D1B2A] border border-[#1B3A5C]/40 text-white text-sm placeholder:text-white/30 focus:border-[#00C3FF]/50 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ARTICLE ═══ */}
      {featured && (
        <section className="bg-[#0A1628] py-12">
          <div className="container">
            <Reveal>
              <Link href={`/blog/${featured.slug}`} className="block group">
                <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[featured.category] || "bg-[#1B3A5C] text-white"}`}>
                        {featured.category}
                      </span>
                      <span className="text-white/60 text-sm flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {featured.readTime}
                      </span>
                      <span className="text-white/60 text-sm">{featured.date}</span>
                    </div>
                    <h2
                      className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] mb-4 max-w-3xl"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {featured.title}
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mb-6">{featured.excerpt}</p>
                    <span className="inline-flex items-center gap-2 text-[#00C3FF] font-bold text-sm group-hover:gap-3 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══ 3-COLUMN GRID ═══ */}
      <section className="bg-[#0A1628] pb-20">
        <div className="container">
          <Reveal>
            <div className="flex items-center justify-between mb-10">
              <h2
                className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {activeCategory === "All" ? "All Articles" : activeCategory} <span className="text-white/30 text-lg font-normal ml-2">({filtered.length})</span>
              </h2>
              <div className="h-px flex-1 ml-6 bg-gradient-to-r from-[#1B3A5C] to-transparent" />
            </div>
          </Reveal>

          {rest.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No articles found matching your criteria.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link href={`/blog/${post.slug}`} className="block h-full group">
                  <div className="h-full rounded-xl overflow-hidden bg-[#0D1B2A] border border-[#1B3A5C]/50 hover:border-[#00C3FF]/40 transition-all duration-300">
                    {/* Card image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] to-transparent opacity-60" />
                      <div className="absolute top-4 left-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || "bg-[#1B3A5C] text-white"}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3 text-white/40 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <h3
                        className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-[#00C3FF] transition-colors line-clamp-3"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {post.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 pt-4 border-t border-[#1B3A5C]/40">
                        <span className="text-[#00C3FF] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read Article <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER SIGNUP ═══ */}
      <section className="bg-[#0A1628] pb-8">
        <div className="container">
          <Reveal>
            <BlogNewsletterSignup variant="inline" />
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-[#0D1B2A] py-20">
        <div className="container">
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C3FF]/10 via-[#1B3A5C]/20 to-transparent" />
              <div className="absolute inset-0 border border-[#1B3A5C]/50 rounded-2xl" />
              <div className="relative z-10">
                <h2
                  className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Stay <span className="text-[#00C3FF]">Informed</span>
                </h2>
                <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto">
                  Subscribe to our newsletter for the latest compliance updates, guides, and analysis.
                </p>
                <Link
                  href="/newsletter"
                  className="btn-teal inline-flex items-center gap-2 mt-8"
                >
                  Subscribe to Newsletter <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
