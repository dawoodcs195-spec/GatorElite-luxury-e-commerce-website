'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Share2, Ruler, User } from 'lucide-react';
import StarRating, { RatingBar } from '@/components/products/StarRating';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SizeSelector from '@/components/products/SizeSelector';
import AccordionSpecs from '@/components/products/AccordionSpecs';
import Viewer360 from '@/components/products/Viewer360';
import SizeGuideModal from '@/components/products/SizeGuideModal';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { useCartStore } from '@/store/cartStore';
import { SPRING } from '@/lib/motion';
import { PRODUCTS as LOCAL_PRODUCTS } from '@/data/products';

interface DBProduct {
  _id: string;
  name: string;
  slug: string;
  subtitle: string;
  price: number;
  priceFormatted: string;
  rating: number;
  reviewCount: number;
  material: string;
  lining: string;
  mechanism: string;
  packaging: string;
  description: string;
  features: string[];
  sizes: string[];
  colorName: string;
  colorHex: string;
  bgColor: string;
  images: string[];
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reviewStats, setReviewStats] = useState({ total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [reviews, setReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const shouldReduceMotion = useReducedMotion();

  // Check auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setIsAuthenticated(d.authenticated))
      .catch(() => {});
  }, []);

  // Fetch reviews
  useEffect(() => {
    if (!product?._id) return;
    fetch('/api/reviews?productId=' + product._id)
      .then(r => r.json())
      .then(d => {
        if (d.stats) setReviewStats(d.stats);
        if (d.reviews) setReviews(d.reviews);
      })
      .catch(() => {});
  }, [product?._id]);

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch('/api/products?slug=' + slug)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setProduct(d);
          setLoading(false);
          return;
        }
        // Fallback to local static data if API product not found
        const local = LOCAL_PRODUCTS.find(p => p.slug === slug || p.name.toLowerCase().includes(slug.toLowerCase().replace(/-/g, ' ')));
        if (local) {
          setProduct({
            _id: local.id,
            name: local.name,
            slug: local.slug,
            subtitle: local.subtitle,
            price: local.price,
            priceFormatted: local.priceFormatted,
            rating: local.rating,
            reviewCount: local.reviewCount,
            material: local.material,
            lining: local.lining,
            mechanism: local.mechanism,
            packaging: local.packaging,
            description: local.description,
            features: local.features,
            sizes: local.sizes,
            colorName: local.colors[0]?.name || '',
            colorHex: local.colors[0]?.hex || '#0A0A0A',
            bgColor: local.colors[0]?.bgMode || 'onyx',
            images: [],
          });
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local static data on network error
        const local = LOCAL_PRODUCTS.find(p => p.slug === slug || p.name.toLowerCase().includes(slug.toLowerCase().replace(/-/g, ' ')));
        if (local) {
          setProduct({
            _id: local.id,
            name: local.name,
            slug: local.slug,
            subtitle: local.subtitle,
            price: local.price,
            priceFormatted: local.priceFormatted,
            rating: local.rating,
            reviewCount: local.reviewCount,
            material: local.material,
            lining: local.lining,
            mechanism: local.mechanism,
            packaging: local.packaging,
            description: local.description,
            features: local.features,
            sizes: local.sizes,
            colorName: local.colors[0]?.name || '',
            colorHex: local.colors[0]?.hex || '#0A0A0A',
            bgColor: local.colors[0]?.bgMode || 'onyx',
            images: [],
          });
        }
        setLoading(false);
      });
  }, [slug]);

  function handleAddToCart() {
    if (!product) return;
    if (!selectedSize) { setToast('Please select a size'); setTimeout(() => setToast(null), 3000); return; }
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      priceFormatted: product.priceFormatted,
      color: product.colorName,
      colorSlug: product.slug,
      size: selectedSize,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy to-obsidian">
          <div className="text-center">
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full mx-auto"
            />
            <p className="text-cream/30 text-sm mt-4">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy to-obsidian">
          <div className="text-center">
            <h1 className="font-serif text-3xl text-cream mb-4">Product Not Found</h1>
            <a href="/" className="btn-gold rounded inline-block min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50"><span>Go Home</span></a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const specs = [
    { label: 'Material', value: product.material || 'N/A' },
    { label: 'Lining', value: product.lining || 'N/A' },
    { label: 'Mechanism', value: product.mechanism || 'N/A' },
    { label: 'Packaging', value: product.packaging || 'N/A' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-gradient)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Viewer360
                images={product.images || []}
                colorHex={product.colorHex}
                productName={product.name}
              />
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Rating */}
              <motion.div
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <StarRating
                  rating={reviewStats.average || product.rating}
                  totalReviews={reviewStats.total || product.reviewCount}
                  size="md"
                />
              </motion.div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream mb-2">{product.name}</h1>
              <p className="text-cream/40 text-sm mb-6">{product.subtitle}</p>

              <motion.p
                className="text-gold font-serif text-2xl sm:text-3xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...SPRING }}
              >
                {product.priceFormatted}
              </motion.p>

              {/* Color badge */}
              <div className="mb-6">
                <p className="text-cream/60 text-sm mb-3">Color</p>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full border-2 border-gold"
                    style={{ backgroundColor: product.colorHex }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    transition={SPRING}
                  />
                  <span className="text-cream/60 text-sm">{product.colorName}</span>
                </div>
              </div>

              {/* Size selector with size guide button */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-cream/60 text-sm">Size</p>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1.5 text-gold/70 hover:text-gold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded px-2 py-1 min-h-[44px]"
                    aria-label="Open size guide"
                  >
                    <Ruler size={14} />
                    <span>Size Guide</span>
                  </button>
                </div>
                <SizeSelector selectedSize={selectedSize} onSelect={setSelectedSize} />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  onClick={handleAddToCart}
                  className="btn-gold flex-1 rounded min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  transition={SPRING}
                >
                  <span>{addedToCart ? '✓ Added!' : 'Add to Cart'}</span>
                </motion.button>
                <motion.button
                  onClick={() => setLiked(!liked)}
                  className={'w-12 h-12 min-h-[44px] min-w-[44px] border rounded flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 ' + (liked ? 'border-gold text-gold' : 'border-gold/20 text-cream/40 hover:text-gold')}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                  transition={SPRING}
                  aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={18} className={liked ? 'fill-gold' : ''} />
                </motion.button>
                <motion.button
                  className="w-12 h-12 min-h-[44px] min-w-[44px] border border-gold/20 rounded flex items-center justify-center text-cream/40 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                  transition={SPRING}
                  aria-label="Share product"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>

              {/* WhatsApp concierge */}
              <div className="mb-8">
                <WhatsAppButton productName={product.name} variant="inline" />
              </div>

              {/* Specs accordion */}
              <AccordionSpecs specs={specs} />

              {/* Description */}
              {product.description && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-cream/60 text-sm mb-3">Description</p>
                  <p className="text-cream/50 text-sm leading-relaxed">{product.description}</p>
                </motion.div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <p className="text-cream/60 text-sm mb-3">Features</p>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, ...SPRING }}
                        className="flex items-start gap-3 text-cream/40 text-sm"
                      >
                        <span className="text-gold">✦</span>{f}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 border-t border-gold/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <h3 className="font-serif text-xl sm:text-2xl text-cream mb-6">Customer Reviews</h3>
                <div className="glass rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <p className="text-5xl font-serif text-cream mb-2">
                      {reviewStats.average > 0 ? reviewStats.average.toFixed(1) : '—'}
                    </p>
                    <StarRating rating={reviewStats.average} size="md" />
                    <p className="text-cream/40 text-sm mt-2">
                      {reviewStats.total} review{reviewStats.total !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <RatingBar
                        key={star}
                        star={star}
                        count={reviewStats.distribution[star as keyof typeof reviewStats.distribution]}
                        total={reviewStats.total}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review List + Form */}
              <div className="lg:col-span-2">
                {/* Write a Review */}
                <div className="glass rounded-2xl p-6 mb-6">
                  <h4 className="font-serif text-lg text-cream mb-4">Write a Review</h4>
                  
                  {!isAuthenticated ? (
                    /* Login prompt for non-authenticated users */
                    <div className="text-center py-6">
                      <User size={32} className="text-gold/40 mx-auto mb-3" />
                      <p className="text-cream/50 text-sm mb-4">Sign in to share your review</p>
                      <a href="/login" className="btn-gold rounded inline-block min-h-[44px]">
                        <span>Sign In</span>
                      </a>
                    </div>
                  ) : (
                    /* Review form for authenticated users */
                    <>
                      <div className="mb-4">
                        <p className="text-cream/50 text-sm mb-2">Your Rating</p>
                        <StarRating
                          rating={userRating}
                          interactive
                          onRate={setUserRating}
                          size="lg"
                        />
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm resize-none h-24 focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                      />
                  {reviewError && (
                    <p className="text-red-400 text-xs mt-2">{reviewError}</p>
                  )}
                  <button
                    onClick={async () => {
                      if (!userRating) {
                        setReviewError('Please select a rating');
                        return;
                      }
                      setSubmittingReview(true);
                      setReviewError('');
                      try {
                        const res = await fetch('/api/reviews', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            productId: product!._id,
                            rating: userRating,
                            comment: reviewComment,
                          }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setUserRating(0);
                          setReviewComment('');
                          // Refresh reviews
                          const rRes = await fetch('/api/reviews?productId=' + product!._id);
                          const rData = await rRes.json();
                          if (rData.stats) setReviewStats(rData.stats);
                          if (rData.reviews) setReviews(rData.reviews);
                        } else {
                          setReviewError(data.error || 'Failed to submit review');
                        }
                      } catch {
                        setReviewError('Failed to submit review');
                      }
                      setSubmittingReview(false);
                    }}
                    disabled={submittingReview || !userRating}
                    className="btn-gold rounded mt-4 min-h-[44px] disabled:opacity-40"
                  >
                    <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                    </>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-cream/30 text-sm text-center py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="glass rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                              <span className="text-gold text-xs font-medium">
                                {review.userName?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="text-cream text-sm font-medium">{review.userName}</p>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                          </div>
                          <span className="text-cream/30 text-xs">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-cream/50 text-sm leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      {toast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto glass rounded-xl px-6 py-4 shadow-2xl border border-gold/20 flex items-center gap-3 max-w-sm animate-in fade-in zoom-in duration-200">
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-cream text-sm font-medium">{toast}</p>
          </div>
        </div>
      )}
    </>
  );
}
