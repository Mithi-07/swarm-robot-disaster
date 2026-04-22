"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseAlertSoundReturn {
  isAlerting: boolean;
  alertReasons: string[];
  acknowledge: () => void;
}

/**
 * Continuous alert sound that plays in a loop until acknowledged.
 * Triggers on HIGH risk robots or low battery (≤20%).
 */
export function useAlertSound(
  hasHighRisk: boolean,
  lowBatteryRobots: string[],
  criticalBatteryRobots: string[]
): UseAlertSoundReturn {
  const [acknowledged, setAcknowledged] = useState(false);
  const [prevAlertKey, setPrevAlertKey] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(false);

  // Build list of reasons
  const alertReasons: string[] = [];
  if (hasHighRisk) {
    alertReasons.push("🔴 High risk zone detected");
  }
  criticalBatteryRobots.forEach((id) => {
    alertReasons.push(`⚠️ ${id} — Battery critically low`);
  });
  lowBatteryRobots.forEach((id) => {
    alertReasons.push(`🔋 ${id} — Battery low`);
  });

  const shouldAlert = alertReasons.length > 0;

  // Create a unique key for the current alert state to detect NEW alerts
  const alertKey = [
    hasHighRisk ? "HIGH" : "",
    ...criticalBatteryRobots,
    ...lowBatteryRobots,
  ]
    .filter(Boolean)
    .sort()
    .join("|");

  // When alert conditions change (new robot enters alert), reset acknowledgement
  useEffect(() => {
    if (alertKey !== prevAlertKey && alertKey !== "") {
      setAcknowledged(false);
      setPrevAlertKey(alertKey);
    }
  }, [alertKey, prevAlertKey]);

  const playBeep = useCallback((isCritical: boolean) => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCritical) {
        // Urgent two-tone siren for critical
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      } else {
        // Single warning tone
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.type = "sine";
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio not available
    }
  }, []);

  const stopSound = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  const startSound = useCallback(
    (isCritical: boolean) => {
      if (isPlayingRef.current) return;
      isPlayingRef.current = true;

      // Play immediately
      playBeep(isCritical);

      // Then repeat every 2 seconds
      intervalRef.current = setInterval(() => {
        playBeep(isCritical);
      }, 2000);
    },
    [playBeep]
  );

  useEffect(() => {
    const hasCritical = hasHighRisk || criticalBatteryRobots.length > 0;

    if (shouldAlert && !acknowledged) {
      startSound(hasCritical);
    } else {
      stopSound();
    }

    return () => {
      stopSound();
    };
  }, [shouldAlert, acknowledged, hasHighRisk, criticalBatteryRobots.length, startSound, stopSound]);

  const acknowledge = useCallback(() => {
    setAcknowledged(true);
    stopSound();
  }, [stopSound]);

  return {
    isAlerting: shouldAlert && !acknowledged,
    alertReasons,
    acknowledge,
  };
}
