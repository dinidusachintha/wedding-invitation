'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function WeddingSkeleton() {
  return (
    <motion.div
      className="wedding-skeleton-screen"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: 'blur(8px)',
        transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] },
      }}
      aria-label="Loading wedding invitation..."
      role="status"
    >
      {/* Background ambient radial glow */}
      <div className="skeleton-backdrop" aria-hidden="true" />

      {/* Main Luxury Stationery Skeleton Card */}
      <div className="skeleton-stationery-card">
        {/* Shimmering Corner Flourishes */}
        <div className="skeleton-corner skeleton-corner-tl" />
        <div className="skeleton-corner skeleton-corner-tr" />
        <div className="skeleton-corner skeleton-corner-bl" />
        <div className="skeleton-corner skeleton-corner-br" />

        {/* Shimmering Top Crowning Arch */}
        <div className="skeleton-crown-arch shimmer-gold" />

        {/* Eyebrow placeholder */}
        <div className="skeleton-line skeleton-eyebrow shimmer-gold" />

        {/* Couple Names Shimmer */}
        <div className="skeleton-title-wrap">
          <div className="skeleton-line skeleton-title-main shimmer-gold" />
          <div className="skeleton-ampersand">
            <Heart size={16} className="skeleton-heart-pulse" />
          </div>
          <div className="skeleton-line skeleton-title-sub shimmer-gold" />
        </div>

        {/* Date badge placeholder */}
        <div className="skeleton-line skeleton-date-pill shimmer-gold" />

        {/* Center Couple Illustration Placeholder */}
        <div className="skeleton-illustration-halo">
          <div className="skeleton-illustration-disc shimmer-gold" />
        </div>

        {/* 4 Shimmering Countdown Timer Boxes */}
        <div className="skeleton-countdown-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-timer-box shimmer-gold">
              <div className="skeleton-box-digit shimmer-gold-accent" />
              <div className="skeleton-box-label shimmer-gold-accent" />
            </div>
          ))}
        </div>

        {/* Button Placeholder */}
        <div className="skeleton-btn-pill shimmer-gold">
          <div className="skeleton-btn-inner shimmer-gold-accent" />
        </div>

        {/* Loading Message */}
        <div className="skeleton-loading-status">
          <Sparkles size={14} className="skeleton-sparkle-spin" />
          <span>Preparing Your Invitation...</span>
          <Sparkles size={14} className="skeleton-sparkle-spin" />
        </div>
      </div>
    </motion.div>
  );
}
