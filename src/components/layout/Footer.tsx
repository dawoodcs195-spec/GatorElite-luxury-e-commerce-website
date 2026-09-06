import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/gator_elite_belts', icon: Instagram },
  { label: 'Twitter', href: 'https://www.instagram.com/gator_elite_belts', icon: Twitter },
  { label: 'Facebook', href: 'https://www.instagram.com/gator_elite_belts', icon: Facebook },
  { label: 'Email', href: 'mailto:dawood.cs195@gmail.com', icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative" role="contentinfo">
      {/* Gradient transition from page to black footer */}
      <div className="h-24 bg-gradient-to-b from-transparent to-[#0A0A0A]" aria-hidden="true" />
      
      {/* Black footer with brown accent */}
      <div className="bg-[#0A0A0A] relative">
        {/* Top brown accent line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#5C3A21] to-transparent" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#5C3A21]/60">
                  <Image
                    src="/logo.jpeg"
                    alt="GatorÉlite logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-serif text-xl tracking-wider text-[#F5EDE0]">
                  Gator<span className="text-[#C9A96E]">Élite</span>
                </span>
              </div>
              <p className="text-[#A68B6B] text-sm leading-relaxed max-w-sm mb-6">
                Handcrafted premium crocodile leather belts, sourced sustainably and finished by master artisans. Each piece is a testament to uncompromising luxury.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-full border border-[#5C3A21]/40 flex items-center justify-center text-[#A68B6B] hover:text-[#C9A96E] hover:border-[#C9A96E]/40 hover:bg-[#C9A96E]/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-serif text-[#C9A96E] text-sm tracking-widest uppercase mb-4">Explore</h4>
              <nav aria-label="Footer navigation">
                <ul className="flex flex-col gap-3 list-none">
                  <li><Link href="/" className="text-[#A68B6B] text-sm hover:text-[#C9A96E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 rounded px-1 py-0.5 min-h-[44px] inline-flex items-center">Home</Link></li>
                  <li><Link href="/shop" className="text-[#A68B6B] text-sm hover:text-[#C9A96E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 rounded px-1 py-0.5 min-h-[44px] inline-flex items-center">Shop</Link></li>
                  <li><Link href="/story" className="text-[#A68B6B] text-sm hover:text-[#C9A96E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 rounded px-1 py-0.5 min-h-[44px] inline-flex items-center">Our Story</Link></li>
                  <li><Link href="/contact" className="text-[#A68B6B] text-sm hover:text-[#C9A96E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 rounded px-1 py-0.5 min-h-[44px] inline-flex items-center">Contact</Link></li>
                  <li><Link href="/admin" className="text-[#A68B6B] text-sm hover:text-[#C9A96E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 rounded px-1 py-0.5 min-h-[44px] inline-flex items-center">Admin</Link></li>
                </ul>
              </nav>
            </div>
            <div>
              <h4 className="font-serif text-[#C9A96E] text-sm tracking-widest uppercase mb-4">Certification</h4>
              <ul className="text-[#A68B6B] text-sm leading-relaxed list-none space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A96E] text-xs">✦</span> CITES Certified
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A96E] text-xs">✦</span> Sustainable Sourcing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A96E] text-xs">✦</span> Lifetime Warranty
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A96E] text-xs">✦</span> Artisan Crafted
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom divider with brown gradient */}
          <div className="my-12 h-[1px] bg-gradient-to-r from-transparent via-[#5C3A21]/50 to-transparent" aria-hidden="true" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#6B5240] text-xs tracking-wider">&copy; {new Date().getFullYear()} GatorÉlite. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-[#6B5240] text-xs hover:text-[#C9A96E] transition-colors">Privacy Policy</Link>
              <span className="text-[#5C4A3A] text-xs">·</span>
              <Link href="/terms" className="text-[#6B5240] text-xs hover:text-[#C9A96E] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
