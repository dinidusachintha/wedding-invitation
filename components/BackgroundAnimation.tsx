'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  swing: number;
  swingSpeed: number;
  opacity: number;
  color: string;
  type: 'petal' | 'sparkle';
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

    // Color palettes for romantic wedding theme: soft rose, warm ivory, champagne, and gold
    const petalColors = [
      'rgba(244, 219, 216, ', // soft blush rose
      'rgba(255, 238, 227, ', // ivory peach
      'rgba(235, 214, 186, ', // champagne gold
      'rgba(255, 250, 240, ', // floral cream
    ];

    const sparkleColors = [
      'rgba(218, 178, 107, ', // rich gold
      'rgba(247, 230, 185, ', // luminous gold
      'rgba(255, 255, 255, ', // pure white sparkle
    ];

    const particleCount = width < 768 ? 40 : 70;
    const particles: Petal[] = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const isSparkle = i % 3 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSparkle ? Math.random() * 2.5 + 1 : Math.random() * 10 + 8,
        speedX: isSparkle ? (Math.random() - 0.5) * 0.4 : Math.random() * 0.6 + 0.3,
        speedY: isSparkle ? (Math.random() - 0.5) * 0.3 - 0.2 : Math.random() * 0.8 + 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.6 + 0.25,
        color: isSparkle
          ? sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
          : petalColors[Math.floor(Math.random() * petalColors.length)],
        type: isSparkle ? 'sparkle' : 'petal',
      });
    }

    // Draw single petal shape
    const drawPetal = (
      p: Petal,
      ctx: CanvasRenderingContext2D
    ) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      // Scale to simulate 3D tumbling flip
      const scaleX = Math.cos(p.swing);
      ctx.scale(scaleX, 1);

      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.beginPath();
      // Draw organic petal curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        p.size * 0.5,
        -p.size * 0.8,
        p.size * 1.1,
        -p.size * 0.3,
        p.size,
        p.size * 0.5
      );
      ctx.bezierCurveTo(
        p.size * 0.8,
        p.size * 1.1,
        p.size * 0.2,
        p.size * 0.9,
        0,
        0
      );
      ctx.fill();

      // Subtle delicate vein line down the petal center
      ctx.strokeStyle = `rgba(215, 180, 150, ${p.opacity * 0.35})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.size * 0.4, p.size * 0.2, p.size * 0.7, p.size * 0.6);
      ctx.stroke();

      ctx.restore();
    };

    // Draw twinkling golden sparkle
    const drawSparkle = (
      p: Petal,
      ctx: CanvasRenderingContext2D,
      time: number
    ) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      // Twinkle pulsation
      const pulse = Math.sin(time * 0.003 + p.swing) * 0.4 + 0.6;
      const alpha = p.opacity * pulse;

      // Outer glow
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.8);
      grad.addColorStop(0, `${p.color}${alpha})`);
      grad.addColorStop(0.5, `${p.color}${alpha * 0.35})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // 4-point golden star core
      ctx.fillStyle = `${p.color}${alpha * 1.2})`;
      ctx.beginPath();
      const r = p.size * 1.8;
      const inner = p.size * 0.35;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a + Math.PI / 4) * inner, Math.sin(a + Math.PI / 4) * inner);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.swing += p.swingSpeed;
        p.rotation += p.rotationSpeed;

        if (p.type === 'petal') {
          // Petal drifting physics: falling down with sinusoidal swaying
          p.x += Math.sin(p.swing) * 1.1 + p.speedX;
          p.y += p.speedY;
          drawPetal(p, ctx);
        } else {
          // Sparkle floating physics: gentle ambient drift
          p.x += Math.sin(p.swing * 0.6) * 0.5 + p.speedX;
          p.y += Math.cos(p.swing * 0.5) * 0.5 + p.speedY;
          drawSparkle(p, ctx, time);
        }

        // Wrap around screen boundaries smoothly
        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -25) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        if (p.x > width + 25) {
          p.x = -20;
        } else if (p.x < -25) {
          p.x = width + 20;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

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
