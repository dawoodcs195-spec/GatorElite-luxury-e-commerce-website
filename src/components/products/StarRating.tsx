'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  rating,
  totalReviews = 0,
  interactive = false,
  onRate,
  size = 'sm',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform focus:outline-none`}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= displayRating
                  ? 'fill-gold text-gold'
                  : 'fill-none text-gold/30'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {totalReviews > 0 && (
        <span className="text-cream/40 text-xs">
          ({totalReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}

// ─── Rating Distribution Bar ────────────────────────────────────────────────

interface RatingBarProps {
  star: number;
  count: number;
  total: number;
}

export function RatingBar({ star, count, total }: RatingBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-cream/50 w-4 text-right">{star}</span>
      <Star className="w-3 h-3 fill-gold text-gold" />
      <div className="flex-1 h-1.5 bg-gold/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-cream/40 w-8 text-right">{count}</span>
    </div>
  );
}
