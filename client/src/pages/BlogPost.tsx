/**
 * BlogPost.tsx — Individual Blog Article
 * Power Theme blog article design with audio player
 * Uses blogData.ts for all 19 articles with cross-links
 * Hub palette: #0D1B2A / #1B3A5C / #00C3FF
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Clock, Calendar, Play, Pause, Sparkles, Volume2 } from "lucide-react";
import { blogArticleMap, blogArticles, categoryColors } from "@/lib/blogData";
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

/* ─── Audio Player Component (Real Audio) ─── */
function AudioPlayer({ title, duration, audioUrl }: { title: string; duration: string; audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState(duration);
  const [isLoading, setIsLoading] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.preload = "metadata";
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      if (audio.duration && isFinite(audio.duration)) {
        setTotalDuration(formatTime(audio.duration));
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration && isFinite(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTime(audio.currentTime));
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
    });

    audio.addEventListener("waiting", () => setIsLoading(true));
    audio.addEventListener("canplay", () => setIsLoading(false));

    return () => {
      audio.pause();
      audio.src = "";
      audio.remove();
    };
  }, [audioUrl, formatTime]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !audio.duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = pct * audio.duration;
  }, []);

  return (
    <div className="bg-[#0D1B2A] border border-[#1B3A5C]/60 rounded-xl p-4 flex items-center gap-4">
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-[#00C3FF] flex items-center justify-center text-[#0D1B2A] hover:bg-[#00C3FF]/80 transition-colors shrink-0"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-[#0D1B2A] border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{title}</p>
        <div className="mt-2 flex items-center gap-3">
          <div
            ref={progressBarRef}
            className="flex-1 h-1.5 bg-[#1B3A5C] rounded-full overflow-hidden cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-[#00C3FF] rounded-full transition-[width] duration-200 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-white/40 text-xs shrink-0">{currentTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <Volume2 className="w-3 h-3 text-[#00C3FF]" />
          <span className="hidden sm:inline">AI narration</span>
        </div>
        <span className="text-white/60 text-sm font-medium">{totalDuration}</span>
      </div>
    </div>
  );
}

export default function BlogPost() {

  const { slug } = useParams<{ slug: string }>();
  const article = slug ? blogArticleMap[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="-mt-[108px] pt-[108px]">
        <div className="min-h-[60vh] flex items-center justify-center bg-[#0A1628]">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Article Not Found</h1>
            <p className="text-white/60 mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/blog" className="btn-teal inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
          </div>
        </div>
      </div>
    );
  }

  // Get cross-linked articles
  const crossLinked = article.crossLinks
    .map(s => blogArticleMap[s])
    .filter(Boolean);

  // Get other related articles (same category, not current, not already in crossLinks)
  const otherRelated = blogArticles
    .filter(a => a.slug !== slug && !article.crossLinks.includes(a.slug) && a.category === article.category)
    .slice(0, 3);

  const sidebarArticles = [...crossLinked, ...otherRelated].slice(0, 5);

  return (
    <div className="-mt-[108px]">
      {/* ═══ FULL-WIDTH HERO IMAGE ═══ */}
      <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/70 to-[#0A1628]/20" />
        </div>

        <div className="absolute top-[120px] left-0 right-0 z-10">
          <div className="container flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> BACK
            </Link>
          </div>
        </div>

        <div className="container relative z-10 pb-10 pt-[200px]">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || "bg-[#1B3A5C] text-white"}`}>
                {article.category}
              </span>
              <span className="text-white/50 text-sm">{article.author}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/50 text-sm">{article.date}</span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-[0.95] tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {article.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ═══ AUDIO PLAYER BAR ═══ */}
      <section className="bg-[#0A1628] py-4">
        <div className="container max-w-4xl">
          <AudioPlayer title={article.title} duration={article.audioDuration} audioUrl={article.audioUrl} />
        </div>
      </section>

      {/* ═══ ARTICLE CONTENT + SIDEBAR ═══ */}
      <section className="bg-[#0A1628] py-12 lg:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12 max-w-6xl mx-auto">
            {/* Main content */}
            <Reveal>
              <div className="bg-[#0D1B2A] border border-[#1B3A5C]/40 rounded-2xl p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-[#1B3A5C]/30">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || ""}`}>
                    {article.category}
                  </span>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime} read
                  </span>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {article.date}
                  </span>
                </div>
                <div
                  className="article-prose-dark"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content, article.crossLinks) }}
                />
              </div>
            </Reveal>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-[120px] lg:self-start space-y-6">
              <Reveal delay={0.1}>
                <div className="bg-[#0D1B2A] border border-[#1B3A5C]/40 rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    {sidebarArticles.map((post, i) => (
                      <Link
                        key={i}
                        href={`/blog/${post.slug}`}
                        className="block text-white/60 hover:text-[#00C3FF] text-sm leading-relaxed transition-colors py-2 border-b border-[#1B3A5C]/20 last:border-0"
                      >
                        — {post.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="bg-gradient-to-br from-[#00C3FF]/10 to-[#1B3A5C]/20 border border-[#1B3A5C]/40 rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm mb-3">Need Compliance Help?</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">
                    Book a free consultation with our experts. We've helped 100+ sponsors protect their licences.
                  </p>
                  <Link href="/book-consultation" className="btn-teal text-xs py-2 px-4 inline-flex items-center gap-1">
                    Book Free Call <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <BlogNewsletterSignup variant="card" />
              </Reveal>

              <Reveal delay={0.2}>
                <div className="bg-[#0D1B2A] border border-[#1B3A5C]/40 rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm mb-3">Sponsor ComplIANS Hub</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">
                    The compliance platform built for UK sponsor licence holders. Track workers, monitor salaries, and stay audit-ready.
                  </p>
                  <Link href="/sponsor-complians-hub" className="text-[#00C3FF] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MORE ARTICLES ═══ */}
      <section className="bg-[#0D1B2A] py-16 border-t border-[#1B3A5C]/20">
        <div className="container">
          <Reveal>
            <h2
              className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-10"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              More <span className="text-[#00C3FF]">Articles</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {blogArticles
              .filter(a => a.slug !== slug)
              .slice(0, 3)
              .map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.08}>
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <div className="h-full rounded-xl overflow-hidden bg-[#0A1628] border border-[#1B3A5C]/50 hover:border-[#00C3FF]/40 transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent opacity-60" />
                        <div className="absolute top-4 left-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || "bg-[#1B3A5C] text-white"}`}>
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3
                          className="text-white font-bold leading-snug mb-2 group-hover:text-[#00C3FF] transition-colors line-clamp-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {post.title}
                        </h3>
                        <span className="text-[#00C3FF] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read Article <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-[#0D1B2A] py-16">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden p-10 md:p-14 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C3FF]/10 via-[#1B3A5C]/20 to-transparent" />
              <div className="absolute inset-0 border border-[#1B3A5C]/50 rounded-2xl" />
              <div className="relative z-10">
                <h2
                  className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Need Help with <span className="text-[#00C3FF]">Compliance?</span>
                </h2>
                <p className="mt-4 text-white/60 max-w-xl mx-auto">
                  Book a free consultation with our compliance experts. We've helped over 100 sponsor licence holders protect their licences.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/book-consultation" className="btn-teal inline-flex items-center gap-2">
                    Book Free Consultation <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="tel:02036186968" className="btn-white-outline inline-flex items-center gap-2">
                    Call 020 3618 6968
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


    </div>
  );
}

