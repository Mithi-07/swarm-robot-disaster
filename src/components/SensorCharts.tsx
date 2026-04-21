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
}

const COLORS = [
  "#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899",
  "#f59e0b", "#10b981", "#f43f5e", "#6366f1",
];

export default function SensorCharts({ robots }: SensorChartsProps) {
  // Transform data for charts — each robot becomes a data point
  const chartData = robots.map((r) => ({
    name: r.robot_id.replace("ROBOT_", "R"),
    soil_moisture: r.soil_moisture,
    vibration: r.vibration,
    tilt: r.tilt,
    risk_score: r.risk_score,
    battery: r.battery,
  }));

  const charts = [
    {
      title: "Soil Moisture by Robot",
      dataKey: "soil_moisture",
      unit: "%",
      color: "#3b82f6",
      gradientId: "soilGrad",
    },
    {
      title: "Vibration Levels",
      dataKey: "vibration",
      unit: " g",
      color: "#f59e0b",
      gradientId: "vibGrad",
    },
    {
      title: "Tilt Angles",
      dataKey: "tilt",
      unit: "°",
      color: "#8b5cf6",
      gradientId: "tiltGrad",
    },
    {
      title: "Battery Level",
      dataKey: "battery",
      unit: "%",
      color: "#22c55e",
      gradientId: "battGrad",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-400">
          <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-200">Sensor Data Trends</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {charts.map((chart) => (
          <div
            key={chart.dataKey}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >
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
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(value: unknown) => {
                    const num = Number(value);
                    return [`${num.toFixed(2)}${chart.unit}`, chart.title];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={chart.dataKey}
                  stroke={chart.color}
                  strokeWidth={2}
                  dot={{ fill: chart.color, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: chart.color, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Combined Risk Score Chart */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <h4 className="mb-3 text-xs font-medium text-slate-400">Risk Score Comparison</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="rgba(255,255,255,0.1)"
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="rgba(255,255,255,0.1)"
              domain={[0, 1]}
            />
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
            <Line type="monotone" dataKey="risk_score" name="Risk Score" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: "#ef4444" }} />
            <Line type="monotone" dataKey="soil_moisture" name="Soil Moisture" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 3, fill: "#3b82f6" }} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="vibration" name="Vibration" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 3, fill: "#f59e0b" }} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
