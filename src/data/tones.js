// Per-beat emotional tone palette. Drives the background nebula colour,
// particle style, and the accent glow on the stage text.
export const TONES = {
  drift:   { label: "Cold Drift",     rgb: [14, 27, 42],   accent: "#38bdf8", particle: "dust",   intensity: 0.35, drift: 0.3 },
  cynical: { label: "Gallows Humor",  rgb: [46, 32, 10],   accent: "#f59e0b", particle: "dust",   intensity: 0.4,  drift: 0.35 },
  glitch:  { label: "Signal Noise",   rgb: [6, 44, 52],    accent: "#22d3ee", particle: "static", intensity: 0.5,  drift: 0.6 },
  dread:   { label: "Creeping Dread", rgb: [28, 10, 40],   accent: "#a78bfa", particle: "dust",   intensity: 0.3,  drift: 0.15 },
  silence: { label: "Dead Silence",   rgb: [10, 14, 28],   accent: "#94a3b8", particle: "dust",   intensity: 0.18, drift: 0.08 },
  alarm:   { label: "Red Alert",      rgb: [88, 10, 14],   accent: "#ef4444", particle: "shards", intensity: 0.8,  drift: 0.9,  pulse: true },
  impact:  { label: "Impact",         rgb: [96, 42, 10],   accent: "#fb923c", particle: "shards", intensity: 0.85, drift: 1.2,  flash: true },
  agony:   { label: "Agony",          rgb: [72, 8, 10],    accent: "#f87171", particle: "shards", intensity: 0.9,  drift: 1.0,  pulse: true },
  spite:   { label: "Pure Spite",     rgb: [70, 10, 32],   accent: "#fb7185", particle: "embers", intensity: 0.7,  drift: 0.7 },
  wonder:  { label: "Cosmic Wonder",  rgb: [46, 18, 84],   accent: "#c084fc", particle: "dust",   intensity: 0.55, drift: 0.2 },
  burn:    { label: "Full Burn",      rgb: [112, 46, 8],   accent: "#f97316", particle: "embers", intensity: 1.0,  drift: 1.6,  flash: true },
  warm:    { label: "Warm Dawn",      rgb: [8, 58, 44],    accent: "#34d399", particle: "dust",   intensity: 0.45, drift: 0.2 }
};

export function getTone(key) {
  return TONES[key] || TONES.drift;
}
