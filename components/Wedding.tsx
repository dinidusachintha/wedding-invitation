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
const mapUrl = 'https://maps.app.goo.gl/gwr9NAbTvqUno7ePA?g_st=iw';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
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
        console.log('Autoplay prevented:', err);
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
      {/* Background Wedding Audio */}
      <audio
        ref={audioRef}
        src="/audio/wedding-melody.mp3"
        loop
        preload="auto"
      />

      {/* Floating Music Controller */}
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

      {/* InviteMint-style Luxury Interactive Cover Screen */}
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
            {/* Top Floral Garland Arch */}
            <div className="cover-floral-arch-wrap" aria-hidden="true">
              <img
                src="/images/floral-arch.png"
                alt="Watercolor floral arch"
                className="cover-floral-arch-img"
              />
            </div>

            {/* Ambient Petals Canvas */}
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

            {/* Center Traditional Couple Illustration */}
            <div className="cover-couple-center">
              <div className="cover-couple-halo" aria-hidden="true" />
              <img
                src="/images/kandyan-couple.png"
                alt="Chathura and Gimasha"
                className="cover-couple-img"
              />
            </div>

            {/* Bottom "OPEN INVITATION" Card */}
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

        {/* Ambient Subtle Petal Drift Background */}
        <BackgroundAnimation />

        {/* Minimal Floating Navigation */}
        <motion.header
          className="nav-minimal"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a
            href="#home"
            className="brand-monogram"
            onClick={(e) => handleSmoothScroll(e, 'home')}
          >
            C <span>♥</span> G
          </a>
          <nav>
            <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')}>
              Home
            </a>
            <a href="#countdown" onClick={(e) => handleSmoothScroll(e, 'countdown')}>
              Countdown
            </a>
            <a href="#couple" onClick={(e) => handleSmoothScroll(e, 'couple')}>
              Couple
            </a>
            <a href="#details" onClick={(e) => handleSmoothScroll(e, 'details')}>
              Details
            </a>
            <a href="#rsvp" onClick={(e) => handleSmoothScroll(e, 'rsvp')}>
              RSVP
            </a>
            <a href="#venue" onClick={(e) => handleSmoothScroll(e, 'venue')}>
              Venue
            </a>
          </nav>
          <button
            className="nav-cover-btn"
            onClick={() => setOpened(false)}
          >
            Cover ♡
          </button>
        </motion.header>

        {/* 1. HERO SECTION (EDITORIAL & CLEAN) */}
        <section className="clean-hero" id="home">
          <Reveal>
            <div className="hero-eyebrow">TOGETHER WITH THEIR FAMILIES</div>
            <h1 className="hero-names">
              Chathura <em>&amp;</em> Gimasha
            </h1>
            <div className="hero-date-pill">
              Thursday, December 03, 2026
            </div>
            <p className="hero-message">
              With joyous hearts, we warmly invite you to celebrate our union as we exchange vows
              and begin our new journey together.
            </p>
            <a
              className="btn-minimal"
              href="#countdown"
              onClick={(e) => handleSmoothScroll(e, 'countdown')}
            >
              Explore Invitation <ArrowDown size={15} />
            </a>
          </Reveal>
        </section>

        {/* 2. COUNTDOWN SECTION */}
        <section className="clean-section" id="countdown">
          <Reveal>
            <div className="section-eyebrow">SAVING THE DATE</div>
            <h2 className="section-title">Counting Down to Forever</h2>
            <div className="section-flourish">
              <Heart size={16} fill="#c59b43" stroke="#c59b43" />
            </div>

            <div className="countdown-grid">
              {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, idx) => (
                <div className="countdown-card" key={label}>
                  <div className="countdown-number">
                    {String(time[idx]).padStart(2, '0')}
                  </div>
                  <div className="countdown-label">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 3. THE HAPPY COUPLE SECTION */}
        <section className="clean-section" id="couple">
          <Reveal>
            <div className="section-eyebrow">THE BRIDE &amp; GROOM</div>
            <h2 className="section-title">Two Hearts, One Journey</h2>
            <div className="section-flourish">
              <Heart size={16} fill="#c59b43" stroke="#c59b43" />
            </div>

            <div className="couple-container">
              {/* Groom */}
              <div className="couple-person-card">
                <div className="couple-avatar-wrap">
                  <img
                    src="/images/groom.png"
                    alt="Chathura - The Groom"
                    className="couple-avatar-img"
                  />
                </div>
                <span className="couple-role-tag">THE GROOM</span>
                <h3 className="couple-name">Chathura</h3>
                <p className="couple-parents">
                  Son of<br />
                  Mr &amp; Mrs W.K.D. Rathnayake
                </p>
              </div>

              {/* Center Heart Emblem */}
              <div className="couple-center-connector">
                <div className="couple-center-heart">
                  <Heart size={20} fill="#c59b43" stroke="#c59b43" />
                </div>
                <span className="couple-forever-text">Forever &amp; Always</span>
              </div>

              {/* Bride */}
              <div className="couple-person-card">
                <div className="couple-avatar-wrap">
                  <img
                    src="/images/bride.png"
                    alt="Gimasha - The Bride"
                    className="couple-avatar-img"
                  />
                </div>
                <span className="couple-role-tag">THE BRIDE</span>
                <h3 className="couple-name">Gimasha</h3>
                <p className="couple-parents">
                  Daughter of<br />
                  Mr &amp; Mrs W.M.E. Warnasooriya
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 4. WEDDING DETAILS & ITINERARY */}
        <section className="clean-section" id="details">
          <Reveal>
            <div className="section-eyebrow">EVENT SCHEDULE</div>
            <h2 className="section-title">Wedding Itinerary</h2>
            <div className="section-flourish">
              <Heart size={16} fill="#c59b43" stroke="#c59b43" />
            </div>
            <p className="section-subtext">
              We kindly ask our honored guests to join us for our auspicious ceremonies and celebratory reception.
            </p>

            <div className="details-grid">
              {/* Poruwa */}
              <div className="event-card">
                <div className="event-icon-circle">
                  <Flower2 size={24} />
                </div>
                <h3 className="event-title">Poruwa Ceremony</h3>
                <div className="event-time">07:30 AM</div>
                <p className="event-desc">
                  Traditional Sri Lankan wedding customs, blessing chants, and rings exchange.
                </p>
              </div>

              {/* Celebration / Reception */}
              <div className="event-card">
                <div className="event-icon-circle">
                  <Clock3 size={24} />
                </div>
                <h3 className="event-title">Wedding Reception</h3>
                <div className="event-time">10:00 AM – 04:00 PM</div>
                <p className="event-desc">
                  Celebration banquet, traditional lunch, champagne toast, and festive dancing.
                </p>
              </div>

              {/* Venue */}
              <div className="event-card">
                <div className="event-icon-circle">
                  <MapPin size={24} />
                </div>
                <h3 className="event-title">The Deer Park Hotel</h3>
                <div className="event-time">Girithale, Sri Lanka</div>
                <p className="event-desc">
                  A serene lakeside retreat surrounded by nature and timeless history.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 5. RSVP SECTION */}
        <section className="clean-section" id="rsvp">
          <Reveal>
            <div className="section-eyebrow">KINDLY RESPOND</div>
            <h2 className="section-title">Will You Join Us?</h2>
            <div className="section-flourish">
              <Heart size={16} fill="#c59b43" stroke="#c59b43" />
            </div>

            <div className="rsvp-wrapper">
              <h3 className="guest-greeting">Dear {guest?.name || 'Honored Guest'},</h3>
              <p className="guest-limit-note">
                {guest
                  ? `Your invitation is reserved for up to ${guest.seats} ${guest.seats === 1 ? 'seat' : 'seats'}.`
                  : 'Please open your personal invitation link to confirm your attendance.'}
              </p>

              {guest ? (
                <>
                  <div className="rsvp-selector-row">
                    <label>Number of Guests Attending:</label>
                    <select
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                    >
                      {Array.from({ length: guest.seats }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rsvp-buttons-row">
                    <button
                      disabled={busy}
                      className={`btn-rsvp btn-rsvp-accept ${status === 'accepted' ? 'selected' : ''}`}
                      onClick={() => respond('accepted')}
                    >
                      <Check size={16} /> Attending
                    </button>
                    <button
                      disabled={busy}
                      className={`btn-rsvp btn-rsvp-decline ${status === 'declined' ? 'selected' : ''}`}
                      onClick={() => respond('declined')}
                    >
                      <X size={16} /> Regretfully Decline
                    </button>
                  </div>

                  <p className="rsvp-status-note">
                    Your current status: <b>{status}</b>
                  </p>
                </>
              ) : null}

              {/* Wishes Guestbook */}
              <div style={{ marginTop: '28px', borderTop: '1px solid var(--gold-border)', paddingTop: '24px' }}>
                <textarea
                  className="wishes-textarea"
                  placeholder={
                    guest
                      ? 'Leave your warm wishes and blessings for the couple...'
                      : 'Open your personalized invitation link to send wishes.'
                  }
                  disabled={!guest || busy}
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="btn-minimal"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={send}
                  disabled={!guest || busy || !message.trim()}
                >
                  <Send size={15} /> Send Warm Wishes
                </button>
              </div>

              {feedback && (
                <p style={{ marginTop: '16px', fontSize: '14px', color: '#1e5631', fontWeight: 500 }}>
                  {feedback}
                </p>
              )}
            </div>
          </Reveal>
        </section>

        {/* 6. VENUE LOCATION */}
        <section className="clean-section" id="venue">
          <Reveal>
            <div className="section-eyebrow">THE LOCATION</div>
            <h2 className="section-title">Getting There</h2>
            <div className="section-flourish">
              <Heart size={16} fill="#c59b43" stroke="#c59b43" />
            </div>

            <div className="venue-card-wrapper">
              <div className="venue-info-side">
                <span className="section-eyebrow">VENUE</span>
                <h3 className="venue-name">The Deer Park Hotel</h3>
                <p className="venue-address">
                  Girithale, Polonnaruwa<br />
                  Sri Lanka
                </p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venue-directions-btn"
                >
                  <Navigation size={15} /> Get Directions
                </a>
              </div>

              <div className="venue-map-side">
                <iframe
                  title="The Deer Park Hotel Location Map"
                  src="https://maps.google.com/maps?q=The+Deer+Park+Hotel+Girithale+Sri+Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="venue-map-iframe"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* 7. CLEAN MINIMALIST FOOTER */}
        <footer className="clean-footer">
          <div className="footer-names">Chathura &amp; Gimasha</div>
          <div className="footer-date">December 03, 2026 • Girithale, Sri Lanka</div>
          <div className="footer-sub">Thank you for sharing in our happiness and love.</div>
        </footer>
      </main>
    </>
  );
}
