'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User, LogOut, Shield, Sun, Moon, ShoppingCart } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCartStore } from '@/store/cartStore';
import CartDrawer from './CartDrawer';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const { theme, toggleTheme } = useTheme();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check auth state
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y < 10) {
        setHidden(false);
      } else if (y > lastScrollY.current + 5) {
        setHidden(true);
      } else if (y < lastScrollY.current - 5) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
      if (userMenuOpen) {
        setUserMenuOpen(false);
      }
    }
  }, [mobileOpen, userMenuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Trap focus in mobile menu
  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return;
    const focusable = mobileMenuRef.current.querySelectorAll('a, button');
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }
  }, [mobileOpen]);

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setUserMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Navigation links based on role
  const getNavLinks = () => {
    const links = [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Story', href: '/story' },
      { label: 'Contact', href: '/contact' },
    ];

    // Add Admin link only for admin users
    if (user?.role === 'admin') {
      links.splice(2, 0, { label: 'Admin', href: '/admin' });
    }

    return links;
  };

  const NAV_LINKS = getNavLinks();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? 'glass py-3' : 'bg-transparent py-3 sm:py-5'} ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            scroll={false}
            className="flex items-center gap-2 sm:gap-3 group min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded"
            aria-label="GatorÉlite — Home"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gold/40 group-hover:border-gold transition-colors">
              <Image
                src="/logo.jpeg"
                alt="GatorÉlite logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-serif text-lg sm:text-xl tracking-wider text-cream hidden sm:block">
              Gator<span className="text-gold">Élite</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 min-h-[44px] inline-flex items-center focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded px-2 py-1 ${pathname === link.href ? 'text-gold' : 'text-cream/60 hover:text-gold'}`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile nav links — shown inline on phone */}
          <nav className="flex md:hidden items-center gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                onClick={() => setMobileOpen(false)}
                className={`text-[11px] tracking-wider uppercase transition-colors duration-300 min-h-[36px] inline-flex items-center focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded px-1.5 py-1 ${pathname === link.href ? 'text-gold' : 'text-cream/60 hover:text-gold'}`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle — desktop only */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2 min-h-[44px] min-w-[44px] items-center justify-center text-cream/70 hover:text-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 rounded"
              style={{ '--tw-ring-offset-color': 'var(--bg-primary)' } as React.CSSProperties}
              aria-label={`Switch to ${theme === 'dark' ? 'Espresso Brown' : 'Onyx Black'} theme`}
            >
              {theme === 'dark' ? (
                <Sun size={20} strokeWidth={1.5} className="transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon size={20} strokeWidth={1.5} className="transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Cart — desktop only */}
            <button
              onClick={toggleCart}
              className="hidden md:flex relative p-2 min-h-[44px] min-w-[44px] items-center justify-center text-cream/70 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded"
              aria-label={`Shopping cart${totalItems() > 0 ? `, ${totalItems()} items` : ''}`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems() > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-gold text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
                  {totalItems()}
                </span>
              )}
            </button>

            {/* Auth buttons — desktop only */}
            {!loading && (
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 min-h-[44px] rounded-lg hover:bg-gold/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        {user.avatar ? (
                          <Image src={user.avatar} alt="" width={32} height={32} className="rounded-full" />
                        ) : (
                          <User size={16} className="text-gold" />
                        )}
                      </div>
                      <span className="text-cream/60 text-sm">{user.name.split(' ')[0]}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl py-2 shadow-xl">
                        <div className="px-4 py-2 border-b border-gold/10">
                          <p className="text-cream text-sm font-medium truncate">{user.name}</p>
                          <p className="text-cream/40 text-xs truncate">{user.email}</p>
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-gold/10 text-gold">
                            {user.role === 'admin' && <Shield size={10} />}
                            {user.role}
                          </span>
                        </div>
                        <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-cream/60 hover:text-gold hover:bg-gold/5 transition-colors min-h-[44px]">
                          <ShoppingCart size={14} />
                          <span className="text-sm">My Orders</span>
                        </Link>
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-cream/60 hover:text-gold hover:bg-gold/5 transition-colors min-h-[44px]">
                          <User size={14} />
                          <span className="text-sm">Profile</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gold hover:bg-gold/5 transition-colors min-h-[44px]">
                            <Shield size={14} />
                            <span className="text-sm">Admin Dashboard</span>
                          </Link>
                        )}
                        <div className="border-t border-gold/10 mt-1 pt-1">
                          <Link href="/privacy" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-cream/40 hover:text-cream/60 text-xs transition-colors min-h-[44px]">Privacy Policy</Link>
                          <Link href="/terms" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-cream/40 hover:text-cream/60 text-xs transition-colors min-h-[44px]">Terms of Service</Link>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors min-h-[44px]">
                          <LogOut size={14} />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2 text-cream/60 hover:text-gold text-sm transition-colors min-h-[44px] inline-flex items-center">Sign In</Link>
                    <Link href="/signup" className="btn-gold rounded text-xs min-h-[44px] inline-flex items-center"><span>Join Élite</span></Link>
                  </>
                )}
              </div>
            )}

            {/* Mobile hamburger button */}
            <button
              ref={menuButtonRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-cream/70 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu — cart, theme, auth */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className="md:hidden glass mt-2 mx-4 rounded-lg p-5"
            role="navigation"
            aria-label="Mobile menu"
          >
            <div className="flex flex-col gap-3">
              {/* Cart button */}
              <button
                onClick={() => { toggleCart(); setMobileOpen(false); }}
                className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors min-h-[44px] w-full text-left"
              >
                <ShoppingBag size={18} />
                <span className="text-sm">Cart</span>
                {totalItems() > 0 && (
                  <span className="ml-auto bg-gold text-obsidian text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalItems()}</span>
                )}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors min-h-[44px] w-full text-left"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span className="text-sm">{theme === 'dark' ? 'Espresso Brown Theme' : 'Onyx Black Theme'}</span>
              </button>

              <div className="h-px bg-gold/10 my-1" />

              {/* Auth */}
              {!loading && (
                user ? (
                  <>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors min-h-[44px]">
                      <User size={18} />
                      <span className="text-sm">Profile</span>
                    </Link>
                    <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors min-h-[44px]">
                      <ShoppingCart size={18} />
                      <span className="text-sm">My Orders</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-gold hover:text-gold/80 transition-colors min-h-[44px]">
                        <Shield size={18} />
                        <span className="text-sm">Admin Dashboard</span>
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-3 text-red-400/60 hover:text-red-400 transition-colors min-h-[44px] w-full text-left">
                      <LogOut size={18} />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors min-h-[44px]">
                      <User size={18} />
                      <span className="text-sm">Sign In</span>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-gold rounded text-center mt-1 min-h-[44px] flex items-center justify-center">
                      <span>Join Élite</span>
                    </Link>
                  </>
                )
              )}

              <div className="h-px bg-gold/10 my-1" />

              {/* Legal links */}
              <div className="flex items-center gap-3 text-cream/30 text-xs">
                <Link href="/privacy" onClick={() => setMobileOpen(false)} className="hover:text-cream/50 transition-colors">Privacy</Link>
                <span>·</span>
                <Link href="/terms" onClick={() => setMobileOpen(false)} className="hover:text-cream/50 transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
