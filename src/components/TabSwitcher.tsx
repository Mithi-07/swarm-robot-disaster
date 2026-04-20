"use client";

interface TabSwitcherProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const tabs = [
  {
    label: "Risk Overview",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
      </svg>
    ),
  },
  {
    label: "Robot Telemetry",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M7 2a2 2 0 00-2 2v1a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7z" />
        <path fillRule="evenodd" d="M.993 10.267a.75.75 0 01.727-.772A47.048 47.048 0 0110 9.25a47.048 47.048 0 018.28.245.75.75 0 01-.045 1.499A45.56 45.56 0 0010 10.75a45.56 45.56 0 00-8.235.234.75.75 0 01-.772-.727zM2 15a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="flex gap-1 rounded-xl bg-white/5 p-1 backdrop-blur-sm">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === index
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
