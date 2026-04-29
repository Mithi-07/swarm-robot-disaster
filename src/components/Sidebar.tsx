"use client";

import { useState } from "react";

export type NavPage = "home" | "landslide" | "earthquake" | "telemetry" | "settings" | "about";

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const monitoringItems: { id: NavPage; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "home",
    label: "Dashboard",
    description: "Overview & Alerts",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "landslide",
    label: "Landslide",
    description: "Risk Monitoring",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "earthquake",
    label: "Earthquake",
    description: "Seismic Analysis",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M2 12h3l2-8 3 16 3-12 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "telemetry",
    label: "Robot Telemetry",
    description: "Fleet Status",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0z" />
      </svg>
    ),
  },
];

const systemItems: { id: NavPage; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "settings",
    label: "Settings",
    description: "Theme & Preferences",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "about",
    label: "About",
    description: "System Information",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    ),
  },
];

function NavItem({ item, isActive, onClick }: { item: typeof monitoringItems[0]; isActive: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
          isActive ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 shadow-sm shadow-blue-500/10" : ""
        }`}
        style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
      >
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? "bg-blue-500/20 text-blue-400" : ""}`}
          style={!isActive ? { background: "var(--bg-card)", color: "var(--text-faint)" } : {}}
        >
          {item.icon}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>
            {item.label}
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>{item.description}</div>
        </div>
        {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-blue-400" />}
      </button>
    </li>
  );
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-md border transition-all hover:shadow-lg"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed left-0 top-0 z-[60] h-full w-72 transform border-r backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--sidebar-bg)", borderColor: "var(--border-color)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516 11.209 11.209 0 01-7.877-3.08z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>DisasterShield</h2>
              <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Navigation</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Monitoring section */}
        <nav className="px-3 py-4">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Monitoring
          </div>
          <ul className="space-y-1">
            {monitoringItems.map((item) => (
              <NavItem key={item.id} item={item} isActive={activePage === item.id} onClick={() => { onNavigate(item.id); setIsOpen(false); }} />
            ))}
          </ul>
        </nav>

        {/* System section */}
        <nav className="px-3">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            System
          </div>
          <ul className="space-y-1">
            {systemItems.map((item) => (
              <NavItem key={item.id} item={item} isActive={activePage === item.id} onClick={() => { onNavigate(item.id); setIsOpen(false); }} />
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>
            DisasterShield v2.0 — Swarm Robot Monitoring
          </p>
        </div>
      </div>
    </>
  );
}
