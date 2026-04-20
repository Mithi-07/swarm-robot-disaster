"use client";

import type { RobotData } from "@/types/robot";
import { getRiskBadgeClasses, formatTimestamp } from "@/utils/helpers";

interface TelemetryTableProps {
  robots: RobotData[];
}

export default function TelemetryTable({ robots }: TelemetryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-400">
          <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25l.01 9.5A2.25 2.25 0 0116.76 17H3.26A2.25 2.25 0 011 14.75l-.01-9.51zm8.26 9.52v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 00.627-.34zM1.5 6.0v2.22c0 .415.336.75.75.75h15.5c.414 0 .75-.336.75-.75V6c0-.414-.336-.75-.75-.75H2.25a.75.75 0 00-.75.75z" clipRule="evenodd" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-200">Robot Telemetry Data</h3>
        <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-400">
          {robots.length} entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium">Robot ID</th>
              <th className="px-4 py-3 font-medium">Soil Moisture</th>
              <th className="px-4 py-3 font-medium">Vibration</th>
              <th className="px-4 py-3 font-medium">Tilt</th>
              <th className="px-4 py-3 font-medium">Risk Level</th>
              <th className="px-4 py-3 font-medium">Risk Score</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {robots.map((robot, i) => (
              <tr
                key={`${robot.robot_id}-${robot.timestamp}`}
                className={`transition-colors hover:bg-white/5 ${
                  i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-blue-400">
                  {robot.robot_id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">
                  {robot.soil_moisture.toFixed(1)}%
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">
                  {robot.vibration.toFixed(3)} g
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">
                  {robot.tilt.toFixed(1)}°
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBadgeClasses(
                      robot.risk_level
                    )}`}
                  >
                    {robot.risk_level}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">
                  {robot.risk_score.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">
                  {(robot.confidence * 100).toFixed(0)}%
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                  {formatTimestamp(robot.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {robots.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          No telemetry data available
        </div>
      )}
    </div>
  );
}
