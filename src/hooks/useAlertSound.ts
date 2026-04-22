"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseAlertSoundReturn {
  isAlerting: boolean;
  alertReasons: string[];
  acknowledge: () => void;
  audioUnlocked: boolean;
}

/**
 * Generate a WAV file as a Blob URL for reliable cross-browser playback.
 * Creates a simple warning tone.
 */
function generateAlertWav(isCritical: boolean): string {
  const sampleRate = 22050;
  const duration = isCritical ? 0.8 : 0.5;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header
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

  // Generate tone samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample: number;

    if (isCritical) {
      // Two-tone siren: alternates between 880Hz and 660Hz
      const freq = t < 0.2 ? 880 : t < 0.4 ? 660 : t < 0.6 ? 880 : 660;
      const envelope = Math.min(1, (duration - t) * 5) * Math.min(1, t * 20);
      sample = Math.sin(2 * Math.PI * freq * t) * 0.4 * envelope;
    } else {
      // Single warning beep at 660Hz
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
 * Continuous alert sound that plays in a loop until acknowledged.
 * Triggers on HIGH risk robots or low battery (≤20%).
 * Uses HTML Audio element for reliable cross-browser playback.
 */
export function useAlertSound(
  hasHighRisk: boolean,
  lowBatteryRobots: string[],
  criticalBatteryRobots: string[]
): UseAlertSoundReturn {
  const [acknowledged, setAcknowledged] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [prevAlertKey, setPrevAlertKey] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningUrlRef = useRef<string>("");
  const criticalUrlRef = useRef<string>("");

  // Generate audio URLs once
  useEffect(() => {
    warningUrlRef.current = generateAlertWav(false);
    criticalUrlRef.current = generateAlertWav(true);

    return () => {
      if (warningUrlRef.current) URL.revokeObjectURL(warningUrlRef.current);
      if (criticalUrlRef.current) URL.revokeObjectURL(criticalUrlRef.current);
    };
  }, []);

  // Unlock audio on any user interaction
  useEffect(() => {
    const unlock = () => {
      setAudioUnlocked(true);
      // Create a silent audio element to unlock autoplay
      const silentAudio = new Audio();
      silentAudio.volume = 0;
      silentAudio.play().catch(() => {});
    };

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

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

  // Create a unique key for the current alert state
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
      const url = isCritical ? criticalUrlRef.current : warningUrlRef.current;
      if (!url) return;

      // Stop previous
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(url);
      audio.volume = 0.6;
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay blocked — will work after user interaction
        });
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  const startSound = useCallback(
    (isCritical: boolean) => {
      // Don't start if already playing
      if (intervalRef.current) return;

      // Play immediately
      playBeep(isCritical);

      // Then repeat every 2.5 seconds
      intervalRef.current = setInterval(() => {
        playBeep(isCritical);
      }, 2500);
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
    audioUnlocked,
  };
}
