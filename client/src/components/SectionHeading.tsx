interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  dark?: boolean;
}

export default function SectionHeading({ label, title, subtitle, center = true, dark = false }: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-12`}>
      {label && (
        <span className={`inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 ${
          dark ? "text-sky-light" : "text-sky"
        }`}>
          {label}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-tight ${
          dark ? "text-white" : "text-navy"
        }`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${
          dark ? "text-white/60" : "text-slate-muted"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
