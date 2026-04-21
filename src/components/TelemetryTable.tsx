"use client";

import type { RobotData } from "@/types/robot";
import { getRiskBadgeClasses, formatTimestamp } from "@/utils/helpers";

interface TelemetryDashboardProps {
  robots: RobotData[];
}

function getBatteryIcon(battery: number) {
  if (battery <= 10) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-red-500 animate-pulse">
        <path fillRule="evenodd" d="M.75 9.75a3 3 0 013-3h15a3 3 0 013 3v.038c.856.174 1.5.93 1.5 1.837v2.25c0 .907-.644 1.663-1.5 1.837v.038a3 3 0 01-3 3h-15a3 3 0 01-3-3v-6zm19.5 0a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-5 w-5 ${battery <= 20 ? "text-amber-400" : "text-emerald-400"}`}>
      <path fillRule="evenodd" d="M.75 9.75a3 3 0 013-3h15a3 3 0 013 3v.038c.856.174 1.5.93 1.5 1.837v2.25c0 .907-.644 1.663-1.5 1.837v.038a3 3 0 01-3 3h-15a3 3 0 01-3-3v-6zm19.5 0a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" />
    </svg>
  );
}

function getBatteryColor(battery: number): string {
  if (battery <= 10) return "text-red-500";
  if (battery <= 20) return "text-amber-400";
  if (battery <= 50) return "text-amber-300";
  return "text-emerald-400";
}

function getBatteryBarColor(battery: number): string {
  if (battery <= 10) return "bg-red-500";
  if (battery <= 20) return "bg-amber-400";
  if (battery <= 50) return "bg-amber-300";
  return "bg-emerald-400";
}

function getBatteryWarning(battery: number): { text: string; style: string } | null {
  if (battery <= 10) {
    return {
      text: "⚠️ CRITICAL — Battery critically low! Immediate attention required.",
      style: "border-red-500/40 bg-red-500/10 text-red-400",
    };
  }
  if (battery <= 20) {
    return {
      text: "🔋 WARNING — Battery running low. Schedule recharge soon.",
      style: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    };
  }
  return null;
}

function getRiskGradient(level: string): string {
  switch (level) {
    case "HIGH":
      return "from-red-500/10 to-red-900/5 border-red-500/20";
    case "MEDIUM":
      return "from-amber-500/10 to-amber-900/5 border-amber-500/20";
    case "LOW":
      return "from-emerald-500/10 to-emerald-900/5 border-emerald-500/20";
    default:
      return "from-slate-500/10 to-slate-900/5 border-slate-500/20";
  }
}

export default function TelemetryDashboard({ robots }: TelemetryDashboardProps) {
  // Collect all battery warnings
  const batteryWarnings = robots
    .map((r) => ({ robot: r, warning: getBatteryWarning(r.battery) }))
    .filter((w) => w.warning !== null);

  return (
    <div className="space-y-5">
      {/* Battery Warnings Banner */}
      {batteryWarnings.length > 0 && (
        <div className="space-y-2">
          {batteryWarnings.map(({ robot, warning }) => (
            <div
              key={`warn-${robot.robot_id}`}
              className={`flex items-center gap-3 rounded-xl border p-3.5 backdrop-blur-sm ${warning!.style}`}
            >
              {getBatteryIcon(robot.battery)}
              <div className="flex-1">
                <span className="font-semibold">{robot.robot_id}</span>
                <span className="mx-2 text-white/30">|</span>
                <span className="text-sm">{warning!.text}</span>
              </div>
              <span className="font-mono text-lg font-black">{robot.battery.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-400">
          <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM10 7a3 3 0 100 6 3 3 0 000-6zm-6.5 3a.75.75 0 01-.75.75H1.25a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zm15 0a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75z" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-200">Robot Fleet Status</h3>
        <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-400">
          {robots.length} robots active
        </span>
      </div>

      {/* Robot Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {robots.map((robot) => (
          <div
            key={`${robot.robot_id}-${robot.timestamp}`}
            className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${getRiskGradient(robot.risk_level)}`}
          >
            {/* Top Row: Robot ID + Risk Badge */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-400">
                    <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0z" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-bold text-white">{robot.robot_id}</span>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getRiskBadgeClasses(robot.risk_level)}`}>
                {robot.risk_level}
              </span>
            </div>

            {/* Key Metrics: Battery + Risk Score */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              {/* Battery */}
              <div className="rounded-lg bg-black/20 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  {getBatteryIcon(robot.battery)}
                  <span className="text-xs text-slate-400">Battery</span>
                </div>
                <div className={`text-2xl font-black ${getBatteryColor(robot.battery)}`}>
                  {robot.battery.toFixed(0)}%
                </div>
                {/* Battery bar */}
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBatteryBarColor(robot.battery)}`}
                    style={{ width: `${Math.min(robot.battery, 100)}%` }}
                  />
                </div>
              </div>

              {/* Risk Score */}
              <div className="rounded-lg bg-black/20 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 ${robot.risk_level === "HIGH" ? "text-red-400" : robot.risk_level === "MEDIUM" ? "text-amber-400" : "text-emerald-400"}`}>
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-slate-400">Risk Score</span>
                </div>
                <div className={`text-2xl font-black ${robot.risk_level === "HIGH" ? "text-red-400" : robot.risk_level === "MEDIUM" ? "text-amber-400" : "text-emerald-400"}`}>
                  {robot.risk_score.toFixed(1)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {(robot.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
            </div>

            {/* Sensor Readings */}
            <div className="space-y-2 rounded-lg bg-black/20 p-3">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Sensor Readings
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500">Moisture</div>
                  <div className="font-mono text-sm font-semibold text-blue-400">
                    {robot.soil_moisture.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Vibration</div>
                  <div className="font-mono text-sm font-semibold text-amber-400">
                    {robot.vibration.toFixed(2)}g
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Tilt</div>
                  <div className="font-mono text-sm font-semibold text-purple-400">
                    {robot.tilt.toFixed(1)}°
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Location + Timestamp */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
              <span className="font-mono">
                📍 {robot.latitude.toFixed(4)}, {robot.longitude.toFixed(4)}
              </span>
              <span>{formatTimestamp(robot.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      {robots.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 py-12 text-center text-slate-500 backdrop-blur-sm">
          No telemetry data available
        </div>
      )}
    </div>
  );
}
