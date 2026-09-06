import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { createErrorResponse, getErrorMessage } from '@/lib/errors';

const products = [
  {
    name: "GatorElite Belt - Onyx Black",
    slug: "onyx-black",
    subtitle: "Premium Crocodile Leather Belt",
    price: 29000,
    priceFormatted: "Rs. 29,000",
    rating: 5.0,
    reviewCount: 48,
    material: "Genuine Crocodile Belly Cut",
    lining: "Full-Grain Calfskin",
    mechanism: "Ratchet Micro-Adjust Track",
    packaging: "Matte Black Rigid Gift Box + Dust Bag",
    description: "Handcrafted from the finest crocodile belly leather. The Onyx Black features a deep, rich black finish that exudes sophistication.",
    features: [
      "Hand-dyed using artisanal vegetable tanning",
      "Solid brass buckle with anti-tarnish coating",
      "Ratchet micro-adjust track for perfect fit",
      "Edge-burnished by hand",
      "CITES certified sustainable sourcing",
      "Lifetime craftsmanship warranty"
    ],
    sizes: ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'],
    colorName: "Onyx Black",
    colorHex: "#0A0A0A",
    bgColor: "onyx",
    images: ["/1.png", "/2.png", "/3.png", "/4.png"],
    isActive: true,
  },
  {
    name: "GatorElite Belt - Midnight Navy",
    slug: "midnight-navy",
    subtitle: "Premium Crocodile Leather Belt",
    price: 29000,
    priceFormatted: "Rs. 29,000",
    rating: 5.0,
    reviewCount: 48,
    material: "Genuine Crocodile Belly Cut",
    lining: "Full-Grain Calfskin",
    mechanism: "Ratchet Micro-Adjust Track",
    packaging: "Matte Black Rigid Gift Box + Dust Bag",
    description: "Handcrafted from the finest crocodile belly leather. The Midnight Navy offers a refined alternative to traditional black.",
    features: [
      "Hand-dyed using artisanal vegetable tanning",
      "Solid brass buckle with anti-tarnish coating",
      "Ratchet micro-adjust track for perfect fit",
      "Edge-burnished by hand",
      "CITES certified sustainable sourcing",
      "Lifetime craftsmanship warranty"
    ],
    sizes: ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'],
    colorName: "Midnight Navy",
    colorHex: "#080D1A",
    bgColor: "navy",
    images: ["/5.png", "/6.png", "/1.png", "/2.png"],
    isActive: true,
  },
  {
    name: "GatorElite Belt - Espresso Brown",
    slug: "espresso-brown",
    subtitle: "Premium Crocodile Leather Belt",
    price: 29000,
    priceFormatted: "Rs. 29,000",
    rating: 5.0,
    reviewCount: 48,
    material: "Genuine Crocodile Belly Cut",
    lining: "Full-Grain Calfskin",
    mechanism: "Ratchet Micro-Adjust Track",
    packaging: "Matte Black Rigid Gift Box + Dust Bag",
    description: "Handcrafted from the finest crocodile belly leather. The Espresso Brown showcases the natural beauty of the leather.",
    features: [
      "Hand-dyed using artisanal vegetable tanning",
      "Solid brass buckle with anti-tarnish coating",
      "Ratchet micro-adjust track for perfect fit",
      "Edge-burnished by hand",
      "CITES certified sustainable sourcing",
      "Lifetime craftsmanship warranty"
    ],
    sizes: ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'],
    colorName: "Espresso Brown",
    colorHex: "#120A07",
    bgColor: "espresso",
    images: ["/3.png", "/4.png", "/5.png", "/6.png"],
    isActive: true,
  },
  {
    name: "GatorElite Belt - Cognac Gold",
    slug: "cognac-gold",
    subtitle: "Premium Crocodile Leather Belt",
    price: 29000,
    priceFormatted: "Rs. 29,000",
    rating: 5.0,
    reviewCount: 48,
    material: "Genuine Crocodile Belly Cut",
    lining: "Full-Grain Calfskin",
    mechanism: "Ratchet Micro-Adjust Track",
    packaging: "Matte Black Rigid Gift Box + Dust Bag",
    description: "Handcrafted from the finest crocodile belly leather. The Cognac Gold is our signature warm tone.",
    features: [
      "Hand-dyed using artisanal vegetable tanning",
      "Solid brass buckle with anti-tarnish coating",
      "Ratchet micro-adjust track for perfect fit",
      "Edge-burnished by hand",
      "CITES certified sustainable sourcing",
      "Lifetime craftsmanship warranty"
    ],
    sizes: ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'],
    colorName: "Cognac Gold",
    colorHex: "#181008",
    bgColor: "cognac",
    images: ["/1.png", "/3.png", "/5.png", "/logo.jpeg"],
    isActive: true,
  },
];

export async function POST() {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    return NextResponse.json({ success: true, count: products.length });
  } catch (e) {
    return createErrorResponse(e, getErrorMessage(e));
  }
}
