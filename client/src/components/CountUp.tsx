import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface Props {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountUp({ end, prefix = "", suffix = "", duration = 2000, className = "" }: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
