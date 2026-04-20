"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { RobotData } from "@/types/robot";
import { calculateMapCenter } from "@/utils/helpers";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface RobotMapProps {
  robots: RobotData[];
}

function getMarkerColor(level: string): string {
  switch (level) {
    case "HIGH": return "#ef4444";
    case "MEDIUM": return "#f59e0b";
    case "LOW": return "#22c55e";
    default: return "#94a3b8";
  }
}

export default function RobotMap({ robots }: RobotMapProps) {
  const center = useMemo(() => calculateMapCenter(robots), [robots]);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-400">
          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-200">Live Robot Positions</h3>
        <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Low</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Medium</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> High</span>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
          style={{ background: "#1a1a2e" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {robots.map((robot) => (
            <CircleMarker
              key={`${robot.robot_id}-${robot.timestamp}`}
              center={[robot.latitude, robot.longitude]}
              radius={10}
              pathOptions={{
                color: getMarkerColor(robot.risk_level),
                fillColor: getMarkerColor(robot.risk_level),
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px] text-sm">
                  <div className="mb-2 font-bold text-slate-800">{robot.robot_id}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Risk Level:</span>
                      <span className={`font-bold ${
                        robot.risk_level === "HIGH" ? "text-red-600" :
                        robot.risk_level === "MEDIUM" ? "text-amber-600" : "text-emerald-600"
                      }`}>{robot.risk_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Risk Score:</span>
                      <span className="font-mono">{robot.risk_score.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Soil Moisture:</span>
                      <span className="font-mono">{robot.soil_moisture.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vibration:</span>
                      <span className="font-mono">{robot.vibration.toFixed(2)} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tilt:</span>
                      <span className="font-mono">{robot.tilt.toFixed(1)}°</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
