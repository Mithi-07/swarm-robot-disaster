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
  earthquake_risk: "LOW" | "MEDIUM" | "HIGH";
  earthquake_score: number;
  timestamp: string;
}
