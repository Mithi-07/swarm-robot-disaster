"use client";

import { useEffect, useRef } from "react";
import type { RobotData } from "@/types/robot";
import { playAlertSound } from "@/utils/helpers";

interface HighRiskAlertsProps {
  robots: RobotData[];
  newHighRisk: boolean;
}

export default function HighRiskAlerts({ robots, newHighRisk }: HighRiskAlertsProps) {
  const highRiskRobots = robots.filter((r) => r.risk_level === "HIGH");
  const containerRef = useRef<HTMLDivElement>(null);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (newHighRisk && !hasPlayedSound.current) {
      playAlertSound();
      hasPlayedSound.current = true;
      // Auto-scroll to alert section
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        hasPlayedSound.current = false;
      }, 5000);
    }
  }, [newHighRisk]);

  if (highRiskRobots.length === 0) {
    return (
      <div ref={containerRef} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-400">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-400">All Clear</h3>
            <p className="text-sm text-emerald-400/70">No high risk zones detected. All robots reporting safe conditions.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>
        <h3 className="text-lg font-bold text-red-400">
          ⚠️ High Risk Alert — {highRiskRobots.length} Robot{highRiskRobots.length > 1 ? "s" : ""}
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {highRiskRobots.map((robot) => (
          <div
            key={`${robot.robot_id}-${robot.timestamp}`}
            className={`group relative overflow-hidden rounded-xl border border-red-500/30 bg-red-500/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/10 ${
              newHighRisk ? "animate-pulse-alert" : ""
            }`}
          >
            {/* Glow effect */}
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-red-500/10 blur-2xl transition-all group-hover:bg-red-500/20" />

            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">
                  {robot.robot_id}
                </span>
                <span className="text-xl font-black text-red-400">
                  {robot.risk_score.toFixed(1)}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Location</span>
                  <span className="font-mono text-slate-300">
                    {robot.latitude.toFixed(4)}, {robot.longitude.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Confidence</span>
                  <span className="font-mono text-slate-300">
                    {(robot.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Soil Moisture</span>
                  <span className="font-mono text-slate-300">
                    {robot.soil_moisture.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vibration</span>
                  <span className="font-mono text-slate-300">
                    {robot.vibration.toFixed(2)} g
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
