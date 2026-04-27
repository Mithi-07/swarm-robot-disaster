"use client";

import { useMemo } from "react";
import type { RobotData } from "@/types/robot";

/**
 * Earthquake detection using API-provided earthquake_risk and earthquake_score.
 */

export type SeismicLevel = "NONE" | "MINOR" | "MODERATE" | "SEVERE";

export interface EarthquakeStatus {
  level: SeismicLevel;
  label: string;
  description: string;
  magnitude: string;
  affectedRobots: string[];
  avgScore: number;
  maxScore: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

function estimateMagnitude(maxScore: number, highCount: number): string {
  if (maxScore > 0.8 && highCount >= 2) return "~5.0+";
  if (maxScore > 0.7) return "~4.5";
  if (maxScore > 0.5) return "~4.0";
  if (maxScore > 0.3) return "~3.0";
  if (maxScore > 0.1) return "~2.0";
  return "< 2.0";
}

export function useEarthquakeDetection(robots: RobotData[]): EarthquakeStatus {
  return useMemo(() => {
    if (robots.length === 0) {
      return {
        level: "NONE",
        label: "No Seismic Activity",
        description: "No robot data available.",
        magnitude: "N/A",
        affectedRobots: [],
        avgScore: 0,
        maxScore: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
      };
    }

    const highRobots = robots.filter((r) => r.earthquake_risk === "HIGH");
    const medRobots = robots.filter((r) => r.earthquake_risk === "MEDIUM");
    const lowRobots = robots.filter((r) => r.earthquake_risk === "LOW");

    const scores = robots.map((r) => r.earthquake_score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);

    const affectedRobots = [...highRobots, ...medRobots].map((r) => r.robot_id);

    let level: SeismicLevel = "NONE";
    let label = "No Seismic Activity";
    let description = "All sensors reporting normal seismic conditions.";

    if (highRobots.length >= 2) {
      level = "SEVERE";
      label = "⚠️ EARTHQUAKE WARNING";
      description = `${highRobots.length} robots reporting HIGH earthquake risk (max score: ${maxScore.toFixed(2)}). Multiple correlated detections indicate a significant seismic event.`;
    } else if (highRobots.length === 1) {
      level = "SEVERE";
      label = "Earthquake Detected";
      description = `${highRobots[0].robot_id} reporting HIGH earthquake risk (score: ${highRobots[0].earthquake_score.toFixed(2)}). Strong seismic activity detected in the area.`;
    } else if (medRobots.length >= 2) {
      level = "MODERATE";
      label = "Seismic Activity Detected";
      description = `${medRobots.length} robots reporting MEDIUM earthquake risk. Moderate seismic activity across the monitoring area.`;
    } else if (medRobots.length === 1) {
      level = "MINOR";
      label = "Minor Seismic Activity";
      description = `${medRobots[0].robot_id} reporting MEDIUM earthquake risk (score: ${medRobots[0].earthquake_score.toFixed(2)}). Monitoring for escalation.`;
    } else if (maxScore > 0.1) {
      level = "MINOR";
      label = "Low Seismic Activity";
      description = `Minor ground vibrations detected (max score: ${maxScore.toFixed(2)}). Within normal range.`;
    }

    const magnitude = level !== "NONE" ? estimateMagnitude(maxScore, highRobots.length) : "N/A";

    return {
      level,
      label,
      description,
      magnitude,
      affectedRobots,
      avgScore,
      maxScore,
      highCount: highRobots.length,
      mediumCount: medRobots.length,
      lowCount: lowRobots.length,
    };
  }, [robots]);
}
