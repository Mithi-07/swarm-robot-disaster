"use client";

import { useTheme, type Theme } from "@/hooks/useTheme";

const themeOptions: { id: Theme; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "dark",
    label: "Dark",
    description: "Pure black background for low-light environments",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "light",
    label: "Light",
    description: "Bright mode for well-lit environments",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
        <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
      </svg>
    ),
  },
  {
    id: "system",
    label: "System",
    description: "Follows your operating system preference",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Customize your DisasterShield experience
        </p>
      </div>

      {/* Theme section */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-blue-400">
                <path fillRule="evenodd" d="M1 4.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0 5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm0 5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Appearance</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Choose your preferred theme. Current: <span className="font-medium capitalize">{resolvedTheme}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-3">
          {themeOptions.map((opt) => {
            const isActive = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] ${
                  isActive ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent" : ""
                }`}
                style={{
                  borderColor: isActive ? "transparent" : "var(--border-color)",
                  background: isActive ? "var(--bg-card-hover)" : "var(--bg-card)",
                }}
              >
                {/* Active check mark */}
                {isActive && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="mb-3" style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {opt.icon}
                </div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {opt.label}
                </div>
                <p className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Refresh section */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-400">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.312a7 7 0 0011.712-3.138.75.75 0 00-1.06-.18zm-5.624-7.85a7 7 0 00-5.624 7.85.75.75 0 001.06.18 5.5 5.5 0 019.201-2.466l.312.311h-2.433a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V6.569a.75.75 0 00-1.5 0v2.033l-.312-.312A7 7 0 009.688 3.574z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Data Refresh</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Robot telemetry is polled every 1 second</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Live monitoring active — 1s polling interval
            </span>
          </div>
        </div>
      </div>

      {/* Alert Sound section */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-400">
                <path d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Alert System</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Blocking modal with audio alert for critical events</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 space-y-2">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="text-red-400">●</span> High landslide risk
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="text-orange-400">●</span> High earthquake risk
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="text-red-400">●</span> Critical battery level
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="text-amber-400">●</span> Low battery warning
          </div>
        </div>
      </div>
    </div>
  );
}
