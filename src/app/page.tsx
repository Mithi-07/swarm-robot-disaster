"use client";

import { useState, useMemo } from "react";
import { useRobotData } from "@/hooks/useRobotData";
import { useAlertSound } from "@/hooks/useAlertSound";
import { useEarthquakeDetection } from "@/hooks/useEarthquakeDetection";
import Sidebar, { type NavPage } from "@/components/Sidebar";
import Header from "@/components/Header";
import HighRiskAlerts from "@/components/HighRiskAlerts";
import RiskSummaryCards from "@/components/RiskSummaryCards";
import EarthquakeAlert from "@/components/EarthquakeAlert";
import RobotMap from "@/components/RobotMap";
import TelemetryDashboard from "@/components/TelemetryTable";
import SensorCharts from "@/components/SensorCharts";

export default function Home() {
  const {
    data,
    loading,
    error,
    lastUpdated,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    newHighRisk,
  } = useRobotData(2000);

  const [activePage, setActivePage] = useState<NavPage>("home");

  // Battery alerts — using API battery_status
  const lowBatteryRobots = useMemo(
    () => data.filter((r) => r.battery_status === "LOW").map((r) => r.robot_id),
    [data]
  );
  const criticalBatteryRobots = useMemo(
    () => data.filter((r) => r.battery_status === "CRITICAL").map((r) => r.robot_id),
    [data]
  );

  // Earthquake detection
  const earthquakeStatus = useEarthquakeDetection(data);

  // Earthquake risk counts
  const eqHighCount = useMemo(() => data.filter((r) => r.earthquake_risk === "HIGH").length, [data]);
  const eqMedCount = useMemo(() => data.filter((r) => r.earthquake_risk === "MEDIUM").length, [data]);
  const eqLowCount = useMemo(() => data.filter((r) => r.earthquake_risk === "LOW").length, [data]);

  // Earthquake high-risk robots
  const eqHighRobots = useMemo(
    () => data.filter((r) => r.earthquake_risk === "HIGH").map((r) => r.robot_id),
    [data]
  );

  // Alert sound — with earthquake support
  const { isAlerting, alertDetails, acknowledge } = useAlertSound(
    highRiskCount > 0,
    lowBatteryRobots,
    criticalBatteryRobots,
    eqHighCount > 0,
    eqHighRobots
  );

  // Loading state
  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: "var(--bg-primary)" }}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 animate-pulse text-white">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516 11.209 11.209 0 01-7.877-3.08z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>DisasterShield</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Connecting to monitoring network...</p>
        </div>
        <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-[slide_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>
      </div>
    );
  }

  const pageTitle = {
    home: "Dashboard Overview",
    landslide: "Landslide Monitoring",
    earthquake: "Earthquake Detection",
    telemetry: "Robot Telemetry",
  }[activePage];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-primary)" }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Header lastUpdated={lastUpdated} robotCount={data.length} isLive={!error} />

      {/* BLOCKING ALERT MODAL */}
      {isAlerting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl border border-red-500/30 bg-[#0c0c0c] shadow-2xl shadow-red-500/10">
            {/* Modal header */}
            <div className="flex items-center gap-3 border-b border-red-500/20 bg-red-500/10 px-6 py-4">
              <span className="relative flex h-5 w-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-5 w-5 rounded-full bg-red-500" />
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-300">⚠️ Alert — Immediate Attention Required</h2>
                <p className="text-xs text-red-400/70">🔊 Alarm active — Acknowledge to dismiss</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 animate-bounce text-red-400">
                <path d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" />
              </svg>
            </div>

            {/* Alert details list */}
            <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {alertDetails.map((detail, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                      detail.severity === "critical"
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-amber-500/30 bg-amber-500/5"
                    }`}
                  >
                    {/* Icon by type */}
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      detail.type === "high_risk" ? "bg-red-500/20" :
                      detail.type === "earthquake" ? "bg-orange-500/20" :
                      detail.type === "critical_battery" ? "bg-red-500/20" : "bg-amber-500/20"
                    }`}>
                      {detail.type === "high_risk" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-red-400">
                          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495z" clipRule="evenodd" />
                        </svg>
                      )}
                      {detail.type === "earthquake" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-orange-400">
                          <path d="M2 12h3l2-8 3 16 3-12 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {(detail.type === "critical_battery" || detail.type === "low_battery") && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${detail.type === "critical_battery" ? "text-red-400" : "text-amber-400"}`}>
                          <path fillRule="evenodd" d="M.75 9.75a3 3 0 013-3h15a3 3 0 013 3v.038c.856.174 1.5.93 1.5 1.837v2.25c0 .907-.644 1.663-1.5 1.837v.038a3 3 0 01-3 3h-15a3 3 0 01-3-3v-6zm19.5 0a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          detail.severity === "critical" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {detail.type === "high_risk" ? "Landslide" :
                           detail.type === "earthquake" ? "Earthquake" :
                           detail.type === "critical_battery" ? "Critical" : "Warning"}
                        </span>
                        {detail.robotId && (
                          <span className="font-mono text-xs text-slate-400">{detail.robotId}</span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm ${detail.severity === "critical" ? "text-red-300" : "text-amber-300"}`}>
                        {detail.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acknowledge button */}
            <div className="border-t border-red-500/20 bg-red-500/5 px-6 py-4">
              <button
                onClick={acknowledge}
                className="w-full rounded-xl border border-red-500/40 bg-red-500/20 py-3 text-sm font-bold text-red-300 transition-all hover:bg-red-500/30 hover:text-white active:scale-[0.98]"
              >
                ✓ I Acknowledge — Dismiss Alert
              </button>
              <p className="mt-2 text-center text-[10px] text-red-400/50">
                You must acknowledge this alert before continuing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-red-400">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-400">Connection Error</p>
              <p className="text-xs text-red-400/70">{error} — Retrying automatically...</p>
            </div>
          </div>
        </div>
      )}

      {/* Page title + nav pills */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 sm:hidden" />
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{pageTitle}</h2>
          <div className="ml-auto flex gap-2">
            {(["home", "landslide", "earthquake", "telemetry"] as NavPage[]).map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`hidden rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:block ${
                  activePage === page ? "bg-blue-500/20 text-blue-400" : "hover:bg-blue-500/5"
                }`}
                style={{ color: activePage === page ? undefined : "var(--text-muted)" }}
              >
                {page === "home" ? "Dashboard" : page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">

        {/* ===== HOME ===== */}
        {activePage === "home" && (
          <div className="animate-fade-in space-y-6">
            {/* Risk counts — side by side */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Landslide risks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-400">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Landslide Risk</h3>
                  <button onClick={() => setActivePage("landslide")} className="ml-auto text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    View details →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl p-3 text-center" style={{ border: "1px solid var(--risk-low-border)", background: "var(--risk-low-bg)" }}>
                    <div className="text-[10px] font-medium uppercase text-emerald-600">Low</div>
                    <div className="text-2xl font-black risk-count-low text-emerald-500">{lowRiskCount}</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ border: "1px solid var(--risk-med-border)", background: "var(--risk-med-bg)" }}>
                    <div className="text-[10px] font-medium uppercase text-amber-600">Medium</div>
                    <div className="text-2xl font-black risk-count-med text-amber-500">{mediumRiskCount}</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ border: "1px solid var(--risk-high-border)", background: "var(--risk-high-bg)" }}>
                    <div className="text-[10px] font-medium uppercase text-red-600">High</div>
                    <div className="text-2xl font-black risk-count-high text-red-500">{highRiskCount}</div>
                  </div>
                </div>
              </div>

              {/* Earthquake risks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-orange-400">
                    <path d="M2 12h3l2-8 3 16 3-12 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Earthquake Risk</h3>
                  <button onClick={() => setActivePage("earthquake")} className="ml-auto text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    View details →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl p-3 text-center" style={{ border: "1px solid var(--risk-low-border)", background: "var(--risk-low-bg)" }}>
                    <div className="text-[10px] font-medium uppercase text-emerald-600">Low</div>
                    <div className="text-2xl font-black risk-count-low text-emerald-500">{eqLowCount}</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ border: "1px solid var(--risk-med-border)", background: "var(--risk-med-bg)" }}>
                    <div className="text-[10px] font-medium uppercase text-amber-600">Medium</div>
                    <div className="text-2xl font-black risk-count-med text-amber-500">{eqMedCount}</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ border: "1px solid var(--risk-high-border)", background: "var(--risk-high-bg)" }}>
                    <div className="text-[10px] font-medium uppercase text-orange-600">High</div>
                    <div className="text-2xl font-black risk-count-eq-high text-orange-500">{eqHighCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two maps side by side */}
            <div className="grid gap-6 lg:grid-cols-2">
              <RobotMap robots={data} mode="landslide" height="350px" />
              <RobotMap robots={data} mode="earthquake" height="350px" />
            </div>
          </div>
        )}

        {/* ===== LANDSLIDE ===== */}
        {activePage === "landslide" && (
          <div className="animate-fade-in space-y-6">
            <HighRiskAlerts robots={data} newHighRisk={newHighRisk} />
            <RiskSummaryCards lowCount={lowRiskCount} mediumCount={mediumRiskCount} highCount={highRiskCount} />
            <RobotMap robots={data} mode="landslide" />
            <SensorCharts robots={data} mode="landslide" />
          </div>
        )}

        {/* ===== EARTHQUAKE ===== */}
        {activePage === "earthquake" && (
          <div className="animate-fade-in space-y-6">
            <EarthquakeAlert status={earthquakeStatus} />

            {/* Per-robot vibration cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-orange-400">
                  <path d="M2 12h3l2-8 3 16 3-12 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-200">Robot Earthquake Readings</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((robot) => {
                  const riskLevel = robot.earthquake_risk;
                  const isHigh = riskLevel === "HIGH";
                  const isMed = riskLevel === "MEDIUM";
                  return (
                    <div
                      key={`eq-${robot.robot_id}`}
                      className={`rounded-xl border p-4 backdrop-blur-sm transition-all ${
                        isHigh ? "border-orange-500/30 bg-orange-500/5" : isMed ? "border-yellow-500/20 bg-yellow-500/5" : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm font-bold text-white">{robot.robot_id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isHigh ? "bg-orange-500/20 text-orange-400" : isMed ? "bg-yellow-500/20 text-yellow-400" : "bg-emerald-500/20 text-emerald-400"
                        }`}>
                          {riskLevel}
                        </span>
                      </div>
                      <div className={`text-3xl font-black ${isHigh ? "text-orange-400" : isMed ? "text-yellow-400" : "text-emerald-400"}`}>
                        {(robot.earthquake_score * 100).toFixed(0)}
                        <span className="text-sm font-normal text-slate-500 ml-1">%</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Vibration: {robot.vibration.toFixed(2)}g</div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full transition-all duration-500 ${isHigh ? "bg-orange-500" : isMed ? "bg-yellow-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(robot.earthquake_score * 100, 100)}%` }} />
                      </div>
                      <div className="mt-2 text-[10px] text-slate-600 font-mono">
                        📍 {robot.latitude.toFixed(4)}, {robot.longitude.toFixed(4)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <RobotMap robots={data} mode="earthquake" />
            <SensorCharts robots={data} mode="earthquake" />
          </div>
        )}

        {/* ===== TELEMETRY ===== */}
        {activePage === "telemetry" && (
          <div className="animate-fade-in space-y-6">
            <TelemetryDashboard robots={data} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-color)" }} className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
            DisasterShield © {new Date().getFullYear()} — Swarm Robot Disaster Risk Monitoring System
          </p>
        </div>
      </footer>
    </div>
  );
}
