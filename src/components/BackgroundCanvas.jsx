import React, { useEffect, useRef } from "react";

export default function BackgroundCanvas({ currentChapter, scrollProgress = 0, isPlaying = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Handle high-DPI displays
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate Stars
    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 2 + 0.5, // depth factor
      radius: Math.random() * 1.5 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 ? "#93c5fd" : Math.random() > 0.9 ? "#fed7aa" : "#ffffff"
    }));

    // Environmental particles (ice crystals, embers, micro-debris)
    const PARTICLE_COUNT = 45;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.8,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.2
    }));

    let tick = 0;
    let currentScrollSmooth = scrollProgress;

    // Color transition interpolation
    let currentRgb = [14, 27, 42]; // default dark blue
    const getTargetRgb = (themeColor) => {
      switch (themeColor) {
        case "#ef4444": return [75, 12, 12]; // Agony red
        case "#f59e0b": return [60, 30, 6]; // Tension amber
        case "#e11d48": return [65, 10, 28]; // Spite rose
        case "#a855f7": return [45, 16, 80]; // Epiphany violet
        case "#f97316": return [85, 35, 10]; // Burn orange
        case "#10b981": return [6, 45, 35]; // Dawn emerald
        default: return [14, 27, 42]; // Cold void blue
      }
    };

    const render = () => {
      tick++;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Smooth scroll interpolation for silky parallax
      currentScrollSmooth += (scrollProgress - currentScrollSmooth) * 0.08;

      // Interpolate background nebula colors
      const target = getTargetRgb(currentChapter?.theme?.accent);
      currentRgb[0] += (target[0] - currentRgb[0]) * 0.03;
      currentRgb[1] += (target[1] - currentRgb[1]) * 0.03;
      currentRgb[2] += (target[2] - currentRgb[2]) * 0.03;

      // Clear with gradient
      ctx.fillStyle = "#05070b";
      ctx.fillRect(0, 0, width, height);

      // Chapter Nebula Bloom
      const grad = ctx.createRadialGradient(
        width * 0.5 - (currentScrollSmooth * 400) % width,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        width * 0.85
      );
      grad.addColorStop(0, `rgba(${Math.round(currentRgb[0])}, ${Math.round(currentRgb[1])}, ${Math.round(currentRgb[2])}, 0.55)`);
      grad.addColorStop(0.6, `rgba(${Math.round(currentRgb[0] * 0.4)}, ${Math.round(currentRgb[1] * 0.4)}, ${Math.round(currentRgb[2] * 0.4)}, 0.2)`);
      grad.addColorStop(1, "rgba(5, 7, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Distant Jovian Horizon (atmospheric curve)
      ctx.save();
      const planetY = height * 1.35;
      const planetRadius = width * 0.9;
      const planetX = width * 0.5 - (currentScrollSmooth * 120);

      const planetGrad = ctx.createRadialGradient(
        planetX, planetY, planetRadius * 0.6,
        planetX, planetY, planetRadius
      );
      planetGrad.addColorStop(0, "#1c140e");
      planetGrad.addColorStop(0.7, "#2c1c14");
      planetGrad.addColorStop(0.96, "#5c331a");
      planetGrad.addColorStop(1, "rgba(234, 88, 12, 0.45)"); // glowing limb

      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.fill();

      // Atmospheric outer glow on planet rim
      ctx.strokeStyle = `rgba(251, 146, 60, ${0.18 + Math.sin(tick * 0.02) * 0.05})`;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // Render Parallax Stars
      stars.forEach((star) => {
        // Horizontal parallax offset based on star depth (z)
        const parallaxX = (star.x - currentScrollSmooth * 800 * (star.z * 0.35)) % width;
        const finalX = parallaxX < 0 ? parallaxX + width : parallaxX;

        // Twinkle factor
        const twinkle = Math.sin(tick * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.baseAlpha * twinkle;

        ctx.beginPath();
        ctx.arc(finalX, star.y, star.radius * star.z, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Floating Particles (Space debris / sparks / ice)
      const isAgonyOrAlarm = currentChapter?.mood === "agony" || currentChapter?.mood === "alarm";
      const isBurn = currentChapter?.mood === "burn" || currentChapter?.mood === "climax";
      const particleColor = isAgonyOrAlarm ? "#f87171" : isBurn ? "#fb923c" : "#38bdf8";

      particles.forEach((p) => {
        p.x += p.vx + (isPlaying ? 0.4 : 0.1);
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.y < -20) p.y = height + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity * (isAgonyOrAlarm ? 0.8 : 0.35);

        if (isAgonyOrAlarm) {
          // Sharp ice shards
          ctx.beginPath();
          ctx.moveTo(-p.size * 2, 0);
          ctx.lineTo(0, -p.size);
          ctx.lineTo(p.size * 2, 0);
          ctx.lineTo(0, p.size);
          ctx.closePath();
          ctx.fill();
        } else {
          // Soft ambient dust motes
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentChapter, scrollProgress, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: "block" }}
    />
  );
}
