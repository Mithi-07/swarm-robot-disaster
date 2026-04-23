"use client";

import type { EarthquakeStatus, SeismicLevel } from "@/hooks/useEarthquakeDetection";

interface EarthquakeAlertProps {
  status: EarthquakeStatus;
}

function getSeismicStyles(level: SeismicLevel) {
  switch (level) {
    case "SEVERE":
      return {
        border: "border-orange-500/40",
        bg: "bg-gradient-to-br from-orange-500/10 to-red-900/10",
        icon: "text-orange-400",
        text: "text-orange-300",
        badge: "bg-orange-500/20 text-orange-400",
        bar: "bg-orange-500",
        glow: "shadow-orange-500/10",
      };
    case "MODERATE":
      return {
        border: "border-yellow-500/30",
        bg: "bg-gradient-to-br from-yellow-500/10 to-amber-900/10",
        icon: "text-yellow-400",
        text: "text-yellow-300",
        badge: "bg-yellow-500/20 text-yellow-400",
        bar: "bg-yellow-500",
        glow: "shadow-yellow-500/10",
      };
    case "MINOR":
      return {
        border: "border-blue-500/20",
        bg: "bg-gradient-to-br from-blue-500/5 to-slate-900/5",
        icon: "text-blue-400",
        text: "text-blue-300",
        badge: "bg-blue-500/20 text-blue-400",
        bar: "bg-blue-500",
        glow: "",
      };
    default:
      return {
        border: "border-emerald-500/20",
        bg: "bg-gradient-to-br from-emerald-500/5 to-slate-900/5",
        icon: "text-emerald-400",
        text: "text-emerald-300",
        badge: "bg-emerald-500/20 text-emerald-400",
        bar: "bg-emerald-500",
        glow: "",
      };
  }
}

// Simple seismograph wave SVG
function SeismographWave({ level }: { level: SeismicLevel }) {
  const amplitude = level === "SEVERE" ? 18 : level === "MODERATE" ? 12 : level === "MINOR" ? 6 : 2;
  const color = level === "SEVERE" ? "#f97316" : level === "MODERATE" ? "#eab308" : level === "MINOR" ? "#3b82f6" : "#10b981";

  const points: string[] = [];
  for (let x = 0; x <= 200; x += 2) {
    const noise = Math.sin(x * 0.15) * amplitude + Math.sin(x * 0.3) * (amplitude * 0.5) + Math.sin(x * 0.05) * (amplitude * 0.3);
    const y = 25 + noise;
    points.push(`${x},${y.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 200 50" className="h-12 w-full opacity-60" preserveAspectRatio="none">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EarthquakeAlert({ status }: EarthquakeAlertProps) {
  const s = getSeismicStyles(status.level);

  return (
    <div className={`overflow-hidden rounded-xl border ${s.border} ${s.bg} backdrop-blur-sm ${s.glow ? `shadow-lg ${s.glow}` : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${status.level === "SEVERE" ? "animate-pulse bg-orange-500/20" : "bg-white/10"}`}>
          {/* Seismograph icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${s.icon}`}>
            <path d="M2 12h3l2-8 3 16 3-12 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${s.text}`}>Earthquake Detection</h3>
          <p className="text-[10px] text-slate-500">Swarm vibration correlation analysis</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${s.badge}`}>
          {status.level === "NONE" ? "ALL CLEAR" : status.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Seismograph visualization */}
        <div className="mb-4 overflow-hidden rounded-lg bg-black/20 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Live Seismograph</span>
            <span className="text-[10px] text-slate-600">Avg: {status.avgVibration.toFixed(3)}g | Max: {status.maxVibration.toFixed(3)}g</span>
          </div>
          <SeismographWave level={status.level} />
        </div>

        {/* Status label */}
        <div className="mb-3">
          <p className={`text-lg font-black ${s.text}`}>{status.label}</p>
          <p className="mt-1 text-xs text-slate-400">{status.description}</p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Est. Magnitude */}
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-[10px] text-slate-500">Est. Magnitude</div>
            <div className={`text-xl font-black ${status.level !== "NONE" ? s.text : "text-slate-600"}`}>
              {status.magnitude}
            </div>
          </div>

          {/* Correlation */}
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-[10px] text-slate-500">Fleet Correlation</div>
            <div className={`text-xl font-black ${status.level !== "NONE" ? s.text : "text-slate-600"}`}>
              {status.correlationScore}%
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${s.bar}`}
                style={{ width: `${status.correlationScore}%` }}
              />
            </div>
          </div>

          {/* Affected robots */}
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-[10px] text-slate-500">Affected Robots</div>
            <div className={`text-xl font-black ${status.level !== "NONE" ? s.text : "text-slate-600"}`}>
              {status.affectedRobots.length}
            </div>
            {status.affectedRobots.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {status.affectedRobots.map((id) => (
                  <span key={id} className={`rounded px-1 py-0.5 text-[9px] font-bold ${s.badge}`}>
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
