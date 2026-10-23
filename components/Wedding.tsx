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
} from 'lucide-react';
import BackgroundAnimation from './BackgroundAnimation';

type Guest = { name: string; token: string; seats: number; status: string; attending_count: number };
const map = 'https://maps.app.goo.gl/gwr9NAbTvqUno7ePA?g_st=iw';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Wedding({ guest }: { guest?: Guest }) {
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [time, setTime] = useState([0, 0, 0, 0]);
  const [status, setStatus] = useState(guest?.status || 'pending');
  const [count, setCount] = useState(guest?.attending_count || 1);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);

  const handleOpenInvitation = () => {
    setOpened(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Audio autoplay prevented:', err);
      });
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

  // Countdown timer
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

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  async function respond(next: 'accepted' | 'declined') {
    if (!guest) return;
    setBusy(true);
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
    if (!guest || !message.trim()) return;
    setBusy(true);
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
      {/* Hidden Wedding Melody Audio */}
      <audio
        ref={audioRef}
        src="/audio/wedding-melody.mp3"
        loop
        preload="auto"
      />

      {/* Floating Background Music Controller (Visible when invitation is open) */}
      {opened && (
        <motion.button
          className={`floating-music-btn ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause background music' : 'Play background music'}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </motion.button>
      )}

      {/* InviteMint-Style Interactive Luxury Cover / Envelope Screen */}
      <AnimatePresence mode="wait">
        {!opened && (
          <motion.div
            key="invitation-cover"
            className="invitation-cover-screen"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -80,
              scale: 1.04,
              filter: 'blur(10px)',
              transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
            }}
          >
            {/* Top Watercolor Floral Arch */}
            <div className="cover-floral-arch-wrap" aria-hidden="true">
              <img
                src="/images/floral-arch.png"
                alt="Watercolor floral arch"
                className="cover-floral-arch-img"
              />
            </div>

            {/* Ambient Falling Petals Canvas */}
            <BackgroundAnimation />

            {/* Cover Header */}
            <div className="cover-header">
              <div className="cover-eyebrow">A CELEBRATION OF LOVE</div>
              <h1 className="cover-title">
                Chathura <span>&amp;</span> Gimasha
              </h1>
              <div className="cover-date-badge">
                DECEMBER 03, 2026
              </div>
            </div>

            {/* Center Traditional Sri Lankan Couple Illustration */}
            <div className="cover-couple-center">
              <div className="cover-couple-halo" aria-hidden="true" />
              <img
                src="/images/kandyan-couple.png"
                alt="Chathura and Gimasha"
                className="cover-couple-img"
              />
            </div>

            {/* Bottom Signature "OPEN INVITATION" Card */}
            <div className="cover-action-wrap">
              <motion.button
                className="cover-open-btn"
                onClick={handleOpenInvitation}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="cover-open-title">
                  <Heart size={14} fill="#782937" stroke="#782937" />
                  OPEN INVITATION
                  <Heart size={14} fill="#782937" stroke="#782937" />
                </span>
                <span className="cover-open-divider" />
                <span className="cover-open-subtitle">
                  TAP TO REVEAL
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="wedding-main-page">
        {/* Golden Scroll Progress Bar */}
        <motion.div className="scroll-progress-bar" style={{ scaleX }} />

        {/* Ambient Floating Rose Petals & Golden Stardust Background Animation */}
        <BackgroundAnimation />

        {/* Header Navigation */}
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
            C <span>♥</span> G
          </a>
          <nav>
            <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')}>
              Home
            </a>
            <a href="#couple" onClick={(e) => handleSmoothScroll(e, 'couple')}>
              Our Story
            </a>
            <a href="#countdown" onClick={(e) => handleSmoothScroll(e, 'countdown')}>
              Countdown
            </a>
            <a href="#details" onClick={(e) => handleSmoothScroll(e, 'details')}>
              Wedding Details
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
            style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
          >
            Cover Screen ♡
          </button>
        </motion.header>

        {/* Hero Section with Smooth Landing Animation */}
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
              Chathura <em>&</em>
              <br /> Gimasha
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
              With the blessings of our families, we warmly invite you to be a part of our special day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
            >
              <a
                className="btn light-btn"
                href="#countdown"
                onClick={(e) => handleSmoothScroll(e, 'countdown')}
              >
                View Invitation <ArrowDown size={17} />
              </a>
            </motion.div>
          </div>

          <motion.a
            href="#countdown"
            className="scroll-note"
            onClick={(e) => handleSmoothScroll(e, 'countdown')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.0 }}
          >
            SCROLL TO EXPLORE ↓
          </motion.a>
        </section>

        {/* Countdown Section matching user reference design */}
        <section className="section countdown-section" id="countdown">
          <div className="countdown-backdrop" aria-hidden="true" />
          <Reveal>
            <div className="countdown-eyebrow">COUNTDOWN TO OUR WEDDING</div>
            <div className="countdown-flourish" aria-hidden="true">
              <svg className="flourish-svg" viewBox="0 0 120 22" fill="none">
                <path
                  d="M 10 11 L 44 11 M 36 7 L 44 11 L 36 15"
                  stroke="#184a2c"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 18 C 60 18 51 11.5 51 7.5 C 51 4.5 53.2 2.5 56 2.5 C 58 2.5 59.4 3.7 60 4.8 C 60.6 3.7 62 2.5 64 2.5 C 66.8 2.5 69 4.5 69 7.5 C 69 11.5 60 18 60 18 Z"
                  fill="#c59b43"
                />
                <path
                  d="M 110 11 L 76 11 M 84 7 L 76 11 L 84 15"
                  stroke="#184a2c"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="count-grid">
              {time.map((n, i) => (
                <motion.div
                  className="count-box"
                  key={i}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <strong>{String(n).padStart(2, '0')}</strong>
                  <span>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* THE HAPPY COUPLE Section with Animated Portraits */}
        <section className="section couple" id="couple">
          <div className="couple-glow couple-glow-left" aria-hidden="true" />
          <div className="couple-glow couple-glow-right" aria-hidden="true" />
          <div className="couple-glow couple-glow-center" aria-hidden="true" />

          <Reveal>
            <div className="eyebrow">THE HAPPY COUPLE</div>
            <h2>Two Hearts, One Beautiful Journey</h2>
            <div className="flourish">── ♥ ──</div>

            <div className="couple-grid">
              {/* The Groom: Chathura */}
              <motion.div
                className="person-card groom-card"
                initial={{ opacity: 0, x: -60, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="portrait-container float-groom">
                  <div className="golden-halo-pulse" aria-hidden="true" />
                  <div className="golden-halo-inner" aria-hidden="true" />
                  <motion.div
                    className="portrait-hover-wrap"
                    whileHover={{ scale: 1.04, rotate: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <div className="portrait-shimmer" aria-hidden="true" />
                    <img
                      src="/images/groom.png"
                      alt="Chathura - The Groom"
                      className="portrait-img"
                      loading="eager"
                    />
                  </motion.div>
                  <div className="floating-sparkle sp-1" aria-hidden="true">✦</div>
                  <div className="floating-sparkle sp-2" aria-hidden="true">✨</div>
                </div>

                <div className="role-badge">
                  <Sparkles size={13} className="badge-sparkle" />
                  <span>THE GROOM</span>
                  <Sparkles size={13} className="badge-sparkle" />
                </div>
                <h3>Chathura</h3>
                <p>
                  Son of<br />
                  Mr &amp; Mrs W.K.D. Rathnayake
                </p>
              </motion.div>

              {/* Interlocking Golden Rings and Pulsing Heart Centerpiece */}
              <motion.div
                className="rings-connector"
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              >
                <div className="interlocking-rings-wrap">
                  <svg
                    className="rings-svg"
                    viewBox="0 0 130 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f3e3ba" />
                        <stop offset="45%" stopColor="#c9aa70" />
                        <stop offset="100%" stopColor="#8d6e39" />
                      </linearGradient>
                      <linearGradient id="goldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#faeccf" />
                        <stop offset="50%" stopColor="#d8b979" />
                        <stop offset="100%" stopColor="#9b773d" />
                      </linearGradient>
                      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <circle
                      cx="48"
                      cy="40"
                      r="26"
                      stroke="url(#goldGrad1)"
                      strokeWidth="5"
                      filter="url(#goldGlow)"
                    />
                    <circle
                      cx="82"
                      cy="40"
                      r="26"
                      stroke="url(#goldGrad2)"
                      strokeWidth="5"
                      filter="url(#goldGlow)"
                    />
                    <circle cx="82" cy="14" r="3" fill="#ffffff" />
                  </svg>
                  <div className="pulsing-heart-icon" aria-hidden="true">
                    <Heart size={26} fill="#c9aa70" stroke="#c9aa70" />
                  </div>
                </div>
                <span className="forever-text">FOREVER &amp; ALWAYS</span>
              </motion.div>

              {/* The Bride: Gimasha */}
              <motion.div
                className="person-card bride-card"
                initial={{ opacity: 0, x: 60, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="portrait-container float-bride">
                  <div className="golden-halo-pulse" aria-hidden="true" />
                  <div className="golden-halo-inner" aria-hidden="true" />
                  <motion.div
                    className="portrait-hover-wrap"
                    whileHover={{ scale: 1.04, rotate: -1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <div className="portrait-shimmer" aria-hidden="true" />
                    <img
                      src="/images/bride.png"
                      alt="Gimasha - The Bride"
                      className="portrait-img"
                      loading="eager"
                    />
                  </motion.div>
                  <div className="floating-sparkle sp-3" aria-hidden="true">✦</div>
                  <div className="floating-sparkle sp-4" aria-hidden="true">✨</div>
                </div>

                <div className="role-badge">
                  <Sparkles size={13} className="badge-sparkle" />
                  <span>THE BRIDE</span>
                  <Sparkles size={13} className="badge-sparkle" />
                </div>
                <h3>Gimasha</h3>
                <p>
                  Daughter of<br />
                  Mr &amp; Mrs W.M.E. Warnasooriya
                </p>
              </motion.div>
            </div>
          </Reveal>
        </section>

        {/* Wedding Details */}
        <section className="section details" id="details">
          <Reveal>
            <div className="eyebrow">WEDDING DETAILS</div>
            <h2>A Celebration of Love</h2>
            <p className="section-sub">
              We kindly invite you to join us for a day filled with love, joy and beautiful memories.
            </p>
            <div className="detail-grid">
              <div className="detail-card card-date">
                <div className="detail-icon-bubble">
                  <CalendarDays />
                </div>
                <h3>Date</h3>
                <p>
                  Thursday<br />
                  December 03, 2026
                </p>
              </div>
              <div className="detail-card card-celebration">
                <div className="detail-icon-bubble">
                  <Clock3 />
                </div>
                <h3>Celebration</h3>
                <p>
                  10:00 AM<br />
                  to 4:00 PM
                </p>
              </div>
              <div className="detail-card card-ceremony">
                <div className="detail-icon-bubble">
                  <Flower2 />
                </div>
                <h3>Poruwa Ceremony</h3>
                <p>07:30 AM</p>
              </div>
              <div className="detail-card card-venue">
                <div className="detail-icon-bubble">
                  <MapPin />
                </div>
                <h3>Venue</h3>
                <p>
                  The Deer Park Hotel<br />
                  Girithale, Sri Lanka
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* RSVP Section - Styled with matching theme colors (no image) */}
        <section className="section rsvp" id="rsvp">
          <div className="rsvp-glow rsvp-glow-gold" aria-hidden="true" />
          <div className="rsvp-glow rsvp-glow-emerald" aria-hidden="true" />
          <div className="rsvp-glow rsvp-glow-blush" aria-hidden="true" />
          <Reveal>
            <div className="eyebrow">YOUR PRESENCE MATTERS</div>
            <h2>Dear {guest?.name || 'Guest'},</h2>
            <div className="flourish">── ♥ ──</div>
            <p className="section-sub">
              We would be truly honored to have you with us on our special day. Please let us know if you will be
              attending.
            </p>
            <div className="rsvp-card-wrapper">
              {guest ? (
                <>
                  <p className="guest-note">
                    Your invitation is for up to {guest.seats} {guest.seats === 1 ? 'person' : 'people'}.
                  </p>
                  <div className="rsvp-actions">
                    <div className="rsvp-choice">
                      <label>Number attending</label>
                      <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                        {Array.from({ length: guest.seats }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      disabled={busy}
                      className={'btn rsvp-accept ' + (status === 'accepted' ? 'selected' : '')}
                      onClick={() => respond('accepted')}
                    >
                      <Check /> I'll Be There
                    </button>
                    <button
                      disabled={busy}
                      className={'btn outline rsvp-decline ' + (status === 'declined' ? 'selected' : '')}
                      onClick={() => respond('declined')}
                    >
                      <X /> Unable to Attend
                    </button>
                  </div>
                  <p className="response-note">
                    Current response: <b>{status}</b>
                  </p>
                </>
              ) : (
                <div className="guest-note">
                  Please open your personalized invitation link to respond. Your host can send you one.
                </div>
              )}
            </div>
          </Reveal>
        </section>

        {/* Wishes Section */}
        <section className="section wishes" id="wishes">
          <Reveal>
            <div className="eyebrow">SEND US YOUR WISHES</div>
            <h2>Leave a Message for the Couple</h2>
            <div className="flourish">── ♥ ──</div>
            <div className="message-card">
              <textarea
                placeholder={
                  guest ? 'Write your lovely message here...' : 'Open your personal invitation link to send a message.'
                }
                disabled={!guest || busy}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn" onClick={send} disabled={!guest || busy || !message.trim()}>
                <Send size={16} /> Send Message
              </button>
            </div>
            {feedback && (
              <p role="status" className="feedback">
                {feedback}
              </p>
            )}
          </Reveal>
        </section>

        {/* Location Section matching user reference design */}
        <section className="section location" id="location">
          <div className="loc-glow loc-glow-amber" aria-hidden="true" />
          <div className="loc-glow loc-glow-emerald" aria-hidden="true" />
          <div className="location-container">
            {/* Left Column: Heading, Subtitle and Pill Card */}
            <div className="location-info-side">
              <Reveal>
                <div className="location-eyebrow">WEDDING LOCATION</div>
                <p className="location-subtitle">Find your way to our special day.</p>

                <div className="location-pill-card">
                  <div className="location-pill-details">
                    <div className="location-icon-bubble">
                      <MapPin size={22} className="location-pin-icon" />
                    </div>
                    <div className="location-names">
                      <strong>The Deer Park Hotel</strong>
                      <span>Girithale, Sri Lanka</span>
                    </div>
                  </div>

                  <a
                    className="location-pill-btn"
                    href={map}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Get Directions</span>
                    <span className="btn-arrow">→</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Rounded Map Preview Card */}
            <div className="location-map-side">
              <Reveal delay={0.2}>
                <div className="location-map-card">
                  <iframe
                    title="The Deer Park Hotel Location Map"
                    src="https://maps.google.com/maps?q=The+Deer+Park+Hotel+Girithale+Sri+Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className="map-iframe"
                    loading="lazy"
                    allowFullScreen
                  />
                  {/* Floating Marker Badge matching reference image */}
                  <a
                    href={map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-floating-pin"
                    title="Open in Google Maps"
                  >
                    <div className="map-pin-red">
                      <MapPin size={18} fill="#e53935" stroke="#b71c1c" />
                    </div>
                    <div className="map-badge-text">
                      <strong>The Deer Park Hotel</strong>
                      <span>Girithale</span>
                    </div>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact" id="contact">
          <Reveal>
            <div className="eyebrow">FOR ANY INQUIRIES</div>
            <h2>Contact Us</h2>
            <div className="contact-grid">
              <a href="tel:0773163928">
                <div className="contact-icon-bubble">
                  <Phone size={20} />
                </div>
                <span>
                  Warnasooriya<br />
                  <b>0773163928</b>
                </span>
              </a>
              <a href="tel:+94717215710">
                <div className="contact-icon-bubble">
                  <Phone size={20} />
                </div>
                <span>
                  Harshani<br />
                  <b>+94 (71) 721 5710</b>
                </span>
              </a>
            </div>
          </Reveal>
        </section>

        {/* Footer matching user reference design */}
        <footer className="wedding-footer">
          <div className="footer-content">
            <h2 className="footer-couple-names">Chathura &amp; Gimasha</h2>
            <div className="footer-flourish" aria-hidden="true">
              <span className="footer-flourish-line" />
              <Heart size={14} fill="#ffffff" stroke="#ffffff" className="footer-flourish-heart" />
              <span className="footer-flourish-line" />
            </div>
            <div className="footer-date">03 DECEMBER 2026</div>
          </div>
        </footer>
      </main>
    </>
  );
}
