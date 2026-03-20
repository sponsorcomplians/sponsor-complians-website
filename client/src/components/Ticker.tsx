export default function Ticker() {
  const items = [
    "1,948 sponsor licences revoked in 2024-25 — highest on record",
    "Care worker visa route under review — new salary thresholds expected Q2 2026",
    "Home Office compliance visits up 34% year-on-year",
    "SOC code changes effective April 2026 — check your CoS assignments",
    "Right to Work checks: digital verification now mandatory for all new hires",
    "Sponsor licence processing times reduced to 6 weeks average",
    "NHS workforce vacancies: 78,330 unfilled roles — Jan 2026",
    "New genuine vacancy test guidance published by Home Office",
  ];

  const doubled = [...items, ...items];

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 bg-[#0D1B2A] border-b border-white/5 overflow-hidden h-9 flex items-center">
      <div className="flex items-center gap-4 shrink-0">
        <span className="shrink-0 flex items-center gap-2 pl-4">
          <span className="w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse" />
          <span className="text-[#00C3FF] text-[11px] font-bold tracking-wider uppercase">Live</span>
        </span>
      </div>
      <div className="overflow-hidden flex-1 ml-4">
        <div className="flex gap-12 ticker-animate whitespace-nowrap">
          {doubled.map((text, i) => (
            <span key={i} className="text-white/50 text-[11px] shrink-0">
              {text}
              <span className="mx-6 text-[#00C3FF]">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
