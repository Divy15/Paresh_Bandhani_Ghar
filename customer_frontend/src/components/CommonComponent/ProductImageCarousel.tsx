import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

interface ProductImageCarouselProps {
  images: string[];
  patterns: React.CSSProperties[];
  name: string;
  size?: "default" | "large";
  showThumbnails?: boolean;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  patterns,
  name,
  size = "default",
  showThumbnails = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalSlides = images.length;

  const goToSlide = (index: number, dir: number) => {
    setDirection(dir);
    setCurrentIndex(index);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    goToSlide(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1, -1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    goToSlide(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1, 1);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    goToSlide(index, index > currentIndex ? 1 : -1);
  };

  const isLarge = size === "large";

  return (
    <div className={`flex flex-col w-full h-full ${showThumbnails ? "gap-3" : ""}`}>
      <div
        className={`relative w-full overflow-hidden group select-none ${
          isLarge ? "aspect-[4/5] rounded-lg border border-border-main" : "h-full"
        }`}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            <div
              className="w-full h-full absolute inset-0"
              style={patterns[currentIndex]}
            />
            <img
              src={images[currentIndex]}
              alt={`${name} view ${currentIndex + 1}`}
              className="w-full h-full object-cover relative z-10 pointer-events-none"
              loading="lazy"
              draggable={false}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={handlePrev}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-bg-main/70 text-text-main border border-border-main backdrop-blur-xs hover:bg-brand-red hover:text-white transition-all duration-300 shadow-sm ${
            isLarge ? "h-10 w-10 opacity-100" : "h-8 w-8 opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Previous Image"
        >
          <ChevronLeft size={isLarge ? 20 : 16} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-bg-main/70 text-text-main border border-border-main backdrop-blur-xs hover:bg-brand-red hover:text-white transition-all duration-300 shadow-sm ${
            isLarge ? "h-10 w-10 opacity-100" : "h-8 w-8 opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Next Image"
        >
          <ChevronRight size={isLarge ? 20 : 16} />
        </button>

        <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={(e) => handleDotClick(idx, e)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-4 bg-brand-red"
                  : "w-1.5 bg-text-muted/50 hover:bg-text-main/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {showThumbnails && (
        <div className="flex gap-2 justify-center">
          {images.map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={(e) => handleDotClick(idx, e)}
              className={`relative h-16 w-16 overflow-hidden rounded-md border-2 transition ${
                currentIndex === idx
                  ? "border-brand-red shadow-sm"
                  : "border-border-main/60 hover:border-brand-red/40"
              }`}
            >
              <div
                className="absolute inset-0"
                style={patterns[idx]}
              />
              <img
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                className="relative z-10 h-full w-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
