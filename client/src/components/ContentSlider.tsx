import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContentSliderProps {
  children: ReactNode[];
  /** How many cards visible at once on desktop */
  visibleCount?: number;
  /** Auto-play interval in ms, 0 to disable */
  autoPlay?: number;
  /** Show dot indicators */
  showDots?: boolean;
  /** Show fade edges */
  showFade?: boolean;
  /** Card gap in px */
  gap?: number;
  className?: string;
}

export default function ContentSlider({
  children,
  visibleCount = 3,
  autoPlay = 0,
  showDots = true,
  showFade = true,
  gap = 24,
  className = "",
}: ContentSliderProps) {
  const totalSlides = children.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const maxIndex = Math.max(0, totalSlides - visibleCount);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setCurrentIndex(clamped);
    },
    [maxIndex]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play
  useEffect(() => {
    if (autoPlay <= 0 || isHovered) return;
    const timer = setInterval(goNext, autoPlay);
    return () => clearInterval(timer);
  }, [autoPlay, goNext, isHovered]);

  // Drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(currentIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const diff = startX - e.pageX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].pageX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].pageX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Calculate card width percentage
  const cardWidthPercent = 100 / visibleCount;

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade edges */}
      {showFade && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "8%",
              background:
                "linear-gradient(to right, var(--fade-bg, #0A1628), transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "8%",
              background:
                "linear-gradient(to left, var(--fade-bg, #0A1628), transparent)",
            }}
          />
        </>
      )}

      {/* Prev/Next Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0D1B2A]/80 border border-[#1B3A5C] flex items-center justify-center text-white hover:bg-[#00C3FF]/20 hover:border-[#00C3FF] transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0D1B2A]/80 border border-[#1B3A5C] flex items-center justify-center text-white hover:bg-[#00C3FF]/20 hover:border-[#00C3FF] transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
            gap: `${gap}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="shrink-0 transition-opacity duration-300"
              style={{
                width: `calc(${cardWidthPercent}% - ${((visibleCount - 1) * gap) / visibleCount}px)`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {showDots && totalSlides > visibleCount && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-[#00C3FF] w-6"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