/* ─── Markdown → HTML (dark theme) ─── */
function renderMarkdown(md: string, crossLinks: string[]): string {
  return md
    .trim()
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("### ")) return `<h3>${inline(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h2>${inline(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) return `<h1>${inline(block.slice(2))}</h1>`;
      if (block === "---") return "<hr />";
      if (block.match(/^[-*] /m)) {
        const items = block.split("\n").filter((l) => l.match(/^[-*]\s/));
        return `<ul>${items.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (block.match(/^\d+[\.\)] /m)) {
        const items = block.split("\n").filter((l) => l.match(/^\d+[\.\)] /));
        return `<ol>${items.map((l) => `<li>${inline(l.replace(/^\d+[\.\)] /, ""))}</li>`).join("")}</ol>`;
      }
      if (block.startsWith("> ")) {
        return `<blockquote><p>${inline(block.replace(/^> /gm, ""))}</p></blockquote>`;
      }
      if (block.startsWith("_") && block.endsWith("_")) {
        return `<p><em>${inline(block.slice(1, -1))}</em></p>`;
      }
      if (block.startsWith("*") && block.endsWith("*") && !block.startsWith("**")) {
        return `<p><em>${inline(block.slice(1, -1))}</em></p>`;
      }
      return `<p>${inline(block)}</p>`;
    })
    .join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\(\)/g, (_, linkText) => {
      // Empty href links — try to match to a cross-linked article by title
      const slug = findSlugByTitle(linkText);
      if (slug) {
        return `<a href="/blog/${slug}">${linkText}</a>`;
      }
      return `<a href="/blog">${linkText}</a>`;
    })
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

function findSlugByTitle(title: string): string | null {
  const lower = title.toLowerCase();
  for (const a of blogArticles) {
    if (a.title.toLowerCase().includes(lower) || lower.includes(a.title.toLowerCase().slice(0, 30))) {
      return a.slug;
    }
  }
  // Fuzzy match on key phrases
  const keyPhrases: Record<string, string> = {
    "revoked twice": "sponsor-licence-revoked-twice",
    "submitted every document": "submitted-every-document-still-revoked",
    "10-year settlement": "10-year-settlement-rule",
    "settlement rule": "10-year-settlement-rule",
    "suspension reinstated": "sponsor-licence-suspension-reinstated-b-rating",
    "b-rating": "sponsor-licence-suspension-reinstated-b-rating",
    "compliance visits are decided": "home-office-compliance-visit-preparation",
    "salary mismatch": "ukvi-salary-mismatch-case-note",
    "we have concerns": "we-have-concerns-email",
    "west midlands": "west-midlands-revocations",
    "worcestershire": "west-midlands-revocations",
    "care home": "care-home-licence-reinstated",
    "unannounced visit": "unannounced-home-office-visit-case-study",
    "two questions": "unannounced-visit-two-questions",
    "doing nothing": "why-doing-nothing-is-no-longer-an-option",
    "cost of silence": "cost-of-silence-reporting-changes",
    "incomplete paperwork": "incomplete-paperwork-compliance-mistake",
    "minimum wage": "paying-below-minimum-wage",
    "delayed start": "delayed-start-date-reporting-breach",
    "cos salary": "cos-salary-compliance-guide",
    "mismatched dates": "mismatched-dates-licence-revocation",
    "1,948": "1948-sponsor-licences-revoked",
    "1948": "1948-sponsor-licences-revoked",
  };
  for (const [phrase, slug] of Object.entries(keyPhrases)) {
    if (lower.includes(phrase)) return slug;
  }
  return null;
}
