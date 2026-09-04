// Shared speaker identity used by the stage nameplate, panorama cards and filmstrip.
export const SPEAKERS = {
  narrator: { name: "NARRATION", role: "Chronicle", hex: "#94a3b8", text: "text-slate-300", border: "border-slate-500/40", bg: "bg-slate-500/10" },
  arthur:   { name: "ARTHUR PENDELTON", role: "Salvage contractor, overdue on everything", hex: "#f59e0b", text: "text-amber-400", border: "border-amber-500/40", bg: "bg-amber-500/10" },
  valerie:  { name: "VAL-9", role: "Unlicensed shipboard AI, casino-dumpster provenance", hex: "#22d3ee", text: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500/10" },
  system:   { name: "IRON PELICAN", role: "Vessel telemetry HUD", hex: "#fb7185", text: "text-rose-400", border: "border-rose-500/40", bg: "bg-rose-500/10" },
  station:  { name: "AEGIS-IV", role: "Automated black-site broadcast", hex: "#a855f7", text: "text-purple-400", border: "border-purple-500/40", bg: "bg-purple-500/10" }
};

export function getSpeaker(key) {
  return SPEAKERS[key] || SPEAKERS.narrator;
}

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
