"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseAlertSoundReturn {
  isAlerting: boolean;
  alertReasons: string[];
  acknowledge: () => void;
}

/**
 * Generate a WAV file as a Blob URL for reliable playback.
 */
function generateAlertWav(isCritical: boolean): string {
  const sampleRate = 22050;
  const duration = isCritical ? 0.8 : 0.5;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample: number;
    if (isCritical) {
      const freq = t < 0.2 ? 880 : t < 0.4 ? 660 : t < 0.6 ? 880 : 660;
      const envelope = Math.min(1, (duration - t) * 5) * Math.min(1, t * 20);
      sample = Math.sin(2 * Math.PI * freq * t) * 0.4 * envelope;
    } else {
      const envelope = Math.min(1, (duration - t) * 4) * Math.min(1, t * 20);
      sample = Math.sin(2 * Math.PI * 660 * t) * 0.35 * envelope;
    }
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

/**
 * Persistent alert sound hook.
 * - Plays a looping alarm when HIGH risk or low battery is detected
 * - Stops when user clicks "Acknowledge"
 * - Re-triggers when alert conditions CHANGE (e.g., new robot enters HIGH risk)
 * - Does NOT re-trigger if data is the same after acknowledgment
 */
export function useAlertSound(
  hasHighRisk: boolean,
  lowBatteryRobots: string[],
  criticalBatteryRobots: string[]
): UseAlertSoundReturn {
  const [acknowledgedKey, setAcknowledgedKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningUrlRef = useRef<string>("");
  const criticalUrlRef = useRef<string>("");
  const userInteractedRef = useRef(false);

  // Generate audio blobs once on mount
  useEffect(() => {
    warningUrlRef.current = generateAlertWav(false);
    criticalUrlRef.current = generateAlertWav(true);
    return () => {
      if (warningUrlRef.current) URL.revokeObjectURL(warningUrlRef.current);
      if (criticalUrlRef.current) URL.revokeObjectURL(criticalUrlRef.current);
    };
  }, []);

  // Track user interaction to unlock audio
  useEffect(() => {
    const markInteracted = () => {
      userInteractedRef.current = true;
    };
    document.addEventListener("click", markInteracted);
    document.addEventListener("touchstart", markInteracted);
    document.addEventListener("keydown", markInteracted);
    return () => {
      document.removeEventListener("click", markInteracted);
      document.removeEventListener("touchstart", markInteracted);
      document.removeEventListener("keydown", markInteracted);
    };
  }, []);

  // Build alert reasons
  const alertReasons: string[] = [];
  if (hasHighRisk) alertReasons.push("🔴 High risk zone detected");
  criticalBatteryRobots.forEach((id) =>
    alertReasons.push(`⚠️ ${id} — Battery critically low`)
  );
  lowBatteryRobots.forEach((id) =>
    alertReasons.push(`🔋 ${id} — Battery low`)
  );

  const shouldAlert = alertReasons.length > 0;

  // A fingerprint of current alert state — changes when conditions change
  const currentAlertKey = shouldAlert
    ? [
        hasHighRisk ? "HIGH" : "",
        ...criticalBatteryRobots.map((id) => `CRIT:${id}`),
        ...lowBatteryRobots.map((id) => `LOW:${id}`),
      ]
        .filter(Boolean)
        .sort()
        .join("|")
    : "";

  // Is the current alert acknowledged?
  const isAcknowledged = acknowledgedKey === currentAlertKey;
  const isAlerting = shouldAlert && !isAcknowledged;

  // Play a single beep
  const playBeep = useCallback((isCritical: boolean) => {
    if (!userInteractedRef.current) return;

    try {
      const url = isCritical ? criticalUrlRef.current : warningUrlRef.current;
      if (!url) return;

      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(url);
      audio.volume = 0.7;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {
      // Audio unavailable
    }
  }, []);

  // Stop looping sound
  const stopSound = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  // Main effect: start or stop sound based on alert state
  useEffect(() => {
    if (isAlerting) {
      const isCritical = hasHighRisk || criticalBatteryRobots.length > 0;

      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Play immediately
      playBeep(isCritical);

      // Loop every 2.5 seconds
      intervalRef.current = setInterval(() => {
        playBeep(isCritical);
      }, 2500);
    } else {
      stopSound();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAlerting, hasHighRisk, criticalBatteryRobots.length, playBeep, stopSound]);

  // Acknowledge: store which alert key was acknowledged
  const acknowledge = useCallback(() => {
    setAcknowledgedKey(currentAlertKey);
    stopSound();
  }, [currentAlertKey, stopSound]);

  return {
    isAlerting,
    alertReasons,
    acknowledge,
  };
}
