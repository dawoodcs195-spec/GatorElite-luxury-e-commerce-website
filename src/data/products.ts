export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  priceFormatted: string;
  rating: number;
  reviewCount: number;
  colors: ColorOption[];
  sizes: string[];
  material: string;
  lining: string;
  mechanism: string;
  packaging: string;
  description: string;
  features: string[];
}

export interface ColorOption {
  name: string;
  hex: string;
  slug: string;
  bgMode: string;
}

export const COLORS: ColorOption[] = [
  { name: 'Onyx Black', hex: '#0A0A0A', slug: 'onyx-black', bgMode: 'onyx' },
  { name: 'Midnight Navy', hex: '#080D1A', slug: 'midnight-navy', bgMode: 'navy' },
  { name: 'Espresso Brown', hex: '#120A07', slug: 'espresso-brown', bgMode: 'espresso' },
  { name: 'Cognac Gold', hex: '#181008', slug: 'cognac-gold', bgMode: 'cognac' },
];

export const SIZES = ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'];

export const PRODUCTS: Product[] = COLORS.map((color) => ({
  id: color.slug,
  slug: color.slug,
  name: `GatorÉlite Belt — ${color.name}`,
  subtitle: 'Premium Crocodile Leather Belt',
  price: 29000,
  priceFormatted: 'Rs. 29,000',
  rating: 5.0,
  reviewCount: 48,
  colors: COLORS,
  sizes: SIZES,
  material: 'Genuine Crocodile Belly Cut',
  lining: 'Full-Grain Calfskin',
  mechanism: 'Ratchet Micro-Adjust Track',
  packaging: 'Matte Black Rigid Gift Box + Dust Bag',
  description: `The GatorÉlite ${color.name} belt is handcrafted from the finest crocodile belly leather, featuring a precision-engineered automatic ratchet mechanism. Each belt undergoes a meticulous 47-step hand-finishing process, ensuring unmatched quality and an unmistakable presence.`,
  features: [
    'Hand-dyed using artisanal vegetable tanning',
    'Solid brass buckle with anti-tarnish coating',
    'Ratchet micro-adjust track for perfect fit',
    'Edge-burnished by hand for smooth finish',
    'CITES certified sustainable sourcing',
    'Lifetime craftsmanship warranty',
  ],
}));

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
