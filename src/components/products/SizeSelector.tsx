'use client';
import { useState } from 'react';
import { SIZES } from '@/data/products';

export default function SizeSelector({ selectedSize, onSelect }: { selectedSize: string; onSelect: (s: string) => void }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-cream/60 text-sm" id="size-label">Waist Size</p>
        <button
          onClick={() => setShow(!show)}
          className="text-gold/70 text-xs hover:text-gold transition-colors underline underline-offset-2 min-h-[44px] inline-flex items-center focus:outline-none focus:ring-2 focus:ring-gold/50 rounded px-2"
          aria-expanded={show}
          aria-controls="size-guide"
        >
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="size-label">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`w-12 h-12 min-h-[44px] min-w-[44px] rounded-lg border text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] ${selectedSize === s ? 'border-gold bg-gold/10 text-gold' : 'border-gold/15 text-cream/50 hover:border-gold/40 hover:text-cream'}`}
            role="radio"
            aria-checked={selectedSize === s}
            aria-label={`Size ${s} inches`}
          >
            {s}
          </button>
        ))}
      </div>
      {show && (
        <div id="size-guide" className="mt-4 p-4 glass rounded-lg" role="region" aria-label="Size guide">
          <h4 className="font-serif text-sm text-gold mb-3">Size Guide</h4>
          <div className="space-y-2 text-xs text-cream/50">
            <div className="flex justify-between"><span>28-30"</span><span>Waist 26-28"</span></div>
            <div className="flex justify-between"><span>32-34"</span><span>Waist 30-32"</span></div>
            <div className="flex justify-between"><span>36-38"</span><span>Waist 34-36"</span></div>
            <div className="flex justify-between"><span>40-42"</span><span>Waist 38-40"</span></div>
            <div className="flex justify-between"><span>44"</span><span>Waist 42-44"</span></div>
          </div>
          <p className="text-cream/30 text-[10px] mt-3">Belt size = waist + 2 inches.</p>
        </div>
      )}
    </div>
  );
}
