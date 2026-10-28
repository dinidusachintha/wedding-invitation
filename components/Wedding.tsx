'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  CalendarDays,
  Clock3,
  MapPin,
  Heart,
  Send,
  Check,
  X,
  Phone,
  ArrowDown,
  Flower2,
  Navigation,
  Sparkles,
  Volume2,
  VolumeX,
  Home,
  Mail,
  Building2,
  Trees,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import BackgroundAnimation from './BackgroundAnimation';

type Guest = { name: string; token: string; seats: number; status: string; attending_count: number };
const mapUrl = 'https://maps.app.goo.gl/gwr9NAbTvqUno7ePA?g_st=iw';

// Luxury Matching Cursor Effect (Champagne-Gold Gem Dot, 3D Crystal Ring & Subtle Gold Stardust Trail)
function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const trailContainerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let isPressed = false;
    let lastTrailTime = 0;
    let rafId = 0;

    const spawnSparkle = (x: number, y: number) => {
      const container = trailContainerRef.current;
      if (!container) return;
      const mote = document.createElement('span');
      mote.className = 'luxury-cursor-sparkle';
      const offsetX = (Math.random() - 0.5) * 14;
      const offsetY = (Math.random() - 0.5) * 14;
      mote.style.left = `${x + offsetX}px`;
      mote.style.top = `${y + offsetY}px`;
      container.appendChild(mote);
      window.setTimeout(() => {
        mote.remove();
      }, 650);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${isPressed ? 0.75 : isHovering ? 1.35 : 1})`;
      }
      const target = e.target as HTMLElement | null;
      isHovering = Boolean(
        target?.closest('a, button, [role="button"], select, textarea, input')
      );
      const now = performance.now();
      if (now - lastTrailTime > 48) {
        lastTrailTime = now;
        spawnSparkle(mouseX, mouseY);
      }
    };

    const onMouseDown = () => {
      isPressed = true;
    };

    const onMouseUp = () => {
      isPressed = false;
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        const scale = isPressed ? 0.86 : isHovering ? 1.42 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.classList.toggle('is-hovering', isHovering);
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="luxury-cursor-layer" aria-hidden="true">
      <div ref={trailContainerRef} className="luxury-cursor-trail" />
      <div ref={ringRef} className="luxury-cursor-ring" />
      <div ref={dotRef} className="luxury-cursor-dot" />
    </div>
  );
}

// Minimalist Botanical Flower Icon (Champagne Gold & Deep Slate)
function MinimalistBotanicalFlower({ size = 26, color = '#1a2836' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="16" cy="11.5" r="3.2" />
      <circle cx="16" cy="5.2" r="2.2" />
      <circle cx="16" cy="17.8" r="2.2" />
      <circle cx="9.7" cy="11.5" r="2.2" />
      <circle cx="22.3" cy="11.5" r="2.2" />
      <circle cx="11.5" cy="7" r="2.2" />
      <circle cx="20.5" cy="7" r="2.2" />
      <circle cx="11.5" cy="16" r="2.2" />
      <circle cx="20.5" cy="16" r="2.2" />
      <path d="M16 20v7.5" />
      <path d="M16 23.5c-2.4-0.8-3.8 0.5-3.8 1.8 1.4 0.2 3.2-0.8 3.8-1.8z" />
      <path d="M16 22c2.4-0.8 3.8 0.5 3.8 1.8-1.4 0.2-3.2-0.8-3.8-1.8z" />
    </svg>
  );
}

// Elegant Diamond Flourish divider with gold line art
function DiamondFlourish() {
  return (
    <div className="diamond-flourish" aria-hidden="true">
      <span className="diamond-line" />
      <span className="diamond-symbol">◇</span>
      <span className="diamond-line" />
    </div>
  );
}

// 1. Top Finial Flourish above "THE DETAILS"
function DetailsTopFlourish() {
  return (
    <svg
      width="240"
      height="30"
      viewBox="0 0 240 30"
      fill="none"
      className="details-top-flourish"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="detailsGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9e7828" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#c59b43" />
          <stop offset="50%" stopColor="#e5c87a" />
          <stop offset="75%" stopColor="#c59b43" />
          <stop offset="100%" stopColor="#9e7828" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M10 15H95M145 15H230"
        stroke="url(#detailsGoldGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M48 15L51 12L54 15L51 18Z" fill="#c59b43" />
      <path d="M192 15L189 12L186 15L189 18Z" fill="#c59b43" />
      <circle cx="10" cy="15" r="1.5" fill="#c59b43" />
      <circle cx="230" cy="15" r="1.5" fill="#c59b43" />
      <path
        d="M120 4C118 8.5 116.5 12.5 120 16.5C123.5 12.5 122 8.5 120 4Z"
        fill="url(#detailsGoldGrad)"
      />
      <path
        d="M120 15C116.5 15 111.5 13.2 111 9.5C110.5 7.5 112 6.5 113.8 7.8C116.2 9.5 118.2 12.2 120 15Z"
        fill="url(#detailsGoldGrad)"
      />
      <path
        d="M120 15C123.5 15 128.5 13.2 129 9.5C129.5 7.5 128 6.5 126.2 7.8C123.8 9.5 121.8 12.2 120 15Z"
        fill="url(#detailsGoldGrad)"
      />
      <circle cx="120" cy="19" r="1.5" fill="#c59b43" />
    </svg>
  );
}

// 2. Bottom Diamond Star Flourish below "THE DETAILS"
function DetailsBottomFlourish() {
  return (
    <svg
      width="34"
      height="18"
      viewBox="0 0 34 18"
      fill="none"
      className="details-bottom-flourish"
      aria-hidden="true"
    >
      <path d="M17 2L22 9L17 16L12 9Z" fill="#c59b43" />
      <circle cx="17" cy="9" r="1.5" fill="#fffdf9" />
      <circle cx="6" cy="9" r="1.2" fill="#c59b43" />
      <circle cx="28" cy="9" r="1.2" fill="#c59b43" />
      <path d="M2 9H6M28 9H32" stroke="#c59b43" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// 3. Delicate Scrolled Gold Divider under Date and Venue
function GoldScrollDivider() {
  return (
    <svg
      width="130"
      height="14"
      viewBox="0 0 130 14"
      fill="none"
      className="gold-scroll-divider"
      aria-hidden="true"
    >
      <path d="M10 7H48" stroke="#c59b43" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M82 7H120" stroke="#c59b43" strokeWidth="0.9" strokeLinecap="round" />
      <path
        d="M48 7C54 7 57 3 61 5C64 6.5 64 8 65 7C66 8 66 6.5 69 5C73 3 76 7 82 7"
        stroke="#c59b43"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="65" cy="7" r="1.6" fill="#c59b43" />
      <circle cx="10" cy="7" r="1" fill="#c59b43" />
      <circle cx="120" cy="7" r="1" fill="#c59b43" />
    </svg>
  );
}

// 3B. Miniature Scrolled Gold Divider for Feature Badges
function MiniGoldScrollDivider() {
  return (
    <svg
      width="70"
      height="10"
      viewBox="0 0 70 10"
      fill="none"
      className="location-mini-scroll-divider"
      aria-hidden="true"
    >
      <path d="M5 5H24" stroke="#c59b43" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M46 5H65" stroke="#c59b43" strokeWidth="0.8" strokeLinecap="round" />
      <path
        d="M24 5C28 5 30 2 32 3.5C34 4.5 34 5.5 35 5C36 5.5 36 4.5 38 3.5C40 2 42 5 46 5"
        stroke="#c59b43"
        strokeWidth="0.9"
        fill="none"
      />
      <circle cx="35" cy="5" r="1.2" fill="#c59b43" />
      <circle cx="5" cy="5" r="0.8" fill="#c59b43" />
      <circle cx="65" cy="5" r="0.8" fill="#c59b43" />
    </svg>
  );
}

// 4. Center Vertical Divider with Clover Motif
function VerticalCloverDivider() {
  return (
    <div className="details-vertical-divider" aria-hidden="true">
      <div className="divider-line-top" />
      <div className="divider-clover-motif">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="6" r="3.2" fill="#c59b43" />
          <circle cx="11" cy="16" r="3.2" fill="#c59b43" />
          <circle cx="6" cy="11" r="3.2" fill="#c59b43" />
          <circle cx="16" cy="11" r="3.2" fill="#c59b43" />
          <circle cx="11" cy="11" r="2.2" fill="#faf6ef" stroke="#c59b43" strokeWidth="1" />
          <circle cx="11" cy="11" r="1" fill="#c59b43" />
        </svg>
      </div>
      <div className="divider-line-bottom" />
    </div>
  );
}

// 5. Flanking Botanical Wreath Badge
function BotanicalBadge({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="botanical-badge-wrap">
      {/* Left Floral Leaves */}
      <svg
        className="badge-floral-wing wing-left"
        width="48"
        height="36"
        viewBox="0 0 48 36"
        fill="none"
        aria-hidden="true"
      >
        <path d="M42 22C34 18 24 16 12 24C16 16 26 12 40 16Z" fill="#527863" opacity="0.85" />
        <path d="M38 14C30 10 20 8 10 14C14 7 24 4 36 10Z" fill="#729780" opacity="0.75" />
        <path d="M44 26C38 26 30 29 24 35C26 28 32 23 42 23Z" fill="#3f614e" opacity="0.9" />
        <path d="M26 15C22 13 18 14 16 17C18 19 22 19 26 17Z" fill="#ffffff" />
        <path d="M32 21C28 20 25 22 24 25C26 26 30 25 33 23Z" fill="#fcf9f2" />
        <circle cx="14" cy="11" r="1.8" fill="#d4af37" />
        <circle cx="8" cy="17" r="1.5" fill="#c59b43" />
        <circle cx="20" cy="30" r="1.6" fill="#d4af37" />
      </svg>

      {/* Dark Forest Green Center Circle */}
      <div className="badge-center-disc">{icon}</div>

      {/* Right Floral Leaves */}
      <svg
        className="badge-floral-wing wing-right"
        width="48"
        height="36"
        viewBox="0 0 48 36"
        fill="none"
        aria-hidden="true"
      >
        <path d="M6 22C14 18 24 16 36 24C32 16 22 12 8 16Z" fill="#527863" opacity="0.85" />
        <path d="M10 14C18 10 28 8 38 14C34 7 24 4 12 10Z" fill="#729780" opacity="0.75" />
        <path d="M4 26C10 26 18 29 24 35C22 28 16 23 6 23Z" fill="#3f614e" opacity="0.9" />
        <path d="M22 15C26 13 30 14 32 17C30 19 26 19 22 17Z" fill="#ffffff" />
        <path d="M16 21C20 20 23 22 24 25C22 26 18 25 15 23Z" fill="#fcf9f2" />
        <circle cx="34" cy="11" r="1.8" fill="#d4af37" />
        <circle cx="40" cy="17" r="1.5" fill="#c59b43" />
        <circle cx="28" cy="30" r="1.6" fill="#d4af37" />
      </svg>
    </div>
  );
}

// 6. Luxury Card Top Crest Flourish
function CardTopCrest() {
  return (
    <svg
      width="76"
      height="28"
      viewBox="0 0 76 28"
      fill="none"
      className="card-top-crest"
      aria-hidden="true"
    >
      <path d="M38 4C35 12 28 14 20 12C28 11 32 8 38 4Z" fill="#c59b43" />
      <path d="M38 4C41 12 48 14 56 12C48 11 44 8 38 4Z" fill="#c59b43" />
      <path d="M22 14C17 12 11 14 9 19C14 17 20 18 22 14Z" fill="#c59b43" />
      <path d="M54 14C59 12 65 14 67 19C62 17 56 18 54 14Z" fill="#c59b43" />
      <circle cx="38" cy="18" r="2.2" fill="#c59b43" />
      <circle cx="31" cy="18" r="1.4" fill="#c59b43" />
      <circle cx="45" cy="18" r="1.4" fill="#c59b43" />
      <path d="M27 21C34 23 42 23 49 21" stroke="#c59b43" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// 7. Botanical Foliage Sprays for Groom & Bride Arched Cards
function ArchFoliageTL() {
  return (
    <svg
      width="140"
      height="130"
      viewBox="0 0 140 130"
      fill="none"
      className="arch-foliage-svg foliage-tl"
      aria-hidden="true"
    >
      <g opacity="0.95">
        <path d="M5 80C15 60 35 48 58 45C42 42 20 46 5 80Z" fill="#3f614e" />
        <path d="M12 95C25 78 48 68 72 68C52 62 30 68 12 95Z" fill="#527863" />
        <path d="M2 55C18 42 38 32 62 28C46 22 24 28 2 55Z" fill="#2d4a3b" />
        <path d="M35 32C48 20 68 15 88 12C72 10 52 14 35 32Z" fill="#5c846f" />
        <path d="M60 22C74 12 94 8 114 8C96 6 78 8 60 22Z" fill="#729780" />
        <circle cx="28" cy="46" r="8" fill="#ffffff" opacity="0.95" />
        <circle cx="28" cy="46" r="3" fill="#e5c87a" />
        <circle cx="50" cy="28" r="6" fill="#fcfbf7" opacity="0.9" />
        <circle cx="50" cy="28" r="2.2" fill="#d4af37" />
        <path d="M8 70C20 52 40 40 60 36" stroke="#c59b43" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <circle cx="62" cy="35" r="2" fill="#c59b43" />
        <circle cx="45" cy="42" r="1.8" fill="#d4af37" />
        <circle cx="22" cy="62" r="1.8" fill="#c59b43" />
      </g>
    </svg>
  );
}

function ArchFoliageBR() {
  return (
    <svg
      width="130"
      height="120"
      viewBox="0 0 130 120"
      fill="none"
      className="arch-foliage-svg foliage-br"
      aria-hidden="true"
    >
      <g opacity="0.95">
        <path d="M125 50C115 70 95 82 72 85C88 88 110 84 125 50Z" fill="#3f614e" />
        <path d="M118 35C105 52 82 62 58 62C78 68 100 62 118 35Z" fill="#527863" />
        <path d="M128 75C112 88 92 98 68 102C84 108 106 102 128 75Z" fill="#2d4a3b" />
        <path d="M95 98C82 110 62 115 42 118C58 120 78 116 95 98Z" fill="#5c846f" />
        <circle cx="102" cy="84" r="8" fill="#ffffff" opacity="0.95" />
        <circle cx="102" cy="84" r="3" fill="#e5c87a" />
        <circle cx="80" cy="102" r="6" fill="#fcfbf7" opacity="0.9" />
        <circle cx="80" cy="102" r="2.2" fill="#d4af37" />
        <path d="M122 60C110 78 90 90 70 94" stroke="#c59b43" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <circle cx="68" cy="95" r="2" fill="#c59b43" />
        <circle cx="85" cy="88" r="1.8" fill="#d4af37" />
        <circle cx="108" cy="68" r="1.8" fill="#c59b43" />
      </g>
    </svg>
  );
}

function ArchFoliageTR() {
  return (
    <svg
      width="140"
      height="130"
      viewBox="0 0 140 130"
      fill="none"
      className="arch-foliage-svg foliage-tr"
      aria-hidden="true"
    >
      <g opacity="0.95">
        <path d="M135 80C125 60 105 48 82 45C98 42 120 46 135 80Z" fill="#3f614e" />
        <path d="M128 95C115 78 92 68 68 68C88 62 110 68 128 95Z" fill="#527863" />
        <path d="M138 55C122 42 102 32 78 28C94 22 116 28 138 55Z" fill="#2d4a3b" />
        <path d="M105 32C92 20 72 15 52 12C68 10 88 14 105 32Z" fill="#5c846f" />
        <path d="M80 22C66 12 46 8 26 8C44 6 62 8 80 22Z" fill="#729780" />
        <circle cx="112" cy="46" r="8" fill="#ffffff" opacity="0.95" />
        <circle cx="112" cy="46" r="3" fill="#e5c87a" />
        <circle cx="90" cy="28" r="6" fill="#fcfbf7" opacity="0.9" />
        <circle cx="90" cy="28" r="2.2" fill="#d4af37" />
        <path d="M132 70C120 52 100 40 80 36" stroke="#c59b43" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <circle cx="78" cy="35" r="2" fill="#c59b43" />
        <circle cx="95" cy="42" r="1.8" fill="#d4af37" />
        <circle cx="118" cy="62" r="1.8" fill="#c59b43" />
      </g>
    </svg>
  );
}

function ArchFoliageBL() {
  return (
    <svg
      width="130"
      height="120"
      viewBox="0 0 130 120"
      fill="none"
      className="arch-foliage-svg foliage-bl"
      aria-hidden="true"
    >
      <g opacity="0.95">
        <path d="M5 50C15 70 35 82 58 85C42 88 20 84 5 50Z" fill="#3f614e" />
        <path d="M12 35C25 52 48 62 72 62C52 68 30 62 12 35Z" fill="#527863" />
        <path d="M2 75C18 88 38 98 62 102C46 108 24 102 2 75Z" fill="#2d4a3b" />
        <path d="M35 98C48 110 68 115 88 118C72 120 52 116 35 98Z" fill="#5c846f" />
        <circle cx="28" cy="84" r="8" fill="#ffffff" opacity="0.95" />
        <circle cx="28" cy="84" r="3" fill="#e5c87a" />
        <circle cx="50" cy="102" r="6" fill="#fcfbf7" opacity="0.9" />
        <circle cx="50" cy="102" r="2.2" fill="#d4af37" />
        <path d="M8 60C20 78 40 90 60 94" stroke="#c59b43" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <circle cx="62" cy="95" r="2" fill="#c59b43" />
        <circle cx="45" cy="88" r="1.8" fill="#d4af37" />
        <circle cx="22" cy="68" r="1.8" fill="#c59b43" />
      </g>
    </svg>
  );
}

// 8. Interlocking Wedding Rings Centerpiece
function InterlockingWeddingRings() {
  return (
    <div className="couple-center-symbol">
      <svg
        width="160"
        height="76"
        viewBox="0 0 160 76"
        fill="none"
        className="wedding-rings-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="coupleRingGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f3e5ab" />
            <stop offset="100%" stopColor="#aa7c11" />
          </linearGradient>
          <linearGradient id="coupleRingGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#527863" />
            <stop offset="50%" stopColor="#7ba38c" />
            <stop offset="100%" stopColor="#2d4a3b" />
          </linearGradient>
        </defs>
        {/* Left Laurel Sprig */}
        <g opacity="0.9">
          <path d="M32 38C24 35 15 30 10 24C12 32 18 38 28 42" stroke="#527863" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M26 31C20 28 14 28 10 32C14 34 20 34 26 31Z" fill="#527863" />
          <path d="M22 41C16 43 12 47 11 52C14 49 19 47 22 41Z" fill="#3f614e" />
          <path d="M30 24C25 20 18 19 14 22C18 25 24 26 30 24Z" fill="#729780" />
          <circle cx="8" cy="22" r="1.5" fill="#c59b43" />
          <circle cx="10" cy="54" r="1.5" fill="#c59b43" />
        </g>
        {/* Left Ring (Gold) */}
        <circle cx="68" cy="38" r="22" stroke="url(#coupleRingGold)" strokeWidth="3" />
        {/* Right Ring (Forest Sage / Gold) */}
        <circle cx="92" cy="38" r="22" stroke="url(#coupleRingGreen)" strokeWidth="3" />
        {/* Overlapping Heart Accent */}
        <path
          d="M80 34C78 30 73 31 73 35C73 39 80 44 80 44C80 44 87 39 87 35C87 31 82 30 80 34Z"
          fill="#c59b43"
        />
        {/* Right Laurel Sprig */}
        <g opacity="0.9">
          <path d="M128 38C136 35 145 30 150 24C148 32 142 38 132 42" stroke="#527863" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M134 31C140 28 146 28 150 32C146 34 140 34 134 31Z" fill="#527863" />
          <path d="M138 41C144 43 148 47 149 52C146 49 141 47 138 41Z" fill="#3f614e" />
          <path d="M130 24C135 20 142 19 146 22C142 25 136 26 130 24Z" fill="#729780" />
          <circle cx="152" cy="22" r="1.5" fill="#c59b43" />
          <circle cx="150" cy="54" r="1.5" fill="#c59b43" />
        </g>
      </svg>
      <span className="couple-center-label">FOREVER &amp; ALWAYS</span>
      <div className="couple-center-diamond" aria-hidden="true">
        <span className="ccd-line" />
        <span className="ccd-gem">◇</span>
        <span className="ccd-line" />
      </div>
    </div>
  );
}

// 9. Symmetrical 3-Petal Lotus Flourish with Gold Lines (Exact Match to User Reference)
function RsvpLotusFlourish() {
  return (
    <svg
      width="160"
      height="26"
      viewBox="0 0 160 26"
      fill="none"
      className="rsvp-lotus-flourish"
      aria-hidden="true"
    >
      {/* Left horizontal line with end dot */}
      <circle cx="8" cy="13" r="1.5" fill="#c59b43" />
      <path d="M8 13H62" stroke="#c59b43" strokeWidth="1" strokeLinecap="round" />

      {/* Center 3-Petal Lotus motif */}
      <g transform="translate(80, 13)">
        {/* Center upright petal */}
        <path
          d="M0 -11C-2.4 -6 -3.6 -2 0 3C3.6 -2 2.4 -6 0 -11Z"
          fill="#c59b43"
        />
        {/* Left curving petal */}
        <path
          d="M0 2C-3.6 2 -8 0.5 -10 -4C-8 -6 -5 -5 -3 -2C-1 0 0 1.5 0 2Z"
          fill="#c59b43"
        />
        {/* Right curving petal */}
        <path
          d="M0 2C3.6 2 8 0.5 10 -4C8 -6 5 -5 3 -2C1 0 0 1.5 0 2Z"
          fill="#c59b43"
        />
        {/* Base seed / calyx */}
        <circle cx="0" cy="5" r="1.5" fill="#c59b43" />
      </g>

      {/* Right horizontal line with end dot */}
      <path d="M98 13H152" stroke="#c59b43" strokeWidth="1" strokeLinecap="round" />
      <circle cx="152" cy="13" r="1.5" fill="#c59b43" />
    </svg>
  );
}

// 10. RSVP Diamond Divider
function RsvpDiamondDivider() {
  return (
    <div className="rsvp-card-diamond-divider" aria-hidden="true">
      <span className="rcd-line" />
      <span className="rcd-gem">◇</span>
      <span className="rcd-line" />
    </div>
  );
}

// 11. Delicate Gold Laurel Branch Sprig for Button
function GoldLaurelSprig() {
  return (
    <svg
      width="28"
      height="22"
      viewBox="0 0 28 22"
      fill="none"
      className="btn-gold-laurel"
      aria-hidden="true"
    >
      <path
        d="M2 18C8 17 14 14 20 8C22 6 25 3 26 2"
        stroke="#d4af37"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Leaf 1 */}
      <path d="M7 14C4 12 3 9 5 8C7 9 8 12 7 14Z" fill="#d4af37" />
      {/* Leaf 2 */}
      <path d="M12 11C11 8 12 5 14 5C15 7 14 10 12 11Z" fill="#d4af37" />
      {/* Leaf 3 */}
      <path d="M17 8C15 6 15 3 17 3C19 4 19 7 17 8Z" fill="#d4af37" />
      {/* Leaf 4 */}
      <path d="M22 5C21 3 22 1 24 1C25 2 24 5 22 5Z" fill="#d4af37" />
    </svg>
  );
}

// 12. Responsive Botanical Floral Corners for Banners on Mobile & Desktop
function BannerFloralCorners() {
  return (
    <>
      <motion.div
        className="banner-floral-decor floral-decor-tl"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.78, rotate: -8, x: -14, y: -14 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/images/green_gold_corner.png"
          alt=""
          className="banner-floral-img"
        />
      </motion.div>
      <motion.div
        className="banner-floral-decor floral-decor-br"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.78, rotate: 172, x: 14, y: 14 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 180, x: 0, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/images/green_gold_corner.png"
          alt=""
          className="banner-floral-img"
        />
      </motion.div>
    </>
  );
}

type RevealVariant =
  | 'flip3d'
  | 'curtain'
  | 'unroll'
  | 'envelope'
  | 'feather'
  | 'horizon'
  | 'converge';

const revealVariants: Record<
  RevealVariant,
  {
    initial: Record<string, number | string>;
    whileInView: Record<string, number | string>;
    perspective?: number;
  }
> = {
  flip3d: {
    initial: { opacity: 0, y: 56, scale: 0.92, rotateX: 16, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' },
    perspective: 1200,
  },
  curtain: {
    initial: { opacity: 0, y: 46, scale: 0.94, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  unroll: {
    initial: { opacity: 0, y: 60, scaleY: 0.86, scaleX: 0.96, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, scaleY: 1, scaleX: 1, filter: 'blur(0px)' },
  },
  envelope: {
    initial: { opacity: 0, y: 68, scale: 0.88, rotateX: -15, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' },
    perspective: 1100,
  },
  feather: {
    initial: { opacity: 0, y: 48, rotate: -2, scale: 0.92, filter: 'blur(7px)' },
    whileInView: { opacity: 1, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' },
  },
  horizon: {
    initial: { opacity: 0, y: 58, scale: 0.92, rotateX: 14, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' },
    perspective: 1200,
  },
  converge: {
    initial: { opacity: 0, y: 36, scale: 1.06, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
};

function Reveal({
  children,
  delay = 0,
  variant = 'curtain',
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
}) {
  const preset = revealVariants[variant];
  return (
    <motion.div
      initial={preset.initial}
      whileInView={preset.whileInView}
      viewport={{ once: false, amount: 0.14, margin: '-30px 0px -30px 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={
        preset.perspective
          ? { transformPerspective: preset.perspective, transformOrigin: 'center top' }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

export default function Wedding({ guest }: { guest?: Guest }) {
  const [opened, setOpened] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('opened') === 'true';
    }
    return false;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnvelopePlaying, setIsEnvelopePlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const envelopeVideoRef = useRef<HTMLVideoElement | null>(null);

  // Preload envelope intro video immediately on mount for instant onClick playback
  useEffect(() => {
    const vid = envelopeVideoRef.current;
    if (vid) {
      vid.load();
    }
  }, []);

  // Automatically pause background music whenever the user leaves the page, switches tabs, or minimizes the browser
  useEffect(() => {
    const pauseMusicOnLeave = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        pauseMusicOnLeave();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', pauseMusicOnLeave);
    window.addEventListener('blur', pauseMusicOnLeave);
    window.addEventListener('beforeunload', pauseMusicOnLeave);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', pauseMusicOnLeave);
      window.removeEventListener('blur', pauseMusicOnLeave);
      window.removeEventListener('beforeunload', pauseMusicOnLeave);
    };
  }, []);

  // Safety fallback timer to transition into invitation after envelope video completes (~8.2s)
  useEffect(() => {
    if (!isEnvelopePlaying || opened) return;
    const fallbackTimer = setTimeout(() => {
      setOpened(true);
    }, 8300);
    return () => clearTimeout(fallbackTimer);
  }, [isEnvelopePlaying, opened]);

  const [time, setTime] = useState([0, 0, 0, 0]);
  const [status, setStatus] = useState(guest?.status || 'pending');
  const [count, setCount] = useState(guest?.attending_count || 1);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);

  const handleOpenInvitation = () => {
    if (isEnvelopePlaying || opened) return;
    setIsEnvelopePlaying(true);

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Autoplay prevented:', err);
      });
    }

    const vid = envelopeVideoRef.current;
    if (vid) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Envelope video playback fallback:', err);
          setOpened(true);
        });
      }
    } else {
      setOpened(true);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  // Smooth scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Countdown timer to Dec 03, 2026 07:30 AM
  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, new Date('2026-12-03T07:30:00+05:30').getTime() - Date.now());
      setTime([
        Math.floor(ms / 86400000),
        Math.floor(ms / 3600000) % 24,
        Math.floor(ms / 60000) % 60,
        Math.floor(ms / 1000) % 60,
      ]);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'countdown', 'couple', 'details', 'rsvp', 'location', 'contact'];
      const scrollY = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setActiveTab(targetId);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  async function respond(next: 'accepted' | 'declined') {
    setBusy(true);
    if (!guest) {
      setTimeout(() => {
        setStatus(next);
        setFeedback(
          next === 'accepted'
            ? 'Thank you! We look forward to celebrating with you.'
            : 'Thank you for letting us know. You will be dearly missed.'
        );
        setBusy(false);
      }, 300);
      return;
    }
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: guest.token, status: next, count: next === 'accepted' ? count : 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      setStatus(next);
      setFeedback(
        next === 'accepted'
          ? 'Thank you! We look forward to celebrating with you.'
          : 'Thank you for letting us know. You will be missed.'
      );
    } catch (e) {
      setFeedback((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!message.trim()) return;
    setBusy(true);
    if (!guest) {
      setTimeout(() => {
        setMessage('');
        setFeedback('Your lovely message has been sent. Thank you!');
        setBusy(false);
      }, 300);
      return;
    }
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: guest.token, message }),
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      setMessage('');
      setFeedback('Your lovely message has been sent. Thank you!');
    } catch (e) {
      setFeedback((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Background Wedding Audio */}
      <audio
        ref={audioRef}
        src="/audio/wedding-melody.mp3"
        loop
        preload="auto"
      />

      {/* Floating Music Controller positioned above bottom navigation */}
      {opened && (
        <motion.button
          className={`floating-music-btn ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause background music' : 'Play background music'}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </motion.button>
      )}

      {/* Decent Luxury Matching Cursor Effect (Desktop Pointer Devices) */}
      <LuxuryCursor />

      {/* Full-Screen Preloaded Envelope Entry Video (Plays onClick) */}
      <AnimatePresence mode="wait">
        {!opened && (
          <motion.div
            key="invitation-cover"
            className={`invitation-cover-screen ${isEnvelopePlaying ? 'is-playing' : ''}`}
            onClick={handleOpenInvitation}
            role="button"
            tabIndex={0}
            aria-label="Tap to play and open wedding invitation"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenInvitation();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{
              opacity: 0,
              scale: 1.03,
              filter: 'blur(8px)',
              transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] },
            }}
          >
            <video
              ref={envelopeVideoRef}
              className="envelope-fullscreen-video"
              src="/envelope-intro.mp4"
              poster="/images/envelope-poster.jpg"
              preload="auto"
              playsInline
              muted
              onEnded={() => setOpened(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="wedding-main-page">
        {/* Golden Scroll Progress Bar */}
        <motion.div className="scroll-progress-bar" style={{ scaleX }} />

        {/* Ambient Subtle Petal Drift Background */}
        <BackgroundAnimation />

        {/* Desktop Header Navigation */}
        <motion.header
          className="nav"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          <a
            href="#home"
            className="brand"
            onClick={(e) => handleSmoothScroll(e, 'home')}
          >
            <img
              src="/images/logo-crest-sm.png"
              alt="Logo"
              className="nav-brand-logo"
              decoding="async"
            />
            <span>G <span>♥</span> C</span>
          </a>
          <nav>
            <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')}>
              Home
            </a>
            <a href="#countdown" onClick={(e) => handleSmoothScroll(e, 'countdown')}>
              Countdown
            </a>
            <a href="#couple" onClick={(e) => handleSmoothScroll(e, 'couple')}>
              Our Story
            </a>
            <a href="#details" onClick={(e) => handleSmoothScroll(e, 'details')}>
              Details
            </a>
            <a href="#rsvp" onClick={(e) => handleSmoothScroll(e, 'rsvp')}>
              RSVP
            </a>
            <a href="#location" onClick={(e) => handleSmoothScroll(e, 'location')}>
              Location
            </a>
          </nav>
          <button
            className="nav-pill"
            onClick={() => setOpened(false)}
          >
            Cover Screen ♡
          </button>
        </motion.header>

        {/* 1. CINEMATIC VIDEO HERO SECTION */}
        <section className="hero" id="home">
          <video autoPlay muted loop playsInline poster="/hero-poster.jpg">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="hero-shade" />

          <div className="hero-content">
            <motion.div
              className="eyebrow light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              TOGETHER FOREVER
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Gimasha <em>&amp;</em>
              <br /> Chathura
            </motion.h1>

            <motion.div
              className="hero-rule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              ✦ &nbsp; ARE GETTING MARRIED &nbsp; ✦
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.95 }}
            >
              With the blessings of our families, we warmly invite you to celebrate our special day of love and happiness.
            </motion.p>
          </div>

          <motion.a
            href="#countdown"
            className="scroll-note"
            onClick={(e) => handleSmoothScroll(e, 'countdown')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.0 }}
          >
            SCROLL TO EXPLORE ↓
          </motion.a>
        </section>

        {/* Seamless Botanical Garland Connecting Hero to Countdown */}
        <motion.div
          className="page-floral-garland-decor"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.78, y: -16, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/images/floral_garland_transparent.png"
            alt="Botanical floral garland"
          />
        </motion.div>

        {/* 2. COUNTDOWN SECTION (Panoramic Banner with 3D Flip-Up & Domino Timer Pop) */}
        <section className="section countdown-banner-section" id="countdown">
          <Reveal variant="flip3d">
            <div className="countdown-banner-container">
              {/* Botanical Floral Corner Accents from added artwork */}
              <BannerFloralCorners />

              {/* Header */}
              <motion.div
                className="countdown-banner-header"
                initial={{ opacity: 0, y: -22, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="countdown-banner-eyebrow">COUNTDOWN TO FOREVER</div>
                <h2 className="countdown-banner-title">COUNTING DOWN TO FOREVER</h2>
                <DiamondFlourish />
              </motion.div>

              {/* Countdown Timer Boxes directly placed on background (No enclosing card) */}
              <div className="countdown-banner-grid">
                {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, idx) => (
                  <motion.div
                    className="countdown-glass-box"
                    key={label}
                    initial={{ opacity: 0, y: 38, rotateY: -32, scale: 0.82 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 + idx * 0.11,
                      type: 'spring',
                      stiffness: 135,
                      damping: 16,
                    }}
                    style={{ transformPerspective: 800 }}
                    whileHover={{ y: -6, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <strong>{String(time[idx]).padStart(2, '0')}</strong>
                    <span>{label.toUpperCase()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. THE HAPPY COUPLE PANORAMIC BANNER & SHARP GLASS ARCH CARDS */}
        <section className="section couple-banner-section" id="couple">
          <Reveal variant="curtain">
            <div className="couple-banner-container">
              {/* Botanical Floral Corner Accents from added artwork */}
              <BannerFloralCorners />

              {/* Top Flourish & Heading matching Reference Image */}
              <motion.div
                className="couple-banner-header"
                initial={{ opacity: 0, y: -24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <DetailsTopFlourish />
                <div className="couple-banner-eyebrow">THE HAPPY COUPLE</div>
                <h2 className="couple-banner-title">TWO HEARTS, ONE JOURNEY</h2>
                <div className="couple-center-diamond" aria-hidden="true">
                  <span className="ccd-line" />
                  <span className="ccd-gem">◆</span>
                  <span className="ccd-line" />
                </div>
              </motion.div>

              {/* Arched Cards Stage with Sharp Glass Effect & Interlocking Rings (Bride 1st, Groom 2nd) */}
              <div className="couple-cards-stage">
                {/* Bride Arched Dome Card — Placed 1st */}
                <motion.div
                  className="couple-glass-arch-card bride-arch-card"
                  initial={{ opacity: 0, x: -64, y: 36, rotateZ: -5, rotateY: 14, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotateZ: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.9, delay: 0.06, type: 'spring', stiffness: 105, damping: 16 }}
                  style={{ transformPerspective: 1000 }}
                  whileHover={{ y: -7, scale: 1.015, transition: { duration: 0.3 } }}
                >
                  {/* Top-Left Arch Foliage */}
                  <ArchFoliageTL />
                  {/* Bottom-Right Corner Foliage */}
                  <ArchFoliageBR />

                  {/* Top Gold Filigree Crest */}
                  <CardTopCrest />

                  {/* Role Badge */}
                  <div className="couple-role-pill">
                    <span>✦</span>
                    <span>THE BRIDE</span>
                    <span>✦</span>
                  </div>

                  {/* Name */}
                  <h3 className="couple-name">GIMASHA</h3>

                  {/* Parent Lineage */}
                  <div className="couple-parents-sub">Daughter of</div>
                  <div className="couple-parents-names">Mr &amp; Mrs W.M.E. Warnasooriya</div>
                </motion.div>

                {/* Center Interlocking Wedding Rings — Spin & Golden Bloom */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.42, rotate: -35 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.95, delay: 0.18, type: 'spring', stiffness: 115, damping: 14 }}
                >
                  <InterlockingWeddingRings />
                </motion.div>

                {/* Groom Arched Dome Card — Placed 2nd */}
                <motion.div
                  className="couple-glass-arch-card groom-arch-card"
                  initial={{ opacity: 0, x: 64, y: 36, rotateZ: 5, rotateY: -14, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotateZ: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.9, delay: 0.16, type: 'spring', stiffness: 105, damping: 16 }}
                  style={{ transformPerspective: 1000 }}
                  whileHover={{ y: -7, scale: 1.015, transition: { duration: 0.3 } }}
                >
                  {/* Top-Right Arch Foliage */}
                  <ArchFoliageTR />
                  {/* Bottom-Left Corner Foliage */}
                  <ArchFoliageBL />

                  {/* Top Gold Filigree Crest */}
                  <CardTopCrest />

                  {/* Role Badge */}
                  <div className="couple-role-pill">
                    <span>✦</span>
                    <span>THE GROOM</span>
                    <span>✦</span>
                  </div>

                  {/* Name */}
                  <h3 className="couple-name">CHATHURA</h3>

                  {/* Parent Lineage */}
                  <div className="couple-parents-sub">Son of</div>
                  <div className="couple-parents-names">Mr &amp; Mrs W.K.D. Rathnayake</div>
                </motion.div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 4. THE DETAILS SECTION (Royal Scroll Unroll & Split Wing Reveal) */}
        <section className="section details-banner-section" id="details">
          <Reveal variant="unroll">
            <div className="details-banner-container">
              {/* Botanical Floral Corner Accents from added artwork */}
              <BannerFloralCorners />

              {/* Top Finial & Heading matching Image */}
              <motion.div
                className="details-banner-header"
                initial={{ opacity: 0, y: -20, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <DetailsTopFlourish />
                <h2 className="details-banner-title">THE DETAILS</h2>
                <DetailsBottomFlourish />
              </motion.div>

              {/* Luxury Cartouche Plaque Card */}
              <motion.div
                className="details-luxury-card"
                initial={{ opacity: 0, y: 36, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="details-card-grid">
                  {/* Left Column: THE DATE & TIME */}
                  <motion.div
                    className="details-card-col"
                    initial={{ opacity: 0, x: -42, y: 16 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <BotanicalBadge
                      icon={<CalendarDays size={22} color="#ffffff" strokeWidth={1.8} />}
                    />
                    <h3 className="details-card-col-title">THE DATE</h3>
                    <div className="details-card-highlight">Thursday, December 03, 2026</div>
                    <div className="details-card-location">Time - From 10 AM to 4 PM</div>
                    <GoldScrollDivider />
                    <p className="details-card-subtext">
                      Save the date to share this milestone with us
                    </p>
                  </motion.div>

                  {/* Center Vertical Divider with Clover Motif */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.85, delay: 0.18, type: 'spring', stiffness: 120, damping: 14 }}
                  >
                    <VerticalCloverDivider />
                  </motion.div>

                  {/* Right Column: PORUWA CEREMONY */}
                  <motion.div
                    className="details-card-col"
                    initial={{ opacity: 0, x: 42, y: 16 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <BotanicalBadge
                      icon={<Clock3 size={22} color="#ffffff" strokeWidth={1.8} />}
                    />
                    <h3 className="details-card-col-title">PORUWA CEREMONY</h3>
                    <div className="details-card-highlight">Poruwa Ceremony - 7.30 AM</div>
                    <div className="details-card-location">At the Auspicious Time</div>
                    <GoldScrollDivider />
                    <p className="details-card-subtext">
                      Followed by wedding celebrations from 10 AM to 4 PM
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </section>

        {/* 5. RSVP SECTION (Envelope Rising Presentation & Embossed Plaque Zoom) */}
        <section className="section rsvp-banner-section" id="rsvp">
          <Reveal variant="envelope">
            <div className="rsvp-banner-container">
              {/* Botanical Floral Corner Accents from added artwork */}
              <BannerFloralCorners />

              {/* Header: YOUR PRESENCE MATTERS / RSVP INVITATION */}
              <motion.div
                className="rsvp-banner-header"
                initial={{ opacity: 0, y: -22, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="rsvp-banner-eyebrow">YOUR PRESENCE MATTERS</div>
                <RsvpLotusFlourish />
                <h2 className="rsvp-banner-title">RSVP INVITATION</h2>
                <p className="rsvp-banner-subtext">
                  We would be truly honored by your gracious presence on our auspicious wedding day.
                  <br />
                  Please kindly let us know if you will be attending.
                </p>
              </motion.div>

              {/* Luxury Embossed Plaque Card matching Reference Image */}
              <motion.div
                className="rsvp-plaque-card"
                initial={{ opacity: 0, y: 46, scale: 0.88, rotateX: 12 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.9, delay: 0.1, type: 'spring', stiffness: 110, damping: 16 }}
                style={{ transformPerspective: 1000 }}
              >
                {/* Botanical Corner Foliage matching Image */}
                <div className="rsvp-card-corner corner-tl">
                  <ArchFoliageTL />
                </div>
                <div className="rsvp-card-corner corner-br">
                  <ArchFoliageBR />
                </div>

                <div className="rsvp-card-inner">
                  {/* Card Top Flourish */}
                  <RsvpLotusFlourish />

                  {/* Eyebrow */}
                  <div className="rsvp-card-eyebrow">CORDIALLY INVITED</div>

                  {/* Guest Name / Title */}
                  <h3 className="rsvp-card-name">
                    {guest?.name ? guest.name.toUpperCase() : 'HONOURED GUEST & FAMILY'}
                  </h3>

                  {/* Diamond Divider */}
                  <RsvpDiamondDivider />

                  {/* Italic Quote */}
                  <p className="rsvp-card-quote">
                    “Together with our families, we warmly request the honour of your presence and blessings to celebrate our marriage and share this auspicious occasion with us.”
                  </p>

                  {/* Masterpiece CTA Button: "I WILL ATTEND →" (Premium Emerald & Gold Shining Glass Pill) */}
                  <motion.button
                    disabled={busy}
                    className="rsvp-primary-attend-btn"
                    onClick={() => respond('accepted')}
                    whileHover={{ scale: 1.035, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="I will attend"
                  >
                    <GoldLaurelSprig />
                    <span className="rsvp-btn-label">
                      {status === 'accepted' ? 'I WILL ATTEND ✓' : 'I WILL ATTEND'}
                    </span>
                    <div className="rsvp-btn-arrow-circle">
                      <ArrowRight size={16} color="#ffe494" />
                    </div>
                  </motion.button>

                  {/* Secondary Controls & Feedback */}
                  <div className="rsvp-extra-controls">
                    {guest?.seats && guest.seats > 1 && (
                      <div className="rsvp-seats-selector">
                        <span>Attending Seats:</span>
                        <select
                          value={count}
                          onChange={(e) => setCount(Number(e.target.value))}
                          className="rsvp-seats-dropdown"
                        >
                          {Array.from({ length: guest.seats }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {status === 'accepted' ? (
                      <div className="rsvp-status-badge status-badge-accepted">
                        <Check size={14} /> Confirmed Attending
                        <button
                          type="button"
                          className="rsvp-decline-link"
                          style={{ marginLeft: '10px' }}
                          onClick={() => respond('declined')}
                        >
                          Change to unable to attend
                        </button>
                      </div>
                    ) : status === 'declined' ? (
                      <div className="rsvp-status-badge status-badge-declined">
                        <X size={14} /> Unable to Attend
                        <button
                          type="button"
                          className="rsvp-decline-link"
                          style={{ marginLeft: '10px' }}
                          onClick={() => respond('accepted')}
                        >
                          Change to will attend
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="rsvp-decline-link"
                        onClick={() => respond('declined')}
                      >
                        Unable to attend? Let us know
                      </button>
                    )}

                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-feedback-message"
                        style={{ marginTop: '10px' }}
                      >
                        {feedback}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </section>

        {/* 6. WISHES GUESTBOOK (Feather Float & Botanical Emblem Spin) */}
        <section className="section wishes" id="wishes">
          <Reveal variant="feather">
            <div className="nature-eyebrow">SEND YOUR BLESSINGS</div>
            <h2 className="nature-title">WARM WISHES</h2>
            <DiamondFlourish />

            <motion.div
              className="premium-glass-card message-card"
              initial={{ opacity: 0, y: 36, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, delay: 0.08, type: 'spring', stiffness: 115, damping: 16 }}
            >
              <img
                src="/images/green_gold_corner.png"
                alt=""
                className="card-botanical-corner card-corner-tr"
                aria-hidden="true"
              />
              <img
                src="/images/green_gold_corner.png"
                alt=""
                className="card-botanical-corner card-corner-bl"
                aria-hidden="true"
              />

              <motion.div
                className="glass-emblem-badge"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.4, rotate: -140 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.9, delay: 0.16, type: 'spring', stiffness: 120, damping: 14 }}
              >
                <MinimalistBotanicalFlower size={26} color="#c59b43" />
              </motion.div>
              <div className="floral-emblem-divider" aria-hidden="true" />

              <textarea
                placeholder="Write your heartwarming wishes and blessings for Gimasha & Chathura..."
                disabled={busy}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-textarea"
              />
              <button
                className="btn glass-btn"
                onClick={send}
                disabled={busy || !message.trim()}
                style={{ width: '100%' }}
              >
                <Send size={16} /> Send Warm Wishes
              </button>
            </motion.div>
            {feedback && (
              <p role="status" className="feedback">
                {feedback}
              </p>
            )}
          </Reveal>
        </section>

        {/* 7. LOCATION SECTION (Horizon Glide & Cascading Feature Wave) */}
        <section className="section location-banner-section" id="location">
          <Reveal variant="horizon">
            <div className="location-banner-container">
              {/* Botanical Floral Corner Accents from added artwork */}
              <BannerFloralCorners />

              {/* Top Finial & Heading matching Image */}
              <motion.div
                className="location-banner-header"
                initial={{ opacity: 0, y: -20, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <DetailsTopFlourish />
                <div className="location-banner-eyebrow">VENUE &amp; DIRECTIONS</div>
                <h2 className="location-banner-title">THE LOCATION</h2>
                <DetailsBottomFlourish />
              </motion.div>

              {/* Luxury Cartouche Plaque Card */}
              <motion.div
                className="location-luxury-card"
                initial={{ opacity: 0, y: 34, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="location-card-grid">
                  {/* Left Column: Venue Details & Action Button */}
                  <motion.div
                    className="location-left-col"
                    initial={{ opacity: 0, x: -44, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="location-venue-eyebrow">
                      <MapPin size={13} className="shrink-0" />
                      <span>THE WEDDING VENUE</span>
                    </div>
                    <h3 className="location-venue-title">
                      THE DEER PARK
                      <br />
                      HOTEL
                    </h3>
                    <p className="location-venue-address">
                      Girthale, Polonnaruwa, Sri Lanka
                    </p>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-directions-btn"
                    >
                      <Navigation size={13} className="location-btn-nav-icon" />
                      <span>GET DIRECTIONS</span>
                      <ArrowRight size={14} className="location-btn-arrow-icon" />
                    </a>
                  </motion.div>

                  {/* Center Vertical Divider with Clover Motif */}
                  <VerticalCloverDivider />

                  {/* Right Column: 3 Feature Badges with Staggered Entrance */}
                  <div className="location-features-row">
                    {/* Feature 1: Location Pin */}
                    <motion.div
                      className="location-feature-col"
                      initial={{ opacity: 0, y: 32, scale: 0.8, rotate: -6 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.65, delay: 0.12, type: 'spring', stiffness: 130, damping: 15 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="location-icon-badge">
                        <MapPin size={22} />
                      </div>
                      <MiniGoldScrollDivider />
                      <p className="location-feature-text">
                        Girthale,
                        <br />
                        Polonnaruwa
                      </p>
                    </motion.div>

                    <div className="location-col-separator" aria-hidden="true" />

                    {/* Feature 2: Hotel Building */}
                    <motion.div
                      className="location-feature-col"
                      initial={{ opacity: 0, y: 32, scale: 0.8, rotate: -6 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.65, delay: 0.24, type: 'spring', stiffness: 130, damping: 15 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="location-icon-badge">
                        <Building2 size={22} />
                      </div>
                      <MiniGoldScrollDivider />
                      <p className="location-feature-text">
                        The Deer Park
                        <br />
                        Hotel
                      </p>
                    </motion.div>

                    <div className="location-col-separator" aria-hidden="true" />

                    {/* Feature 3: Scenic Setting */}
                    <motion.div
                      className="location-feature-col"
                      initial={{ opacity: 0, y: 32, scale: 0.8, rotate: -6 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.65, delay: 0.36, type: 'spring', stiffness: 130, damping: 15 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="location-icon-badge">
                        <Trees size={22} />
                      </div>
                      <MiniGoldScrollDivider />
                      <p className="location-feature-text">
                        A scenic and
                        <br />
                        peaceful setting
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </section>

        {/* 8. CONTACT SECTION (Minimalist Botanical Flowers & Luxury Shining Glass Cards) */}
        <section className="section contact-banner-section" id="contact">
          <Reveal variant="converge">
            <div className="contact-banner-container">
              {/* Botanical Floral Corner Accents */}
              <BannerFloralCorners />

              {/* Minimalist Background Flowers (Floating Gold & Sage Botanical Line Art) */}
              <div className="contact-minimalist-flowers" aria-hidden="true">
                <div className="cm-flower cm-flower-1">
                  <MinimalistBotanicalFlower size={64} color="#c59b43" />
                </div>
                <div className="cm-flower cm-flower-2">
                  <MinimalistBotanicalFlower size={52} color="#527863" />
                </div>
                <div className="cm-flower cm-flower-3">
                  <MinimalistBotanicalFlower size={58} color="#c59b43" />
                </div>
                <div className="cm-flower cm-flower-4">
                  <MinimalistBotanicalFlower size={48} color="#527863" />
                </div>
              </div>

              {/* Section Header */}
              <motion.div
                className="contact-banner-header"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <DetailsTopFlourish />
                <div className="contact-banner-eyebrow">QUESTIONS &amp; ASSISTANCE</div>
                <h2 className="contact-banner-title">CONTACT US</h2>
                <DetailsBottomFlourish />
                <p className="contact-banner-subtext">
                  Should you need any assistance with directions or event details, please feel warmly welcome to reach out to our family.
                </p>
              </motion.div>

              {/* Luxury Glass Contact Cards Grid */}
              <div className="contact-cards-grid">
                {/* Contact 1: Warnasooriya */}
                <motion.a
                  href="tel:0773163928"
                  className="contact-luxury-card"
                  initial={{ opacity: 0, x: -52, y: 20, scale: 0.92 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.18 }}
                  transition={{ duration: 0.8, delay: 0.08, type: 'spring', stiffness: 120, damping: 16 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="contact-card-watermark" aria-hidden="true">
                    <MinimalistBotanicalFlower size={84} color="#c59b43" />
                  </div>

                  <BotanicalBadge
                    icon={<Phone size={20} color="#ffffff" strokeWidth={1.9} />}
                  />

                  <span className="contact-role-pill">✦ FAMILY CONTACT ✦</span>
                  <h3 className="contact-person-name">WARNASOORIYA</h3>
                  <MiniGoldScrollDivider />
                  <div className="contact-phone-number">077 316 3928</div>
                  <span className="contact-call-cta">
                    <Phone size={12} />
                    <span>TAP TO CALL</span>
                  </span>
                </motion.a>

                {/* Contact 2: Harshani */}
                <motion.a
                  href="tel:+94717215710"
                  className="contact-luxury-card"
                  initial={{ opacity: 0, x: 52, y: 20, scale: 0.92 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.18 }}
                  transition={{ duration: 0.8, delay: 0.18, type: 'spring', stiffness: 120, damping: 16 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="contact-card-watermark" aria-hidden="true">
                    <MinimalistBotanicalFlower size={84} color="#527863" />
                  </div>

                  <BotanicalBadge
                    icon={<Phone size={20} color="#ffffff" strokeWidth={1.9} />}
                  />

                  <span className="contact-role-pill">✦ FAMILY CONTACT ✦</span>
                  <h3 className="contact-person-name">HARSHANI</h3>
                  <MiniGoldScrollDivider />
                  <div className="contact-phone-number">+94 71 721 5710</div>
                  <span className="contact-call-cta">
                    <Phone size={12} />
                    <span>TAP TO CALL</span>
                  </span>
                </motion.a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 9. PREVIOUS WEDDING FOOTER (Restored above Bottom Navigation Bar) */}
        <footer className="wedding-footer">
          <Reveal variant="curtain">
            <div className="footer-garland-wrap">
              <img
                src="/images/floral_garland_transparent.png"
                alt=""
                className="footer-garland-img"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="footer-script-names">Gimasha &amp; Chathura</div>

            <div className="footer-heart-line" aria-hidden="true">
              <span className="heart-line-bar" />
              <Heart size={13} fill="#c89d3e" color="#c89d3e" />
              <span className="heart-line-bar" />
            </div>

            <div className="footer-date-text">DECEMBER 03, 2026 &bull; GIRITHALE</div>
          </Reveal>
        </footer>

        {/* 10. 3D CRYSTAL-GLASS & SHINING GOLD FOOTER NAVIGATION BAR */}
        <nav className="bottom-nav-bar" aria-label="Footer Navigation">
          {/* Top 3D Specular Glass Edge Highlight */}
          <div className="bottom-nav-3d-specular" aria-hidden="true" />

          {/* Left Botanical Sage & Gold Corner Flourish (Matches Website Banners) */}
          <img
            src="/images/green_gold_corner.png"
            alt=""
            className="footer-nav-floral footer-nav-floral-left"
            aria-hidden="true"
          />

          <div className="footer-nav-strip">
            {/* Left Navigation Group: HOME | EVENT | VENUE */}
            <div className="footer-nav-group footer-nav-group-left">
              <a
                href="#home"
                className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={(e) => handleSmoothScroll(e, 'home')}
              >
                <span className="nav-item-icon-3d">
                  <Home size={18} strokeWidth={1.65} />
                </span>
                <span>HOME</span>
              </a>

              <div className="footer-nav-divider" aria-hidden="true">
                <span className="divider-diamond">✦</span>
              </div>

              <a
                href="#details"
                className={`bottom-nav-item ${activeTab === 'details' || activeTab === 'countdown' ? 'active' : ''}`}
                onClick={(e) => handleSmoothScroll(e, 'details')}
              >
                <span className="nav-item-icon-3d">
                  <CalendarDays size={18} strokeWidth={1.65} />
                </span>
                <span>EVENT</span>
              </a>

              <div className="footer-nav-divider" aria-hidden="true">
                <span className="divider-diamond">✦</span>
              </div>

              <a
                href="#location"
                className={`bottom-nav-item ${activeTab === 'location' ? 'active' : ''}`}
                onClick={(e) => handleSmoothScroll(e, 'location')}
              >
                <span className="nav-item-icon-3d">
                  <MapPin size={18} strokeWidth={1.65} />
                </span>
                <span>VENUE</span>
              </a>

              <div className="footer-nav-divider footer-nav-divider-edge" aria-hidden="true">
                <span className="divider-diamond">✦</span>
              </div>
            </div>

            {/* Center 3D Medallion Logo Crest & Names (Bride Gimasha 1st, Groom Chathura 2nd) */}
            <a
              href="#home"
              className="footer-nav-center-crest"
              onClick={(e) => handleSmoothScroll(e, 'home')}
              aria-label="Gimasha and Chathura Home"
            >
              <div className="footer-crest-emblem-wrap" aria-hidden="true">
                <span className="footer-crest-3d-halo" />
                <img
                  src="/images/logo-crest-sm.png"
                  alt="Gimasha & Chathura Crest"
                  className="footer-crest-img"
                  decoding="async"
                />
              </div>
              <div className="footer-crest-names">
                Gimasha <span>&amp;</span> Chathura
              </div>
              <div className="footer-crest-bottom-star" aria-hidden="true">
                <span className="star-line" />
                <span className="star-gem">✦</span>
                <span className="star-line" />
              </div>
            </a>

            {/* Right Navigation Group: RSVP | GALLERY | CONTACT */}
            <div className="footer-nav-group footer-nav-group-right">
              <div className="footer-nav-divider footer-nav-divider-edge" aria-hidden="true">
                <span className="divider-diamond">✦</span>
              </div>

              <a
                href="#rsvp"
                className={`bottom-nav-item ${activeTab === 'rsvp' ? 'active' : ''}`}
                onClick={(e) => handleSmoothScroll(e, 'rsvp')}
              >
                <span className="nav-item-icon-3d">
                  <Mail size={18} strokeWidth={1.65} />
                </span>
                <span>RSVP</span>
              </a>

              <div className="footer-nav-divider" aria-hidden="true">
                <span className="divider-diamond">✦</span>
              </div>

              <a
                href="#couple"
                className={`bottom-nav-item ${activeTab === 'couple' ? 'active' : ''}`}
                onClick={(e) => handleSmoothScroll(e, 'couple')}
              >
                <span className="nav-item-icon-3d">
                  <ImageIcon size={18} strokeWidth={1.65} />
                </span>
                <span>GALLERY</span>
              </a>

              <div className="footer-nav-divider" aria-hidden="true">
                <span className="divider-diamond">✦</span>
              </div>

              <a
                href="#contact"
                className={`bottom-nav-item ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={(e) => handleSmoothScroll(e, 'contact')}
              >
                <span className="nav-item-icon-3d">
                  <Phone size={18} strokeWidth={1.65} />
                </span>
                <span>CONTACT</span>
              </a>
            </div>
          </div>

          {/* Right Botanical Sage & Gold Corner Flourish (Matches Website Banners) */}
          <img
            src="/images/green_gold_corner.png"
            alt=""
            className="footer-nav-floral footer-nav-floral-right"
            aria-hidden="true"
          />
        </nav>
      </main>
    </>
  );
}
