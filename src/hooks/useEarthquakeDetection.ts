"use client";

import { useMemo } from "react";
import type { RobotData } from "@/types/robot";

/**
 * Earthquake detection based on swarm robot vibration correlation.
 *
 * Logic:
 * - Vibration thresholds (in g units):
 *     Normal:   < 0.4g
 *     Elevated: 0.4g – 0.7g  → seismic activity
 *     Critical: > 0.7g       → strong seismic event
 *
 * - Detection rules:
 *     1 robot elevated       → "Minor tremor nearby"
 *     2+ robots elevated     → "Seismic Activity Detected"
 *     1 robot critical       → "Strong vibration detected"
 *     2+ robots critical     → "⚠️ EARTHQUAKE WARNING"
 *
 * - Average vibration across fleet is also used for overall assessment.
 */

export type SeismicLevel = "NONE" | "MINOR" | "MODERATE" | "SEVERE";

export interface EarthquakeStatus {
  level: SeismicLevel;
  label: string;
  description: string;
  magnitude: string;
  affectedRobots: string[];
  avgVibration: number;
  maxVibration: number;
  correlationScore: number; // 0-100, how many robots are experiencing elevated vibration
}

const VIBRATION_ELEVATED = 0.4;
const VIBRATION_CRITICAL = 0.7;

function estimateMagnitude(avgVibration: number, correlatedCount: number): string {
  // Rough estimation based on PGA (Peak Ground Acceleration) mapping
  // This is simplified for demo purposes
  if (avgVibration > 0.8 && correlatedCount >= 3) return "~5.0+";
  if (avgVibration > 0.7 && correlatedCount >= 2) return "~4.5";
  if (avgVibration > 0.6 && correlatedCount >= 2) return "~4.0";
  if (avgVibration > 0.5) return "~3.5";
  if (avgVibration > 0.4) return "~3.0";
  return "< 2.5";
}

export function useEarthquakeDetection(robots: RobotData[]): EarthquakeStatus {
  return useMemo(() => {
    if (robots.length === 0) {
      return {
        level: "NONE",
        label: "No Seismic Activity",
        description: "All sensors reporting normal ground vibration levels.",
        magnitude: "N/A",
        affectedRobots: [],
        avgVibration: 0,
        maxVibration: 0,
        correlationScore: 0,
      };
    }

    const vibrations = robots.map((r) => r.vibration);
    const avgVibration = vibrations.reduce((a, b) => a + b, 0) / vibrations.length;
    const maxVibration = Math.max(...vibrations);

    const elevatedRobots = robots.filter((r) => r.vibration >= VIBRATION_ELEVATED);
    const criticalRobots = robots.filter((r) => r.vibration >= VIBRATION_CRITICAL);

    const elevatedCount = elevatedRobots.length;
    const criticalCount = criticalRobots.length;
    const correlationScore = Math.round((elevatedCount / robots.length) * 100);

    const affectedRobots = elevatedRobots.map((r) => r.robot_id);

    // Determine seismic level
    let level: SeismicLevel = "NONE";
    let label = "No Seismic Activity";
    let description = "All sensors reporting normal ground vibration levels.";

    if (criticalCount >= 2) {
      level = "SEVERE";
      label = "⚠️ EARTHQUAKE WARNING";
      description = `${criticalCount} robots detecting strong seismic waves (>${VIBRATION_CRITICAL}g). Correlated high vibration across ${correlationScore}% of the fleet indicates a significant seismic event.`;
    } else if (criticalCount === 1 && elevatedCount >= 2) {
      level = "SEVERE";
      label = "Earthquake Detected";
      description = `Strong vibration on ${criticalRobots[0].robot_id} with ${elevatedCount - 1} more robots showing elevated activity. Seismic event likely in progress.`;
    } else if (elevatedCount >= 3) {
      level = "MODERATE";
      label = "Seismic Activity Detected";
      description = `${elevatedCount} robots reporting elevated vibration (>${VIBRATION_ELEVATED}g). Correlated activity across ${correlationScore}% of fleet suggests regional seismic event.`;
    } else if (elevatedCount === 2) {
      level = "MODERATE";
      label = "Possible Seismic Activity";
      description = `${elevatedCount} robots showing elevated vibration levels. Monitoring for further correlation.`;
    } else if (criticalCount === 1) {
      level = "MINOR";
      label = "Strong Vibration Detected";
      description = `${criticalRobots[0].robot_id} reporting high vibration (${criticalRobots[0].vibration.toFixed(2)}g). Could be local disturbance or early seismic signal.`;
    } else if (elevatedCount === 1) {
      level = "MINOR";
      label = "Minor Tremor Nearby";
      description = `${elevatedRobots[0].robot_id} detecting elevated ground vibration (${elevatedRobots[0].vibration.toFixed(2)}g). Single-point reading — likely localized.`;
    }

    const magnitude = level !== "NONE" ? estimateMagnitude(avgVibration, elevatedCount) : "N/A";

    return {
      level,
      label,
      description,
      magnitude,
      affectedRobots,
      avgVibration,
      maxVibration,
      correlationScore,
    };
  }, [robots]);
}
