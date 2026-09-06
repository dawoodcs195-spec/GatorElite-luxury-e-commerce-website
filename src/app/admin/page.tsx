'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, Save, X, Upload, LogOut,
  Package, Image as ImageIcon, Eye, ChevronDown, ChevronUp,
  LayoutDashboard, Star, ArrowLeft, Shield, MessageSquare,
  ShoppingCart, Users, StarIcon, Search, FileDown
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConfirmModal from '@/components/ui/ConfirmModal';
import PromptModal from '@/components/ui/PromptModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Product {
  _id: string; name: string; slug: string; subtitle: string;
  price: number; priceFormatted: string; rating: number; reviewCount: number;
  material: string; lining: string; mechanism: string; packaging: string;
  description: string; features: string[]; sizes: string[];
  colorName: string; colorHex: string; bgColor: string;
  images: string[]; isActive: boolean; createdAt: string;
}

interface Order {
  _id: string; customerName: string; customerEmail: string;
  items: { name: string; price: number; quantity: number; size: string; color: string }[];
  totalAmount: number; shipping: { address: string; city: string };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface User {
  _id: string; name: string; email: string; role: string;
  isVerified: boolean; createdAt: string;
}

interface Review {
  _id: string; userName: string; rating: number; comment: string;
  productId: string; createdAt: string;
}

interface Message {
  _id: string; name: string; email: string; message: string;
  isRead: boolean; createdAt: string;
}

type AdminTab = 'products' | 'orders' | 'users' | 'reviews' | 'messages';

const EMPTY = {
  name: '', slug: '', subtitle: 'Premium Crocodile Leather Belt',
  price: 29000, priceFormatted: 'Rs. 29,000', rating: 5.0, reviewCount: 0,
  material: '', lining: '', mechanism: '', packaging: '', description: '',
  features: [''], sizes: ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'],
  colorName: '', colorHex: '#0A0A0A', bgColor: 'onyx', images: [], isActive: true,
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  shipped: 'bg-purple-500/10 text-purple-400',
  delivered: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

export default function AdminDashboard() {
  const [adminTab, setAdminTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<'list' | 'edit'>('list');
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [checking, setChecking] = useState(true);
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; message: string; variant: 'danger' | 'warning' | 'info'; onConfirm: () => void }>({ open: false, title: '', message: '', variant: 'danger', onConfirm: () => {} });
  const [alertState, setAlertState] = useState<{ open: boolean; title: string; message: string }>({ open: false, title: '', message: '' });
  const [promptState, setPromptState] = useState<{ open: boolean; onConfirm: (value: string) => void }>({ open: false, onConfirm: () => {} });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated) { window.location.href = '/login'; return; }
        if (data.user.role !== 'admin') { window.location.href = '/'; return; }
        setIsAdmin(true);
        setUserName(data.user.name);
        loadAll();
      })
      .catch(() => { window.location.href = '/login'; })
      .finally(() => setChecking(false));
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [pRes, oRes, uRes, rRes, mRes] = await Promise.allSettled([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/reviews').then(r => r.json()),
        fetch('/api/contact').then(r => r.json()),
      ]);
      if (pRes.status === 'fulfilled') setProducts(Array.isArray(pRes.value) ? pRes.value : []);
      if (oRes.status === 'fulfilled') setOrders(oRes.value.orders || []);
      if (uRes.status === 'fulfilled') setUsers(uRes.value.users || []);
      if (rRes.status === 'fulfilled') setReviews(rRes.value.reviews || []);
      if (mRes.status === 'fulfilled') setMessages(mRes.value.messages || []);
    } catch {}
    setLoading(false);
  }

  function startCreate() { setForm({ ...EMPTY, features: [''], images: [] }); setEditing(null); setIsCreating(true); setTab('edit'); }
  function startEdit(p: Product) {
    setForm({ ...p, features: p.features ? [...p.features] : [''], sizes: p.sizes ? [...p.sizes] : [], images: p.images ? [...p.images] : [] });
    setEditing(p); setIsCreating(false); setTab('edit');
  }

  async function save() {
    if (!isAdmin) return; setSaving(true);
    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/products' : '/api/products/' + editing!._id;
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (r.ok) { await loadAll(); setTab('list'); setEditing(null); setIsCreating(false); }
      else { const e = await r.json(); setAlertState({ open: true, title: 'Error', message: e.error || 'Failed to save' }); }
    } catch (e: any) { setAlertState({ open: true, title: 'Error', message: e.message }); }
    setSaving(false);
  }

  function del(id: string) {
    if (!isAdmin) return;
    setConfirmState({
      open: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        try { await fetch('/api/products/' + id, { method: 'DELETE' }); await loadAll(); }
        catch (e: any) { setAlertState({ open: true, title: 'Error', message: e.message }); }
      },
    });
  }

  async function uploadImg(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isAdmin || !e.target.files) return;
    setUploading(true);
    for (let i = 0; i < e.target.files.length; i++) {
      const fd = new FormData(); fd.append('file', e.target.files[i]);
      try { const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json(); if (d.url) setForm((prev: any) => ({ ...prev, images: [...prev.images, d.url] })); }
      catch (err) { console.error('Upload failed:', err); }
    }
    setUploading(false); if (fileRef.current) fileRef.current.value = '';
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, status }) });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: status as any } : o));
    } catch (e: any) { setAlertState({ open: true, title: 'Error', message: e.message }); }
  }

  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/'; }

  function exportOrdersToPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(200, 169, 110);
    doc.text('Gator\u00c9lite Orders Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Orders: ${orders.length}`, 14, 36);

    const tableData = orders.map(o => [
      o.customerName,
      o.customerEmail,
      o.items.map(i => `${i.name} x${i.quantity}${i.size ? ` (${i.size})` : ''}`).join(', '),
      `Rs. ${o.totalAmount.toLocaleString()}`,
      o.status.charAt(0).toUpperCase() + o.status.slice(1),
      o.shipping.city,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 42,
      head: [['Customer', 'Email', 'Items', 'Total', 'Status', 'City', 'Date']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [200, 169, 110] },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 3: { halign: 'right' } },
    });

    doc.save('gatorelite-orders.pdf');
  }

  function exportOrdersToExcel() {
    const data = orders.map(o => ({
      'Order ID': o._id,
      'Customer Name': o.customerName,
      'Email': o.customerEmail,
      'Items': o.items.map(i => `${i.name} x${i.quantity}${i.size ? ` (${i.size})` : ''}${i.color ? ` [${i.color}]` : ''}`).join(', '),
      'Total (Rs.)': o.totalAmount,
      'Status': o.status.charAt(0).toUpperCase() + o.status.slice(1),
      'Shipping Address': o.shipping.address,
      'City': o.shipping.city,
      'Date': new Date(o.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    ws['!cols'] = [
      { wch: 24 }, { wch: 20 }, { wch: 28 }, { wch: 40 },
      { wch: 14 }, { wch: 12 }, { wch: 30 }, { wch: 18 }, { wch: 14 },
    ];

    XLSX.writeFile(wb, 'gatorelite-orders.xlsx');
  }

  // EDIT/CREATE FORM
  if (tab === 'edit') {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setTab('list'); setEditing(null); setIsCreating(false); }} className="p-2 text-cream/40 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"><ArrowLeft size={20} /></button>
              <h2 className="font-serif text-2xl text-cream">{isCreating ? 'New Product' : 'Edit: ' + (form.name || 'Product')}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-lg text-cream flex items-center gap-2"><Package size={18} className="text-gold" /> Basic Info</h3>
                  <div><label className="block text-cream/50 text-xs uppercase mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={() => { if (form.name && !form.slug) setForm({ ...form, slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }); }} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" placeholder="Enter product name..." /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Slug *</label><input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Subtitle</label><input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                  </div>
                  <div><label className="block text-cream/50 text-xs uppercase mb-1">Description</label><textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none resize-none min-h-[44px]" /></div>
                </div>
                <div className="glass rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-lg text-cream">Pricing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Price</label><input type="number" value={form.price} onChange={(e) => { const p = Number(e.target.value); setForm({ ...form, price: p, priceFormatted: 'Rs. ' + p.toLocaleString() }); }} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Display</label><input type="text" value={form.priceFormatted} onChange={(e) => setForm({ ...form, priceFormatted: e.target.value })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Rating</label><input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Reviews</label><input type="number" value={form.reviewCount} onChange={(e) => setForm({ ...form, reviewCount: Number(e.target.value) })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                  </div>
                </div>
                <div className="glass rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-lg text-cream">Color</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Color Name</label><input type="text" value={form.colorName} onChange={(e) => setForm({ ...form, colorName: e.target.value })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">Hex</label><div className="flex gap-2"><input type="color" value={form.colorHex || '#0A0A0A'} onChange={(e) => setForm({ ...form, colorHex: e.target.value })} className="w-12 h-11 rounded-lg border border-gold/10 cursor-pointer bg-transparent" /><input type="text" value={form.colorHex || ''} onChange={(e) => setForm({ ...form, colorHex: e.target.value })} className="flex-1 bg-[#161616] border border-gold/10 rounded-lg px-3 text-cream text-sm focus:border-gold/40 focus:outline-none font-mono" /></div></div>
                    <div><label className="block text-cream/50 text-xs uppercase mb-1">BG</label><select value={form.bgColor || 'onyx'} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]">{['onyx', 'navy', 'espresso', 'cognac', 'custom'].map(v => (<option key={v} value={v}>{v}</option>))}</select></div>
                  </div>
                </div>
                <div className="glass rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-lg text-cream">Specs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ key: 'material', label: 'Material' }, { key: 'lining', label: 'Lining' }, { key: 'mechanism', label: 'Mechanism' }, { key: 'packaging', label: 'Packaging' }].map(({ key, label }) => (
                      <div key={key}><label className="block text-cream/50 text-xs uppercase mb-1">{label}</label><input type="text" value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" /></div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between"><h3 className="font-serif text-lg text-cream">Features</h3><button onClick={() => setForm({ ...form, features: [...(form.features || []), ''] })} className="flex items-center gap-1 text-gold/70 hover:text-gold text-xs min-h-[44px]"><Plus size={14} /> Add Feature</button></div>
                  {(form.features || []).map((f: string, i: number) => (
                    <div key={i} className="flex gap-2"><input type="text" value={f} onChange={(e) => { const nf = [...form.features]; nf[i] = e.target.value; setForm({ ...form, features: nf }); }} className="flex-1 bg-[#161616] border border-gold/10 rounded-lg px-4 py-2.5 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" placeholder="Enter feature..." /><button onClick={() => setForm({ ...form, features: form.features.filter((_: string, j: number) => j !== i) })} className="p-2 text-cream/30 hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={14} /></button></div>
                  ))}
                </div>
                <div className="glass rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-lg text-cream">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {(form.sizes || []).map((s: string, i: number) => (
                      <div key={i} className="flex items-center bg-[#161616] border border-gold/10 rounded-lg px-3 py-2"><span className="text-cream text-sm">{s}</span><button onClick={() => setForm({ ...form, sizes: form.sizes.filter((_: string, j: number) => j !== i) })} className="ml-2 text-cream/30 hover:text-red-400 p-1"><X size={12} /></button></div>
                    ))}
                    <button onClick={() => setPromptState({ open: true, onConfirm: (value: string) => setForm({ ...form, sizes: [...(form.sizes || []), value] }) })} className="flex items-center gap-1 px-3 py-2 border border-dashed border-gold/20 rounded-lg text-cream/30 hover:text-gold text-xs min-h-[44px]"><Plus size={12} /> Add Size</button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass rounded-xl p-6 space-y-4"><h3 className="font-serif text-lg text-cream">Status</h3><div className="flex items-center gap-3 cursor-pointer" onClick={() => setForm({ ...form, isActive: !form.isActive })}><div className={'w-10 h-6 rounded-full relative transition-colors ' + (form.isActive ? 'bg-gold' : 'bg-[#333]')}><div className={'w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ' + (form.isActive ? 'translate-x-5' : 'translate-x-1')} /></div><span className="text-cream/60 text-sm">{form.isActive ? 'Active' : 'Inactive'}</span></div></div>
                <div className="glass rounded-xl p-6 space-y-4">
                  <h3 className="font-serif text-lg text-cream flex items-center gap-2"><ImageIcon size={18} className="text-gold" /> Images ({(form.images || []).length})</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(form.images || []).map((img: string, i: number) => (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gold/10"><img src={img} alt="" className="w-full h-full object-cover" /><button onClick={() => setForm({ ...form, images: form.images.filter((_: string, j: number) => j !== i) })} className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400"><X size={12} /></button></div>
                    ))}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={uploadImg} className="hidden" id="img-upload" />
                  <label htmlFor="img-upload" className="flex items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-gold/15 rounded-xl text-cream/30 hover:border-gold/40 hover:text-gold/60 cursor-pointer transition-all text-sm">{uploading ? <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /> : <><Upload size={18} /> Click to Upload</>}</label>
                </div>
                <div className="space-y-3">
                  <button onClick={save} disabled={saving || !form.name || !form.slug} className="btn-gold rounded w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]">{saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save size={16} /> {isCreating ? 'Create Product' : 'Save Changes'}</>}</button>
                  <button onClick={() => { setTab('list'); setEditing(null); setIsCreating(false); }} className="w-full py-3 border border-gold/20 rounded text-cream/50 text-xs uppercase tracking-wider hover:border-gold/40 hover:text-cream transition-all min-h-[44px]">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />

        <ConfirmModal
          open={confirmState.open}
          title={confirmState.title}
          message={confirmState.message}
          confirmText="Delete"
          variant={confirmState.variant}
          onConfirm={() => { confirmState.onConfirm(); setConfirmState(prev => ({ ...prev, open: false })); }}
          onCancel={() => setConfirmState(prev => ({ ...prev, open: false }))}
        />
        <ConfirmModal
          open={alertState.open}
          title={alertState.title}
          message={alertState.message}
          confirmText="OK"
          cancelText="Close"
          variant="info"
          onConfirm={() => setAlertState({ open: false, title: '', message: '' })}
          onCancel={() => setAlertState({ open: false, title: '', message: '' })}
        />
        <PromptModal
          open={promptState.open}
          title="Enter Size"
          placeholder={'e.g. 32"'}
          onConfirm={(value) => { promptState.onConfirm(value); setPromptState({ open: false, onConfirm: () => {} }); }}
          onCancel={() => setPromptState({ open: false, onConfirm: () => {} })}
        />
      </>
    );
  }

  // DASHBOARD
  const tabs: { key: AdminTab; label: string; icon: any }[] = [
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const unreadMessages = messages.filter(m => !m.isRead).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 text-cream/40 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"><ArrowLeft size={20} /></Link>
              <LayoutDashboard size={24} className="text-gold" />
              <div><h1 className="font-serif text-2xl sm:text-3xl text-cream">Admin Dashboard</h1><p className="text-cream/40 text-xs">Welcome, {userName}</p></div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {isAdmin && <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 text-gold rounded-lg text-[10px] uppercase tracking-wider"><Shield size={12} /> Full Access</span>}
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 border border-red-500/20 rounded-lg text-red-400/60 hover:border-red-500 hover:text-red-400 text-xs transition-all min-h-[44px]"><LogOut size={14} /> Logout</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(({ key, label, icon: I }) => (
              <button key={key} onClick={() => { setAdminTab(key); setSearch(''); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors min-h-[44px] whitespace-nowrap ${adminTab === key ? 'bg-gold/10 text-gold border border-gold/30' : 'text-cream/40 border border-gold/10 hover:text-cream/60'}`}>
                <I size={16} />{label}
                {key === 'messages' && unreadMessages > 0 && <span className="ml-1 px-1.5 py-0.5 bg-gold text-obsidian text-[10px] rounded-full font-bold">{unreadMessages}</span>}
                {key === 'orders' && pendingOrders > 0 && <span className="ml-1 px-1.5 py-0.5 bg-yellow-500 text-obsidian text-[10px] rounded-full font-bold">{pendingOrders}</span>}
              </button>
            ))}
            {adminTab === 'products' && isAdmin && (
              <button onClick={startCreate} className="ml-auto btn-gold rounded flex items-center gap-2 min-h-[44px]"><Plus size={16} /><span>Add Product</span></button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Products', val: products.length, color: 'text-gold' },
              { label: 'Orders', val: orders.length, color: 'text-blue-400' },
              { label: 'Users', val: users.length, color: 'text-green-400' },
              { label: 'Reviews', val: reviews.length, color: 'text-purple-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className="glass rounded-xl p-4">
                <p className="text-cream/40 text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-2xl font-serif ${color}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${adminTab}...`} className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]" />
            </div>
            {adminTab === 'orders' && orders.length > 0 && (
              <div className="flex items-center gap-2">
                <button onClick={exportOrdersToPDF} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 hover:border-red-500/40 text-xs transition-all min-h-[44px]">
                  <FileDown size={16} /> PDF
                </button>
                <button onClick={exportOrdersToExcel} className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 hover:border-green-500/40 text-xs transition-all min-h-[44px]">
                  <FileDown size={16} /> Excel
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" /></div>
          ) : (
            <>
              {/* PRODUCTS TAB */}
              {adminTab === 'products' && (
                products.length === 0 ? (
                  <div className="text-center py-20 glass rounded-2xl"><Package size={48} className="text-gold/20 mx-auto mb-4" /><h3 className="font-serif text-xl text-cream mb-2">No Products</h3>{isAdmin && <button onClick={startCreate} className="btn-gold rounded mt-4 min-h-[44px]"><span>Add Your First Product</span></button>}</div>
                ) : (
                  <div className="space-y-3">
                    {products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
                      <div key={p._id} className="glass rounded-xl overflow-hidden">
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-14 h-14 rounded-lg border border-gold/20 flex-shrink-0 overflow-hidden">{p.images && p.images.length > 0 ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: p.colorHex + '40' }}><div className="w-6 h-6 rounded-full border border-gold/40" style={{ backgroundColor: p.colorHex }} /></div>}</div>
                          <div className="flex-1 min-w-0"><h3 className="text-cream text-sm font-medium truncate">{p.name}</h3><p className="text-cream/40 text-xs mt-0.5">{p.priceFormatted}</p></div>
                          <span className={'px-2 py-1 rounded text-[10px] uppercase ' + (p.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>{p.isActive ? 'Active' : 'Off'}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(p)} className="flex items-center gap-1 px-3 py-2 border border-gold/20 rounded-lg text-cream/60 hover:border-gold hover:text-gold text-xs min-h-[44px]"><Edit3 size={14} /> Edit</button>
                            <button onClick={() => del(p._id)} className="p-2 text-cream/30 hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"><Trash2 size={14} /></button>
                            <Link href={'/product/' + p.slug} target="_blank" className="p-2 text-cream/30 hover:text-gold min-h-[44px] min-w-[44px] flex items-center justify-center"><Eye size={14} /></Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* ORDERS TAB */}
              {adminTab === 'orders' && (
                orders.length === 0 ? (
                  <div className="text-center py-20 glass rounded-2xl"><ShoppingCart size={48} className="text-gold/20 mx-auto mb-4" /><h3 className="font-serif text-xl text-cream mb-2">No Orders</h3><p className="text-cream/40 text-sm">Orders will appear here when customers place them.</p></div>
                ) : (
                  <div className="space-y-3">
                    {orders.filter(o => !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase())).map(o => (
                      <div key={o._id} className="glass rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center"><ShoppingCart size={16} className="text-blue-400" /></div>
                            <div><h4 className="text-cream text-sm font-medium">{o.customerName}</h4><p className="text-cream/40 text-xs">{o.customerEmail}</p></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gold font-serif text-sm">Rs. {o.totalAmount.toLocaleString()}</span>
                            <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)} className={`px-2 py-1 rounded text-[10px] uppercase ${STATUS_COLORS[o.status]} bg-transparent border border-current/20 min-h-[32px]`}>
                              {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="text-cream/30 text-xs">
                          {o.items.map((item, i) => <span key={i}>{item.name} x{item.quantity}{item.size ? ` (${item.size})` : ''}{i < o.items.length - 1 ? ', ' : ''}</span>)}
                          <span className="ml-2">| {o.shipping.city}</span>
                          <span className="ml-2">| {new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* USERS TAB */}
              {adminTab === 'users' && (
                users.length === 0 ? (
                  <div className="text-center py-20 glass rounded-2xl"><Users size={48} className="text-gold/20 mx-auto mb-4" /><h3 className="font-serif text-xl text-cream mb-2">No Users</h3></div>
                ) : (
                  <div className="space-y-2">
                    {users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
                      <div key={u._id} className="glass rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center"><Users size={16} className="text-green-400" /></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-cream text-sm font-medium">{u.name}</h4>
                          <p className="text-cream/40 text-xs">{u.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] uppercase ${u.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-cream/10 text-cream/50'}`}>{u.role}</span>
                        <span className="text-cream/30 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* REVIEWS TAB */}
              {adminTab === 'reviews' && (
                reviews.length === 0 ? (
                  <div className="text-center py-20 glass rounded-2xl"><Star size={48} className="text-gold/20 mx-auto mb-4" /><h3 className="font-serif text-xl text-cream mb-2">No Reviews</h3></div>
                ) : (
                  <div className="space-y-2">
                    {reviews.filter(r => !search || r.userName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase())).map(r => (
                      <div key={r._id} className="glass rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center"><Star size={16} className="text-purple-400" /></div>
                            <div><h4 className="text-cream text-sm font-medium">{r.userName}</h4></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= r.rating ? 'fill-gold text-gold' : 'text-gold/30'} />)}</div>
                            <span className="text-cream/30 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {r.comment && <p className="text-cream/50 text-sm">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* MESSAGES TAB */}
              {adminTab === 'messages' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-2">
                    {messages.length === 0 ? (
                      <div className="text-center py-20 glass rounded-2xl"><MessageSquare size={48} className="text-gold/20 mx-auto mb-4" /><h3 className="font-serif text-xl text-cream mb-2">No Messages</h3></div>
                    ) : (
                      messages.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())).map(m => (
                        <Link key={m._id} href="/admin/messages" className={`block w-full text-left glass rounded-xl p-4 transition-colors hover:border-gold/30 ${!m.isRead ? 'border-l-2 border-l-gold' : ''}`}>
                          <div className="flex items-start justify-between mb-1"><h4 className="text-cream text-sm font-medium truncate">{m.name}</h4>{!m.isRead && <span className="w-2 h-2 bg-gold rounded-full shrink-0 mt-1.5" />}</div>
                          <p className="text-cream/30 text-xs truncate mt-1">{m.message}</p>
                        </Link>
                      ))
                    )}
                  </div>
                  <div className="lg:col-span-2">
                    <div className="glass rounded-2xl p-12 text-center"><MessageSquare size={48} className="text-gold/20 mx-auto mb-4" /><h3 className="font-serif text-xl text-cream mb-2">View Full Messages</h3><p className="text-cream/40 text-sm mb-4">Click a message or go to the full messages page.</p><Link href="/admin/messages" className="btn-gold rounded inline-flex items-center gap-2 min-h-[44px]"><MessageSquare size={16} /><span>Open Messages</span></Link></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Delete"
        variant={confirmState.variant}
        onConfirm={() => { confirmState.onConfirm(); setConfirmState(prev => ({ ...prev, open: false })); }}
        onCancel={() => setConfirmState(prev => ({ ...prev, open: false }))}
      />
      <ConfirmModal
        open={alertState.open}
        title={alertState.title}
        message={alertState.message}
        confirmText="OK"
        cancelText="Close"
        variant="info"
        onConfirm={() => setAlertState({ open: false, title: '', message: '' })}
        onCancel={() => setAlertState({ open: false, title: '', message: '' })}
      />
      <PromptModal
        open={promptState.open}
        title="Enter Size"
        placeholder={'e.g. 32"'}
        onConfirm={(value) => { promptState.onConfirm(value); setPromptState({ open: false, onConfirm: () => {} }); }}
        onCancel={() => setPromptState({ open: false, onConfirm: () => {} })}
      />
    </>
  );
}
