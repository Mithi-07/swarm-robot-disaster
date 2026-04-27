"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { RobotData } from "@/types/robot";

interface UseRobotDataReturn {
  data: RobotData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  newHighRisk: boolean;
}

const API_URL = "/api/robots";

export function useRobotData(pollInterval: number = 2000): UseRobotDataReturn {
  const [data, setData] = useState<RobotData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newHighRisk, setNewHighRisk] = useState<boolean>(false);
  const prevHighRiskIdsRef = useRef<Set<string>>(new Set());
  const isFirstFetch = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      // Handle both array and {body: array} responses
      let rawRobots: Record<string, unknown>[];
      if (Array.isArray(json)) {
        rawRobots = json;
      } else if (json.body && Array.isArray(json.body)) {
        rawRobots = json.body;
      } else if (typeof json.body === "string") {
        rawRobots = JSON.parse(json.body);
      } else {
        rawRobots = [];
      }

      // Normalize: DynamoDB returns all values as strings
      const robots: RobotData[] = rawRobots.map((r) => ({
        robot_id: String(r.robot_id || ""),
        soil_moisture: Number(r.soil_moisture) || 0,
        vibration: Number(r.vibration) || 0,
        tilt: Number(r.tilt) || 0,
        latitude: Number(r.latitude) || 0,
        longitude: Number(r.longitude) || 0,
        risk_level: (String(r.risk_level || "LOW") as RobotData["risk_level"]),
        risk_score: Number(r.risk_score) || 0,
        confidence: Number(r.confidence) || 0,
        battery: r.battery !== undefined ? Number(r.battery) : 100,
        earthquake_risk: (String(r.earthquake_risk || "LOW") as RobotData["earthquake_risk"]),
        earthquake_score: Number(r.earthquake_score) || 0,
        timestamp: String(r.timestamp || ""),
      }));

      // Deduplicate: keep only the latest entry per robot_id
      const robotMap = new Map<string, RobotData>();
      for (const robot of robots) {
        const existing = robotMap.get(robot.robot_id);
        if (!existing || robot.timestamp > existing.timestamp) {
          robotMap.set(robot.robot_id, robot);
        }
      }
      const dedupedRobots = Array.from(robotMap.values());

      // Check for new HIGH risk robots
      const currentHighRiskIds = new Set(
        dedupedRobots.filter((r) => r.risk_level === "HIGH").map((r) => r.robot_id)
      );

      if (!isFirstFetch.current) {
        const hasNewHigh = [...currentHighRiskIds].some(
          (id) => !prevHighRiskIdsRef.current.has(id)
        );
        if (hasNewHigh) {
          setNewHighRisk(true);
          setTimeout(() => setNewHighRisk(false), 3000);
        }
      }

      prevHighRiskIdsRef.current = currentHighRiskIds;
      isFirstFetch.current = false;

      setData(dedupedRobots);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [fetchData, pollInterval]);

  const highRiskCount = data.filter((r) => r.risk_level === "HIGH").length;
  const mediumRiskCount = data.filter((r) => r.risk_level === "MEDIUM").length;
  const lowRiskCount = data.filter((r) => r.risk_level === "LOW").length;

  return {
    data,
    loading,
    error,
    lastUpdated,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    newHighRisk,
  };
}
