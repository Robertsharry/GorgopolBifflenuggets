import React, { useEffect, useRef } from "react";

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [56, 189, 248];
}

// Parallax starfield + Jovian horizon whose nebula colour, particle style and
// pulse follow the current beat's tone.
export default function BackgroundCanvas({ tone, toneKey, scrollProgress = 0, isPlaying = false }) {
  const canvasRef = useRef(null);
  const propsRef = useRef({ tone, scrollProgress, isPlaying });
  const flashRef = useRef(0);
  const lastToneKeyRef = useRef(toneKey);

  useEffect(() => {
    propsRef.current = { tone, scrollProgress, isPlaying };
  }, [tone, scrollProgress, isPlaying]);

  // Trigger a screen flash when moving onto an impact/burn beat
  useEffect(() => {
    if (toneKey !== lastToneKeyRef.current) {
      lastToneKeyRef.current = toneKey;
      if (tone?.flash) flashRef.current = 0.55;
      else if (tone?.pulse) flashRef.current = 0.25;
    }
  }, [toneKey, tone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 2 + 0.5,
      radius: Math.random() * 1.5 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 ? "#93c5fd" : Math.random() > 0.9 ? "#fed7aa" : "#ffffff"
    }));

    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.8,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.2,
      seed: Math.random() * Math.PI * 2
    }));

    let tick = 0;
    let currentScrollSmooth = propsRef.current.scrollProgress;
    const currentRgb = [...(propsRef.current.tone?.rgb || [14, 27, 42])];
    const currentAccent = hexToRgb(propsRef.current.tone?.accent);
    let currentIntensity = propsRef.current.tone?.intensity ?? 0.4;

    const render = () => {
      tick++;
      const { tone, scrollProgress, isPlaying } = propsRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      currentScrollSmooth += (scrollProgress - currentScrollSmooth) * 0.08;

      // Interpolate nebula colour and accent towards the beat tone
      const target = tone?.rgb || [14, 27, 42];
      const targetAccent = hexToRgb(tone?.accent);
      for (let i = 0; i < 3; i++) {
        currentRgb[i] += (target[i] - currentRgb[i]) * 0.035;
        currentAccent[i] += (targetAccent[i] - currentAccent[i]) * 0.05;
      }
      currentIntensity += ((tone?.intensity ?? 0.4) - currentIntensity) * 0.04;

      const pulse = tone?.pulse ? 0.12 * Math.sin(tick * 0.09) : 0;
      const [r, g, b] = currentRgb.map(Math.round);

      ctx.fillStyle = "#05070b";
      ctx.fillRect(0, 0, width, height);

      // Nebula bloom
      const bloomAlpha = Math.min(0.85, 0.35 + currentIntensity * 0.45 + pulse);
      const grad = ctx.createRadialGradient(
        width * 0.5 - ((currentScrollSmooth * 400) % width),
        height * 0.42,
        40,
        width * 0.5,
        height * 0.5,
        width * 0.9
      );
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${bloomAlpha})`);
      grad.addColorStop(0.55, `rgba(${Math.round(r * 0.45)}, ${Math.round(g * 0.45)}, ${Math.round(b * 0.45)}, ${bloomAlpha * 0.45})`);
      grad.addColorStop(1, "rgba(5, 7, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Jovian horizon
      ctx.save();
      const planetY = height * 1.35;
      const planetRadius = width * 0.9;
      const planetX = width * 0.5 - currentScrollSmooth * 120;
      const planetGrad = ctx.createRadialGradient(planetX, planetY, planetRadius * 0.6, planetX, planetY, planetRadius);
      planetGrad.addColorStop(0, "#1c140e");
      planetGrad.addColorStop(0.7, "#2c1c14");
      planetGrad.addColorStop(0.96, "#5c331a");
      planetGrad.addColorStop(1, `rgba(${currentAccent[0]}, ${currentAccent[1]}, ${currentAccent[2]}, 0.45)`);
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.fill();
      ctx.strokeStyle = `rgba(${currentAccent[0]}, ${currentAccent[1]}, ${currentAccent[2]}, ${0.18 + Math.sin(tick * 0.02) * 0.05 + pulse * 0.5})`;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // Stars
      stars.forEach((star) => {
        const parallaxX = (star.x - currentScrollSmooth * 800 * (star.z * 0.35)) % width;
        const finalX = parallaxX < 0 ? parallaxX + width : parallaxX;
        const twinkle = Math.sin(tick * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.baseAlpha * twinkle;
        ctx.beginPath();
        ctx.arc(finalX, star.y, star.radius * star.z, 0, Math.PI * 2);
        ctx.fill();
      });

      // Tone particles
      const style = tone?.particle || "dust";
      const drift = tone?.drift ?? 0.3;
      const accentCss = `rgb(${currentAccent[0]}, ${currentAccent[1]}, ${currentAccent[2]})`;

      particles.forEach((p) => {
        const speedBoost = (isPlaying ? 0.5 : 0.15) + drift * 0.6;
        if (style === "embers") {
          p.x += p.vx * 0.6 + Math.sin(tick * 0.02 + p.seed) * 0.3;
          p.y -= 0.5 + drift * 0.8 + p.size * 0.15;
        } else if (style === "static") {
          if (tick % 3 === 0) {
            p.x += (Math.random() - 0.5) * 6;
            p.y += (Math.random() - 0.5) * 6;
          }
          p.x += speedBoost * 0.4;
        } else {
          p.x += p.vx + speedBoost;
          p.y += p.vy;
        }
        p.rotation += p.rotSpeed * (1 + drift);

        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.y < -20) p.y = height + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = accentCss;

        if (style === "shards") {
          ctx.globalAlpha = p.opacity * 0.85;
          ctx.beginPath();
          ctx.moveTo(-p.size * 2.2, 0);
          ctx.lineTo(0, -p.size);
          ctx.lineTo(p.size * 2.2, 0);
          ctx.lineTo(0, p.size);
          ctx.closePath();
          ctx.fill();
        } else if (style === "embers") {
          const flicker = 0.6 + 0.4 * Math.sin(tick * 0.2 + p.seed);
          ctx.globalAlpha = p.opacity * flicker;
          ctx.shadowBlur = 8;
          ctx.shadowColor = accentCss;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        } else if (style === "static") {
          ctx.globalAlpha = p.opacity * (Math.random() > 0.5 ? 0.9 : 0.2);
          ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2.5, p.size * 0.8);
        } else {
          ctx.globalAlpha = p.opacity * (0.25 + currentIntensity * 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Flash on impacts
      if (flashRef.current > 0.005) {
        ctx.globalAlpha = flashRef.current;
        ctx.fillStyle = accentCss;
        ctx.fillRect(0, 0, width, height);
        flashRef.current *= 0.9;
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ display: "block" }} />;
}
