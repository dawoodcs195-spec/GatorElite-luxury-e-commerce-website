'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface PromptModalProps {
  open: boolean;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function PromptModal({
  open,
  title,
  placeholder = '',
  defaultValue = '',
  onConfirm,
  onCancel,
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, defaultValue]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && value.trim()) onConfirm(value.trim());
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel, onConfirm, value]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onCancel(); }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="glass rounded-2xl p-6 w-full max-w-md relative"
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-cream/30 hover:text-cream transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="font-serif text-lg text-cream mb-4">{title}</h3>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#161616] border border-gold/20 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px] mb-6"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gold/20 text-cream/50 text-xs uppercase tracking-wider hover:border-gold/40 hover:text-cream transition-all min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (value.trim()) onConfirm(value.trim()); }}
            disabled={!value.trim()}
            className="px-5 py-2.5 rounded-lg bg-gold text-[#0A0A0A] text-xs uppercase tracking-wider font-semibold transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-light"
          >
            Add
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
