export interface RobotData {
  robot_id: string;
  soil_moisture: number;
  vibration: number;
  tilt: number;
  latitude: number;
  longitude: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  risk_score: number;
  confidence: number;
  battery: number;
  battery_status: "GOOD" | "LOW" | "CRITICAL";
  battery_health_score: number;
  charging_required: boolean;
  earthquake_risk: "LOW" | "MEDIUM" | "HIGH";
  earthquake_score: number;
  timestamp: string;
}
