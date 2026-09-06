'use client';
import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AccordionSpecs({ specs }: { specs: { label: string; value: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(open === index ? null : index);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = index < specs.length - 1 ? index + 1 : 0;
      setOpen(next);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = index > 0 ? index - 1 : specs.length - 1;
      setOpen(prev);
    }
  }, [open, specs.length]);

  return (
    <div className="border-t border-gold/10" role="region" aria-label="Product specifications">
      {specs.map((s, i) => (
        <div key={s.label} className="border-b border-gold/10">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-full flex items-center justify-between py-4 text-left group min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-inset rounded"
            aria-expanded={open === i}
            aria-controls={`spec-panel-${i}`}
            id={`spec-header-${i}`}
          >
            <span className="text-cream/60 text-sm">{s.label}</span>
            <ChevronDown
              size={16}
              className={cn(
                'text-cream/30 transition-transform duration-300 group-hover:text-gold',
                open === i && 'rotate-180 text-gold'
              )}
              aria-hidden="true"
            />
          </button>
          <div
            id={`spec-panel-${i}`}
            role="region"
            aria-labelledby={`spec-header-${i}`}
            className={cn('accordion-content', open === i && 'open')}
          >
            <p className="text-cream/80 text-sm pb-4">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
