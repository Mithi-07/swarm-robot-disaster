"use client";

import type { RobotData } from "@/types/robot";
import { formatTimestamp } from "@/utils/helpers";

interface TelemetryDashboardProps {
  robots: RobotData[];
}

function getBatteryStatusColor(status: string): { text: string; bg: string; bar: string } {
  switch (status) {
    case "CRITICAL":
      return { text: "text-red-500", bg: "bg-red-500/20 text-red-400", bar: "bg-red-500" };
    case "LOW":
      return { text: "text-amber-400", bg: "bg-amber-500/20 text-amber-400", bar: "bg-amber-400" };
    default:
      return { text: "text-emerald-400", bg: "bg-emerald-500/20 text-emerald-400", bar: "bg-emerald-400" };
  }
}

function getBatteryIcon(status: string) {
  if (status === "CRITICAL") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-red-500 animate-pulse">
        <path fillRule="evenodd" d="M.75 9.75a3 3 0 013-3h15a3 3 0 013 3v.038c.856.174 1.5.93 1.5 1.837v2.25c0 .907-.644 1.663-1.5 1.837v.038a3 3 0 01-3 3h-15a3 3 0 01-3-3v-6zm19.5 0a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" />
      </svg>
    );
  }
  const color = status === "LOW" ? "text-amber-400" : "text-emerald-400";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-5 w-5 ${color}`}>
      <path fillRule="evenodd" d="M.75 9.75a3 3 0 013-3h15a3 3 0 013 3v.038c.856.174 1.5.93 1.5 1.837v2.25c0 .907-.644 1.663-1.5 1.837v.038a3 3 0 01-3 3h-15a3 3 0 01-3-3v-6zm19.5 0a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" />
    </svg>
  );
}


export default function TelemetryDashboard({ robots }: TelemetryDashboardProps) {
  // Collect battery warnings using API battery_status
  const batteryWarnings = robots.filter(
    (r) => r.battery_status === "LOW" || r.battery_status === "CRITICAL"
  );

  // Robots that need charging
  const chargingNeeded = robots.filter((r) => r.charging_required);

  return (
    <div className="space-y-5">
      {/* Battery warnings using API battery_status */}
      {batteryWarnings.length > 0 && (
        <div className="space-y-2">
          {batteryWarnings.map((robot) => {
            const colors = getBatteryStatusColor(robot.battery_status);
            return (
              <div
                key={`warn-${robot.robot_id}`}
                className={`flex items-center gap-3 rounded-xl border p-3.5 backdrop-blur-sm ${
                  robot.battery_status === "CRITICAL"
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-amber-500/40 bg-amber-500/10"
                }`}
              >
                {getBatteryIcon(robot.battery_status)}
                <div className="flex-1">
                  <span className={`font-semibold ${colors.text}`}>{robot.robot_id}</span>
                  <span className="mx-2 opacity-30">|</span>
                  <span className={`text-sm ${colors.text}`}>
                    {robot.battery_status === "CRITICAL"
                      ? "⚠️ CRITICAL — Battery critically low! Immediate attention required."
                      : "🔋 LOW — Battery running low. Schedule recharge soon."}
                  </span>
                  {robot.charging_required && (
                    <span className="ml-2 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                      CHARGING REQUIRED
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`font-mono text-lg font-black ${colors.text}`}>{robot.battery}%</span>
                  <div className={`text-[10px] ${colors.text} opacity-70`}>Health: {robot.battery_health_score}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-400">
          <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM10 7a3 3 0 100 6 3 3 0 000-6zm-6.5 3a.75.75 0 01-.75.75H1.25a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zm15 0a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75z" />
        </svg>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Robot Fleet Status</h3>
        <span className="ml-auto rounded-md px-2 py-0.5 text-xs" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
          {robots.length} robots active
          {chargingNeeded.length > 0 && (
            <span className="ml-2 text-red-400">• {chargingNeeded.length} need charging</span>
          )}
        </span>
      </div>

      {/* Robot Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {robots.map((robot) => {
          const batColors = getBatteryStatusColor(robot.battery_status);
          return (
            <div
              key={`${robot.robot_id}-${robot.timestamp}`}
              className="group relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
              style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}
            >
              {/* Charging indicator */}
              {robot.charging_required && (
                <div className="absolute right-3 top-3 rounded-full bg-red-500/20 p-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 animate-pulse text-red-400">
                    <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                  </svg>
                </div>
              )}

              {/* Top Row: Robot ID */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--bg-card)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-400">
                    <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0z" />
                  </svg>
                </div>
                <span className="font-mono text-sm font-bold" style={{ color: "var(--text-primary)" }}>{robot.robot_id}</span>
              </div>

              {/* Battery */}
              <div className="mb-4 rounded-lg p-3" style={{ background: "var(--bg-card)" }}>
                <div className="mb-1 flex items-center gap-1.5">
                  {getBatteryIcon(robot.battery_status)}
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Battery</span>
                  <span className={`ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold ${batColors.bg}`}>{robot.battery_status}</span>
                </div>
                <div className={`text-2xl font-black ${batColors.text}`}>
                  {robot.battery}%
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-card)" }}>
                  <div className={`h-full rounded-full transition-all duration-500 ${batColors.bar}`} style={{ width: `${Math.min(robot.battery, 100)}%` }} />
                </div>
              </div>

              {/* Sensor Readings */}
              <div className="space-y-2 rounded-lg p-3" style={{ background: "rgba(0,0,0,0.15)" }}>
                <div className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
                  Sensor Readings
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>Moisture</div>
                    <div className="font-mono text-sm font-semibold text-blue-400">{robot.soil_moisture.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>Vibration</div>
                    <div className="font-mono text-sm font-semibold text-amber-400">{robot.vibration.toFixed(2)}g</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>Tilt</div>
                    <div className="font-mono text-sm font-semibold text-purple-400">{robot.tilt.toFixed(1)}°</div>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="mt-3 flex items-center gap-2 rounded-lg p-2.5" style={{ background: "var(--bg-card)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 shrink-0 ${
                  robot.action_priority === "URGENT" ? "text-red-400" :
                  robot.action_priority === "HIGH" ? "text-orange-400" :
                  robot.action_priority === "MEDIUM" ? "text-amber-400" : "text-emerald-400"
                }`}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>Recommended Action</div>
                  <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {robot.recommended_action.replace(/_/g, " ")}
                  </div>
                </div>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                  robot.action_priority === "URGENT" ? "bg-red-500/20 text-red-400" :
                  robot.action_priority === "HIGH" ? "bg-orange-500/20 text-orange-400" :
                  robot.action_priority === "MEDIUM" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {robot.action_priority}
                </span>
              </div>

              {/* Footer: Location + Timestamp */}
              <div className="mt-3 flex items-center justify-between text-[10px]" style={{ color: "var(--text-faint)" }}>
                <span className="font-mono">📍 {robot.latitude.toFixed(4)}, {robot.longitude.toFixed(4)}</span>
                <span>{formatTimestamp(robot.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {robots.length === 0 && (
        <div className="rounded-xl border py-12 text-center backdrop-blur-sm" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)", color: "var(--text-muted)" }}>
          No telemetry data available
        </div>
      )}
    </div>
  );
}
