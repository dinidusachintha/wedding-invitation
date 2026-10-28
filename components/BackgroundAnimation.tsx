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
  type: 'green-leaf' | 'gold-stardust' | 'gold-petal' | 'dusty-petal';
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

    // Green Eucalyptus & Sage Leaves (minimalist nature)
    const greenLeafColors = [
      'rgba(78, 114, 91, ',   // eucalyptus deep
      'rgba(102, 138, 113, ', // sage green
      'rgba(128, 160, 137, ', // pale silvery olive
      'rgba(90, 122, 101, ',  // muted botanical green
    ];

    // Champagne Gold & Gold Foil Sparkles
    const goldColors = [
      'rgba(197, 155, 67, ',  // classic royal gold
      'rgba(218, 175, 75, ',  // warm champagne gold
      'rgba(235, 204, 125, ', // luminous gold highlight
      'rgba(250, 235, 195, ', // stardust shimmer
    ];

    // Delicate Dusty Blue & Hydrangea accents (matching the floral garland)
    const dustyPetalColors = [
      'rgba(132, 162, 190, ', // dusty blue
      'rgba(168, 193, 215, ', // soft hydrangea
    ];

    const count = width < 768 ? 22 : 38;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let type: 'green-leaf' | 'gold-stardust' | 'gold-petal' | 'dusty-petal' = 'green-leaf';
      let color = greenLeafColors[Math.floor(Math.random() * greenLeafColors.length)];

      if (rand < 0.35) {
        // Shimmering Champagne Gold Stardust
        type = 'gold-stardust';
        color = goldColors[Math.floor(Math.random() * goldColors.length)];
      } else if (rand < 0.65) {
        // Elegant Green Eucalyptus Leaf
        type = 'green-leaf';
        color = greenLeafColors[Math.floor(Math.random() * greenLeafColors.length)];
      } else if (rand < 0.85) {
        // Gold Outline Petal / Leaf
        type = 'gold-petal';
        color = goldColors[Math.floor(Math.random() * goldColors.length)];
      } else {
        // Soft Dusty Blue petal
        type = 'dusty-petal';
        color = dustyPetalColors[Math.floor(Math.random() * dustyPetalColors.length)];
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radiusX:
          type === 'gold-stardust'
            ? Math.random() * 1.6 + 0.8
            : type === 'green-leaf'
            ? Math.random() * 3.5 + 2.5
            : Math.random() * 4.2 + 3.0,
        radiusY:
          type === 'gold-stardust'
            ? Math.random() * 1.6 + 0.8
            : type === 'green-leaf'
            ? Math.random() * 7.5 + 5.5
            : Math.random() * 7.0 + 5.0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        speedY: type === 'gold-stardust' ? Math.random() * 0.22 + 0.1 : Math.random() * 0.45 + 0.25,
        swaySpeed: Math.random() * 0.012 + 0.006,
        swayOffset: Math.random() * Math.PI * 2,
        opacity:
          type === 'green-leaf'
            ? Math.random() * 0.28 + 0.16
            : type === 'gold-stardust'
            ? Math.random() * 0.55 + 0.3
            : Math.random() * 0.32 + 0.18,
        color,
        type,
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient glowing light gradient drifting in background
      const ambientGlowX = width * 0.5 + Math.sin(frame * 0.003) * (width * 0.2);
      const ambientGlowY = height * 0.3 + Math.cos(frame * 0.0025) * (height * 0.15);
      const ambientGrad = ctx.createRadialGradient(
        ambientGlowX,
        ambientGlowY,
        20,
        ambientGlowX,
        ambientGlowY,
        width * 0.7
      );
      // Soft champagne gold & eucalyptus aura
      ambientGrad.addColorStop(0, 'rgba(218, 175, 75, 0.035)');
      ambientGrad.addColorStop(0.45, 'rgba(102, 138, 113, 0.02)');
      ambientGrad.addColorStop(1, 'rgba(251, 249, 245, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion physics: gentle fall with soft horizontal drift
        p.y += p.speedY;
        p.x += Math.sin(frame * p.swaySpeed + p.swayOffset) * 0.55;
        p.rotation += p.rotationSpeed;

        // Reset particle smoothly when it moves past screen edges
        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) p.x = -20;
        if (p.x < -25) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.type === 'gold-stardust') {
          // Luminous golden stardust with soft star sparkle
          const pulse = Math.sin(frame * 0.06 + p.swayOffset) * 0.35 + 0.85;
          ctx.fillStyle = `${p.color}${p.opacity * pulse})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.radiusX, 0, Math.PI * 2);
          ctx.fill();

          // 4-point subtle star highlight
          if (p.radiusX > 1.4) {
            ctx.strokeStyle = `rgba(255, 250, 220, ${p.opacity * pulse * 0.85})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(-p.radiusX * 1.8, 0);
            ctx.lineTo(p.radiusX * 1.8, 0);
            ctx.moveTo(0, -p.radiusX * 1.8);
            ctx.lineTo(0, p.radiusX * 1.8);
            ctx.stroke();
          }
        } else if (p.type === 'green-leaf') {
          // Minimalist Green Eucalyptus Leaf
          ctx.rotate(p.rotation);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
          ctx.fill();

          // Delicate fine champagne gold center stem
          ctx.strokeStyle = `rgba(197, 155, 67, ${p.opacity * 0.55})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(0, -p.radiusY * 0.85);
          ctx.lineTo(0, p.radiusY * 0.85);
          ctx.stroke();
        } else if (p.type === 'gold-petal') {
          // Delicate Gold Outline Floral Petal (minimalist luxury)
          ctx.rotate(p.rotation);
          ctx.strokeStyle = `rgba(197, 155, 67, ${p.opacity * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.fillStyle = `rgba(247, 238, 219, ${p.opacity * 0.3})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          // Dusty blue petal
          ctx.rotate(p.rotation);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
          ctx.fill();

          // Delicate gold vein
          ctx.strokeStyle = `rgba(197, 155, 67, ${p.opacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, -p.radiusY * 0.6);
          ctx.lineTo(0, p.radiusY * 0.6);
          ctx.stroke();
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
