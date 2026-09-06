'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Viewer360Props {
  images: string[];
  colorHex?: string;
  productName: string;
}

export default function Viewer360({ images, colorHex = '#0A0A0A', productName }: Viewer360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const totalImages = images.length;

  function nextImage() {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }

  function prevImage() {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }

  if (totalImages === 0) {
    return (
      <div
        className="aspect-square rounded-2xl overflow-hidden glass-light flex items-center justify-center"
        style={{ background: `radial-gradient(circle, ${colorHex}40, #0A0A0A)` }}
      >
        <div className="text-center">
          <div className="w-24 h-24 border-2 border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="font-serif text-gold text-4xl" aria-hidden="true">G</span>
          </div>
          <p className="text-cream/40 text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main image */}
      <motion.div
        className="aspect-square rounded-2xl overflow-hidden glass-light relative"
        style={{ background: `radial-gradient(circle, ${colorHex}30, #0A0A0A)` }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} — Image ${currentIndex + 1} of ${totalImages}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation arrows */}
        {totalImages > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 min-h-[44px] min-w-[44px] rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-cream/70 hover:text-gold hover:bg-black/70 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 min-h-[44px] min-w-[44px] rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-cream/70 hover:text-gold hover:bg-black/70 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </motion.div>

      {/* Thumbnail strip */}
      {totalImages > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                i === currentIndex ? 'border-gold' : 'border-gold/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-cream/50 text-xs font-mono">
          {currentIndex + 1} / {totalImages}
        </span>
      </div>
    </div>
  );
}
