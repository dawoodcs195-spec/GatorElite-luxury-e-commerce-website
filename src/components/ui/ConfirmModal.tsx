'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'info' | 'warning';
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const iconMap = {
    danger: <AlertTriangle size={24} className="text-red-400" />,
    warning: <AlertTriangle size={24} className="text-yellow-400" />,
    info: <Info size={24} className="text-blue-400" />,
  };

  const accentMap = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600',
  };

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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(201, 169, 110, 0.1)' }}>
            {iconMap[variant]}
          </div>
          <h3 className="font-serif text-lg text-cream">{title}</h3>
        </div>

        <p className="text-cream/60 text-sm mb-6 pl-[52px]">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gold/20 text-cream/50 text-xs uppercase tracking-wider hover:border-gold/40 hover:text-cream transition-all min-h-[44px]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-white text-xs uppercase tracking-wider font-semibold transition-all min-h-[44px] ${accentMap[variant]}`}
          >
            {confirmText}
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
