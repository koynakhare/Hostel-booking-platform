import { useCallback, useEffect, useState } from "react";
import HostelImage from "@/components/ui/HostelImage";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  imageClassName?: string;
  className?: string;
}

export default function ImageCarousel({
  images,
  alt,
  intervalMs = 4000,
  imageClassName = "h-80 w-full object-cover",
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const imageCount = images.length;
  const hasMultiple = imageCount > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!hasMultiple) return;
      setCurrentIndex((index + imageCount) % imageCount);
    },
    [hasMultiple, imageCount],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (!hasMultiple || isPaused) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageCount);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [hasMultiple, isPaused, imageCount, intervalMs]);

  if (!imageCount) {
    return (
      <HostelImage
        src={null}
        alt={alt}
        className={`card-base w-full rounded-lg object-cover ${imageClassName}`}
      />
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-xl ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <HostelImage
        key={currentIndex}
        src={images[currentIndex]}
        alt={`${alt} - image ${currentIndex + 1}`}
        className={`${imageClassName} scale-100 transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-105`}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:scale-110 hover:bg-black/60"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:scale-110 hover:bg-black/60"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-2 gap-1.5 opacity-80 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                  i === currentIndex ? "w-5 bg-white" : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
