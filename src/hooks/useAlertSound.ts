"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface AlertDetail {
  type: "high_risk" | "critical_battery" | "low_battery" | "earthquake";
  robotId?: string;
  message: string;
  severity: "critical" | "warning";
  action?: string;
}

interface UseAlertSoundReturn {
  isAlerting: boolean;
  alertDetails: AlertDetail[];
  acknowledge: () => void;
}

/**
 * Play alert tone using Web Audio API — bypasses the browser autoplay restriction
 * because AudioContext can be resumed programmatically after first creation.
 */
class AlertAudio {
  private ctx: AudioContext | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private getCtx(): AudioContext | null {
    if (!this.ctx || this.ctx.state === "closed") {
      try {
        this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  playBeep(isCritical: boolean) {
    const ctx = this.getCtx();
    if (!ctx) return;

    // Resume if suspended
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const duration = isCritical ? 0.3 : 0.25;

    // Create oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isCritical) {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    }

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  startLoop(isCritical: boolean) {
    this.stopLoop();
    this.playBeep(isCritical);
    this.intervalId = setInterval(() => this.playBeep(isCritical), 2000);
  }

  stopLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy() {
    this.stopLoop();
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
  }
}

/**
 * Persistent alert sound hook.
 * - Uses Web Audio API (AudioContext) for immediate playback without user click
 * - Plays a looping alarm when HIGH risk, earthquake, or low battery is detected
 * - Stops when user clicks "Acknowledge"
 * - Re-triggers when alert conditions CHANGE
 */
export function useAlertSound(
  highRiskRobots: string[],
  lowBatteryRobots: string[],
  criticalBatteryRobots: string[],
  earthquakeRobots: string[] = [],
  robotActions: Record<string, string> = {}
): UseAlertSoundReturn {
  const [acknowledgedKey, setAcknowledgedKey] = useState<string | null>(null);
  const audioRef = useRef<AlertAudio | null>(null);

  // Create audio engine on mount
  useEffect(() => {
    audioRef.current = new AlertAudio();
    return () => {
      audioRef.current?.destroy();
      audioRef.current = null;
    };
  }, []);

  // Build detailed alert reasons
  const alertDetails: AlertDetail[] = [];

  // Landslide HIGH risk — per-robot with actual recommended action
  highRiskRobots.forEach((id) => {
    alertDetails.push({
      type: "high_risk",
      robotId: id,
      message: `High landslide risk detected at ${id}`,
      severity: "critical",
      action: robotActions[id] || "EVACUATE",
    });
  });

  // Earthquake HIGH risk — per-robot with actual recommended action
  earthquakeRobots.forEach((id) => {
    alertDetails.push({
      type: "earthquake",
      robotId: id,
      message: `High earthquake risk detected at ${id}`,
      severity: "critical",
      action: robotActions[id] || "ALERT AUTHORITIES",
    });
  });

  // Battery CRITICAL — always RETURN TO BASE regardless of risk action
  criticalBatteryRobots.forEach((id) => {
    alertDetails.push({
      type: "critical_battery",
      robotId: id,
      message: `${id} battery critically low — needs immediate charging`,
      severity: "critical",
      action: "RETURN TO BASE",
    });
  });

  // Battery LOW — always MONITOR CLOSELY
  lowBatteryRobots.forEach((id) => {
    alertDetails.push({
      type: "low_battery",
      robotId: id,
      message: `${id} battery is low — schedule recharge`,
      severity: "warning",
      action: "MONITOR CLOSELY",
    });
  });

  const shouldAlert = alertDetails.length > 0;

  // Fingerprint of current alert state
  const currentAlertKey = shouldAlert
    ? [
        ...highRiskRobots.map((id) => `LS:${id}`),
        ...earthquakeRobots.map((id) => `EQ:${id}`),
        ...criticalBatteryRobots.map((id) => `CRIT:${id}`),
        ...lowBatteryRobots.map((id) => `LOW:${id}`),
      ]
        .filter(Boolean)
        .sort()
        .join("|")
    : "";

  const isAcknowledged = acknowledgedKey === currentAlertKey;
  const isAlerting = shouldAlert && !isAcknowledged;

  // Start or stop sound
  useEffect(() => {
    if (isAlerting && audioRef.current) {
      const isCritical = highRiskRobots.length > 0 || criticalBatteryRobots.length > 0 || earthquakeRobots.length > 0;
      audioRef.current.startLoop(isCritical);
    } else {
      audioRef.current?.stopLoop();
    }
    return () => {
      audioRef.current?.stopLoop();
    };
  }, [isAlerting, highRiskRobots.length, criticalBatteryRobots.length, earthquakeRobots.length]);

  const acknowledge = useCallback(() => {
    setAcknowledgedKey(currentAlertKey);
    audioRef.current?.stopLoop();
  }, [currentAlertKey]);

  return {
    isAlerting,
    alertDetails,
    acknowledge,
  };
}
