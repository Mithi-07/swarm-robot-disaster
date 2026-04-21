"use client";

import { useState } from "react";
import { useRobotData } from "@/hooks/useRobotData";
import Header from "@/components/Header";
import TabSwitcher from "@/components/TabSwitcher";
import HighRiskAlerts from "@/components/HighRiskAlerts";
import RiskSummaryCards from "@/components/RiskSummaryCards";
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

  const [activeTab, setActiveTab] = useState(0);

  // Loading state
  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b1121]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 animate-pulse text-white"
          >
            <path
              fillRule="evenodd"
              d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516 11.209 11.209 0 01-7.877-3.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">DisasterShield</h2>
          <p className="text-sm text-slate-500">Connecting to monitoring network...</p>
        </div>
        <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-[slide_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0b1121]">
      <Header
        lastUpdated={lastUpdated}
        robotCount={data.length}
        isLive={!error}
      />

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

      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Tab 1: Risk Overview */}
        {activeTab === 0 && (
          <div className="animate-fade-in space-y-6">
            <HighRiskAlerts robots={data} newHighRisk={newHighRisk} />
            <RiskSummaryCards
              lowCount={lowRiskCount}
              mediumCount={mediumRiskCount}
              highCount={highRiskCount}
            />
            <RobotMap robots={data} />
          </div>
        )}

        {/* Tab 2: Robot Telemetry */}
        {activeTab === 1 && (
          <div className="animate-fade-in space-y-6">
            <TelemetryDashboard robots={data} />
            <SensorCharts robots={data} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-600">
            DisasterShield © {new Date().getFullYear()} — Swarm Robot Landslide Risk Monitoring System
          </p>
        </div>
      </footer>
    </div>
  );
}
