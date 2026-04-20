import type { RobotData } from "@/types/robot";

export function getRiskColor(level: string): string {
  switch (level) {
    case "HIGH":
      return "text-red-500";
    case "MEDIUM":
      return "text-amber-400";
    case "LOW":
      return "text-emerald-400";
    default:
      return "text-slate-400";
  }
}

export function getRiskBgColor(level: string): string {
  switch (level) {
    case "HIGH":
      return "bg-red-500/20 border-red-500/40";
    case "MEDIUM":
      return "bg-amber-500/20 border-amber-500/40";
    case "LOW":
      return "bg-emerald-500/20 border-emerald-500/40";
    default:
      return "bg-slate-500/20 border-slate-500/40";
  }
}

export function getRiskBadgeClasses(level: string): string {
  switch (level) {
    case "HIGH":
      return "bg-red-500/20 text-red-400 ring-1 ring-red-500/30";
    case "MEDIUM":
      return "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30";
    case "LOW":
      return "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30";
  }
}

export function formatTimestamp(ts: string): string {
  try {
    const date = new Date(ts);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return ts;
  }
}

export function calculateMapCenter(robots: RobotData[]): [number, number] {
  if (robots.length === 0) return [20.5937, 78.9629]; // Default: India center
  const avgLat = robots.reduce((sum, r) => sum + r.latitude, 0) / robots.length;
  const avgLng = robots.reduce((sum, r) => sum + r.longitude, 0) / robots.length;
  return [avgLat, avgLng];
}

export function playAlertSound(): void {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 880;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch {
    // Audio not available, silently fail
  }
}
