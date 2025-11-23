export type StepType =
  | "start"
  | "db-connected"
  | "route-hit"
  | "controller-hit"
  | "service-hit"
  | "end";

export interface MonitoringStepType {
  stepName: StepType;
  timestamp: string;
  info?: string;
  error?: string;
}

export interface MonitoringType {
  endPoint: string;
  method: string;
  timestamp?: string;
  steps: MonitoringStepType[];
}
