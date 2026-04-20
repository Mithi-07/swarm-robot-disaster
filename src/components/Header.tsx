"use client";

import { formatTimestamp } from "@/utils/helpers";

interface HeaderProps {
  lastUpdated: Date | null;
  robotCount: number;
  isLive: boolean;
}

export default function Header({ lastUpdated, robotCount, isLive }: HeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Shield Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-white"
            >
              <path
                fillRule="evenodd"
                d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516 11.209 11.209 0 01-7.877-3.08zm.338 7.244a.75.75 0 00-1.208-.884l-2.675 3.66-.844-.844a.75.75 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.134-.11l3.153-4.382z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              DisasterShield
            </h1>
            <p className="text-xs text-slate-400">
              Real-time Landslide Risk Monitoring System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Robot count */}
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-blue-400"
            >
              <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM10 7a3 3 0 100 6 3 3 0 000-6zm-6.5 3a.75.75 0 01-.75.75H1.25a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zm15 0a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75z" />
            </svg>
            <span className="text-sm font-medium text-slate-300">
              {robotCount} Robots
            </span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2.5 w-2.5`}>
              {isLive && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  isLive ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
            </span>
            <span className="text-sm font-medium text-slate-300">
              {isLive ? "Live" : "Offline"}
            </span>
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <div className="hidden text-xs text-slate-500 md:block">
              Updated: {formatTimestamp(lastUpdated.toISOString())}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
