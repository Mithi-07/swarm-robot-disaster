"use client";

export default function AboutPage() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white">
              <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516 11.209 11.209 0 01-7.877-3.08z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>DisasterShield</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Real-time Disaster Risk Monitoring System</p>
          <div className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium" style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
            Version 2.0
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Overview</h3>
        </div>
        <div className="px-6 py-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <p>
            DisasterShield is a real-time monitoring dashboard designed to visualize data from a swarm of IoT-enabled robots
            deployed for natural disaster risk detection. The system continuously monitors for <strong>landslide</strong> and
            <strong> earthquake</strong> risks using sensor telemetry data including soil moisture, vibration, tilt, and
            seismic readings.
          </p>
          <p className="mt-3">
            When dangerous conditions are detected, the system triggers immediate visual and audio alerts to ensure
            operators are notified without delay.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Key Features</h3>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {[
            { icon: "🗺️", title: "Dual Risk Maps", desc: "Side-by-side landslide and earthquake risk visualization with real-time robot locations" },
            { icon: "🔔", title: "Smart Alerts", desc: "Blocking modal alerts with audio alarm for high risk, earthquake, and battery events" },
            { icon: "📊", title: "Sensor Analytics", desc: "Disaster-specific sensor charts with soil moisture, vibration, tilt, and seismic data" },
            { icon: "🤖", title: "Fleet Monitoring", desc: "Live robot telemetry with battery status, charging indicators, and sensor readings" },
            { icon: "🎨", title: "Theme Support", desc: "Dark, Light, and System themes for comfortable viewing in any environment" },
            { icon: "⚡", title: "Real-time Data", desc: "1-second polling interval for near-instant response to changing conditions" },
          ].map((f, i) => (
            <div key={i} className="flex gap-3 rounded-lg p-3" style={{ background: "var(--bg-card)" }}>
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</div>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Technology Stack</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-4">
          {[
            { name: "Next.js 16", desc: "React Framework" },
            { name: "TypeScript", desc: "Type Safety" },
            { name: "Tailwind CSS", desc: "Styling" },
            { name: "Recharts", desc: "Visualizations" },
            { name: "Leaflet", desc: "Maps" },
            { name: "AWS Lambda", desc: "Backend" },
            { name: "DynamoDB", desc: "Database" },
            { name: "IoT Core", desc: "MQTT Ingestion" },
          ].map((t, i) => (
            <div key={i} className="rounded-lg p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <div className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
              <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>System Architecture</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
            {["Swarm Robots", "→", "AWS IoT Core", "→", "Lambda", "→", "DynamoDB", "→", "API Gateway", "→", "DisasterShield UI"].map((item, i) => (
              item === "→" ? (
                <span key={i} className="text-blue-400">→</span>
              ) : (
                <span key={i} className="rounded-lg px-3 py-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                  {item}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
