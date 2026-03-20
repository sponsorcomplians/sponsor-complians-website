import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { Download, FileText, FileSpreadsheet, FileImage, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-8 h-8 text-red-400" />,
  doc: <FileText className="w-8 h-8 text-blue-400" />,
  docx: <FileText className="w-8 h-8 text-blue-400" />,
  xls: <FileSpreadsheet className="w-8 h-8 text-green-400" />,
  xlsx: <FileSpreadsheet className="w-8 h-8 text-green-400" />,
  png: <FileImage className="w-8 h-8 text-purple-400" />,
  jpg: <FileImage className="w-8 h-8 text-purple-400" />,
};

export default function Downloads() {
  const { data: downloads, isLoading } = trpc.downloads.list.useQuery();
  const trackDownload = trpc.downloads.track.useMutation();
  const [downloadEmail, setDownloadEmail] = useState("");
  const [activeDownload, setActiveDownload] = useState<number | null>(null);

  const handleDownload = async (id: number, url: string) => {
    if (downloadEmail) {
      await trackDownload.mutateAsync({ downloadId: id, email: downloadEmail });
    } else {
      await trackDownload.mutateAsync({ downloadId: id });
    }
    window.open(url, "_blank");
    toast.success("Download started!");
    setActiveDownload(null);
  };

  return (
    <div className="-mt-[108px]">
      {/* Hero */}
      <section className="hero-gradient min-h-[40vh] flex items-center relative overflow-hidden pt-[108px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 py-16">
          <Reveal>
            <span className="section-label inline-block mb-4">Resources</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Free Compliance <span className="text-gradient-teal">Downloads</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#8B9EB7] text-lg max-w-2xl">
              Access our library of compliance guides, checklists, templates, and resources — all built from real audit data.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="light-section py-20">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-48 border border-[#E2E8F0]" />
              ))}
            </div>
          ) : !downloads?.length ? (
            <div className="text-center py-16">
              <Download className="w-12 h-12 text-[#8B9EB7] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0D1B2A] mb-2">Resources Coming Soon</h3>
              <p className="text-[#6B7280]">We are preparing compliance guides and templates. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloads.map((dl, i) => (
                <Reveal key={dl.id} delay={i * 0.1}>
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      {fileIcons[dl.fileType || ""] || <File className="w-8 h-8 text-[#8B9EB7]" />}
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0D1B2A] text-lg leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{dl.title}</h3>
                        {dl.category && <span className="text-xs text-[#00C3FF] font-medium">{dl.category}</span>}
                      </div>
                    </div>
                    {dl.description && <p className="text-[#6B7280] text-sm mb-4 leading-relaxed">{dl.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-[#8B9EB7] text-xs">{dl.fileSize || ""} {dl.fileType?.toUpperCase() || ""}</span>
                      {activeDownload === dl.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="email"
                            placeholder="Email (optional)"
                            value={downloadEmail}
                            onChange={e => setDownloadEmail(e.target.value)}
                            className="h-8 text-xs w-40"
                          />
                          <Button size="sm" onClick={() => handleDownload(dl.id, dl.fileUrl)} className="bg-[#00C3FF] hover:bg-[#00C3FF]/80 text-[#0D1B2A] h-8 text-xs">
                            Download
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setActiveDownload(dl.id)} className="text-xs">
                          <Download className="w-3.5 h-3.5 mr-1" /> Download
                        </Button>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
