'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Clock, MessageSquare, Trash2, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    try {
      const r = await fetch('/api/contact');
      const d = await r.json();
      setMessages(d.messages || []);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  }

  const [confirmState, setConfirmState] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const handleConfirmDelete = useCallback(() => {
    if (confirmState.id) {
      setMessages(prev => prev.filter(m => m._id !== confirmState.id));
      if (selected?._id === confirmState.id) setSelected(null);
    }
    setConfirmState({ open: false, id: null });
  }, [confirmState.id, selected]);

  function deleteMessage(id: string) {
    setConfirmState({ open: true, id });
  }

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="p-2 text-cream/40 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </Link>
            <MessageSquare size={24} className="text-gold" />
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-cream">Messages</h1>
              <p className="text-cream/40 text-xs">
                {messages.length} total{unreadCount > 0 ? `, ${unreadCount} unread` : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages list */}
            <div className="lg:col-span-1 space-y-2">
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl">
                  <Mail size={48} className="text-gold/20 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-cream mb-2">No Messages</h3>
                  <p className="text-cream/40 text-sm">Contact form messages will appear here.</p>
                </div>
              ) : (
                messages.map(m => (
                  <button
                    key={m._id}
                    onClick={() => setSelected(m)}
                    className={
                      'w-full text-left glass rounded-xl p-4 transition-colors hover:border-gold/30 ' +
                      (selected?._id === m._id
                        ? 'border-gold/40 bg-gold/5'
                        : !m.isRead
                        ? 'border-l-2 border-l-gold'
                        : '')
                    }
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-cream text-sm font-medium truncate">{m.name}</h4>
                      {!m.isRead && (
                        <span className="w-2 h-2 bg-gold rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-cream/40 text-xs truncate">{m.email}</p>
                    <p className="text-cream/30 text-xs truncate mt-1">{m.message}</p>
                    <span className="text-cream/20 text-[10px] flex items-center gap-1 mt-2">
                      <Clock size={10} />
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Message detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="glass rounded-2xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
                        <Mail size={24} className="text-gold" />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl text-cream">{selected.name}</h2>
                        <a
                          href={'mailto:' + selected.email}
                          className="text-gold/60 text-sm hover:text-gold transition-colors"
                        >
                          {selected.email}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMessage(selected._id)}
                      className="p-2 text-cream/30 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-cream/30 text-xs mb-6">
                    <Clock size={12} />
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>

                  <div className="border-t border-gold/10 pt-6">
                    <p className="text-cream/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>

                  <div className="border-t border-gold/10 mt-6 pt-6">
                    <a
                      href={
                        'mailto:' + selected.email +
                        '?subject=Re: Your message to GatorElite' +
                        '&body=%0A%0A---%0AOriginal message from ' + encodeURIComponent(selected.name) + ':%0A' + encodeURIComponent(selected.message)
                      }
                      className="btn-gold rounded inline-flex items-center gap-2 min-h-[44px]"
                    >
                      <Mail size={16} />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-12 text-center">
                  <Eye size={48} className="text-gold/20 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-cream mb-2">Select a Message</h3>
                  <p className="text-cream/40 text-sm">Click a message to view its details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ConfirmModal
        open={confirmState.open}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
      />
    </>
  );
}
