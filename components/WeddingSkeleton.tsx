'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function WeddingSkeleton() {
  return (
    <motion.div
      className="wedding-skeleton-screen"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        filter: 'blur(8px)',
        transition: { duration: 0.55, ease: [0.77, 0, 0.175, 1] },
      }}
      aria-label="Loading wedding invitation..."
      role="status"
    >
      {/* Background ambient radial glow */}
      <div className="skeleton-backdrop" aria-hidden="true" />

      {/* Elegant Preloader Center Stage with Botanical Monogram Logo */}
      <div className="preloader-luxury-stage">
        <div className="preloader-logo-halo">
          <span className="preloader-ring preloader-ring-outer" />
          <span className="preloader-ring preloader-ring-inner" />
          <img
            src="/images/logo-crest-sm.png"
            alt="Gimasha & Chathura Crest"
            className="preloader-logo-img"
            decoding="async"
          />
        </div>

        <div className="preloader-couple-names">
          Gimasha <span>&amp;</span> Chathura
        </div>

        <div className="preloader-date-sub">DECEMBER 03, 2026</div>

        {/* Shimmering Gold Progress Bar */}
        <div className="preloader-progress-track">
          <div className="preloader-progress-bar shimmer-gold-accent" />
        </div>

        {/* Loading Status */}
        <div className="skeleton-loading-status">
          <Sparkles size={13} className="skeleton-sparkle-spin" />
          <span>Preparing Your Invitation...</span>
          <Sparkles size={13} className="skeleton-sparkle-spin" />
        </div>
      </div>
    </motion.div>
  );
}
