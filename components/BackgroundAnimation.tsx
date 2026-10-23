'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  rotationSpeed: number;
  speedY: number;
  swaySpeed: number;
  swayOffset: number;
  opacity: number;
  color: string;
  isSparkle: boolean;
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm, romantic wedding tones: soft rose, ivory blush, and champagne
    const petalColors = [
      'rgba(244, 219, 216, ', // blush rose
      'rgba(255, 238, 227, ', // warm ivory
      'rgba(235, 214, 186, ', // champagne
    ];
    const sparkleColor = 'rgba(232, 197, 138, '; // warm subtle gold

    // Particle count calibrated for a serene, uncluttered aesthetic
    const count = width < 768 ? 16 : 30;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const isSparkle = i % 4 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radiusX: isSparkle ? Math.random() * 1.5 + 1 : Math.random() * 4 + 4,
        radiusY: isSparkle ? Math.random() * 1.5 + 1 : Math.random() * 7 + 7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        speedY: isSparkle ? Math.random() * 0.3 + 0.15 : Math.random() * 0.6 + 0.4,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: isSparkle ? Math.random() * 0.4 + 0.3 : Math.random() * 0.35 + 0.2,
        color: isSparkle
          ? sparkleColor
          : petalColors[Math.floor(Math.random() * petalColors.length)],
        isSparkle,
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion physics: gentle fall with soft horizontal drift
        p.y += p.speedY;
        p.x += Math.sin(frame * p.swaySpeed + p.swayOffset) * 0.5;
        p.rotation += p.rotationSpeed;

        // Reset particle smoothly when it moves past screen edges
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.isSparkle) {
          // Delicate ambient sparkle dot with soft pulse
          const pulse = Math.sin(frame * 0.05 + p.swayOffset) * 0.2 + 0.8;
          ctx.fillStyle = `${p.color}${p.opacity * pulse})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.radiusX, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Clean, graceful minimalist petal ellipse
          ctx.rotate(p.rotation);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="wedding-bg-canvas"
      aria-hidden="true"
    />
  );
}
