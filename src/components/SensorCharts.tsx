"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RobotData } from "@/types/robot";

interface SensorChartsProps {
  robots: RobotData[];
  mode?: "landslide" | "earthquake";
}

export default function SensorCharts({ robots, mode = "landslide" }: SensorChartsProps) {
  const chartData = robots.map((r) => ({
    name: r.robot_id.replace("ROBOT_", "R"),
    soil_moisture: r.soil_moisture,
    vibration: r.vibration,
    tilt: r.tilt,
    risk_score: r.risk_score,
    earthquake_score: r.earthquake_score * 100,
    battery: r.battery,
  }));

  const landslideCharts = [
    { title: "Soil Moisture", dataKey: "soil_moisture", unit: "%", color: "#3b82f6", gradientId: "soilGrad" },
    { title: "Vibration", dataKey: "vibration", unit: " g", color: "#f59e0b", gradientId: "vibGrad" },
    { title: "Tilt Angle", dataKey: "tilt", unit: "°", color: "#8b5cf6", gradientId: "tiltGrad" },
    { title: "Risk Score", dataKey: "risk_score", unit: "", color: "#ef4444", gradientId: "riskGrad" },
  ];

  const earthquakeCharts = [
    { title: "Earthquake Score", dataKey: "earthquake_score", unit: "%", color: "#f97316", gradientId: "eqScoreGrad" },
    { title: "Vibration", dataKey: "vibration", unit: " g", color: "#eab308", gradientId: "eqVibGrad" },
  ];

  const charts = mode === "earthquake" ? earthquakeCharts : landslideCharts;
  const gridCols = mode === "earthquake" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4";

  const sectionTitle = mode === "earthquake" ? "Earthquake Sensor Data" : "Landslide Sensor Data";
  const iconColor = mode === "earthquake" ? "text-orange-400" : "text-blue-400";
  const icon = mode === "earthquake" ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 ${iconColor}`}>
      <path d="M2 12h3l2-8 3 16 3-12 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 ${iconColor}`}>
      <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
    </svg>
  );

  // Combined comparison chart data keys
  const comparisonLines = mode === "earthquake"
    ? [
        { dataKey: "earthquake_score", name: "EQ Score (%)", stroke: "#f97316", strokeWidth: 2 },
        { dataKey: "vibration", name: "Vibration (g)", stroke: "#eab308", strokeWidth: 1.5, dash: "5 5" },
      ]
    : [
        { dataKey: "risk_score", name: "Risk Score", stroke: "#ef4444", strokeWidth: 2 },
        { dataKey: "soil_moisture", name: "Soil Moisture (%)", stroke: "#3b82f6", strokeWidth: 1.5, dash: "5 5" },
        { dataKey: "vibration", name: "Vibration (g)", stroke: "#f59e0b", strokeWidth: 1.5, dash: "5 5" },
        { dataKey: "tilt", name: "Tilt (°)", stroke: "#8b5cf6", strokeWidth: 1.5, dash: "5 5" },
      ];

  const comparisonTitle = mode === "earthquake" ? "Earthquake Risk Comparison" : "Landslide Risk Comparison";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-slate-200">{sectionTitle}</h3>
      </div>

      <div className={`grid gap-4 ${gridCols}`}>
        {charts.map((chart) => (
          <div key={chart.dataKey} className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <h4 className="mb-3 text-xs font-medium text-slate-400">{chart.title}</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chart.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(value: unknown) => [`${Number(value).toFixed(2)}${chart.unit}`, chart.title]}
                />
                <Line type="monotone" dataKey={chart.dataKey} stroke={chart.color} strokeWidth={2} dot={{ fill: chart.color, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: chart.color, stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Combined comparison chart */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <h4 className="mb-3 text-xs font-medium text-slate-400">{comparisonTitle}</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} stroke="rgba(255,255,255,0.1)" />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} stroke="rgba(255,255,255,0.1)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
            {comparisonLines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                dot={{ r: 3, fill: line.stroke }}
                strokeDasharray={line.dash}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
