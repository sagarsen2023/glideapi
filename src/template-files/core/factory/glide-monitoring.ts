import { errorLog } from "@/utils/logger";
import {
  MonitoringStepType,
  MonitoringType,
  StepType,
} from "core/types/monitoring.type";
import fs from "fs-extra";
import path from "path";

const MONITORING_FILE_PATH = path.join(
  __dirname,
  "../../.glideapi/monitoring.json",
);

async function getGlideApiMonitoringData(): Promise<MonitoringType[]> {
  try {
    const exists = await fs.pathExists(MONITORING_FILE_PATH);
    if (!exists) {
      return [];
    }
    const data = await fs.readJson(MONITORING_FILE_PATH);
    return data;
  } catch (err) {
    errorLog("Error reading monitoring data:" + err);
    return [];
  }
}

async function writeMonitoringData(data: MonitoringType[]) {
  try {
    const dir = path.dirname(MONITORING_FILE_PATH);
    await fs.ensureDir(dir);
    await fs.writeJson(MONITORING_FILE_PATH, data, { spaces: 2 });
  } catch (err) {
    errorLog("Error writing monitoring data:" + err);
  }
}

export class GlideMonitor {
  private monitoringData: MonitoringType[] = [];

  // ? Loading existing data
  async init() {
    this.monitoringData = await getGlideApiMonitoringData();
  }

  // ? Adding a new monitoring entry (per request)
  async addNewEntry(endPoint: string, method: string): Promise<MonitoringType> {
    const newEntry: MonitoringType = {
      endPoint,
      method,
      timestamp: new Date().toISOString(),
      steps: [],
    };
    this.monitoringData.push(newEntry);
    await writeMonitoringData(this.monitoringData);
    return newEntry;
  }

  // ? Adding a step to an existing monitoring entry
  async addStep({
    endPoint,
    stepName,
    info,
    error,
  }: {
    endPoint: string;
    stepName: StepType;
    info?: string;
    error?: string;
  }) {
    const entry = this.monitoringData.find((d) => d.endPoint === endPoint);
    if (!entry) {
      errorLog(`Monitoring entry not found for endpoint: ${endPoint}`);
      return;
    }

    const newStep: MonitoringStepType = {
      stepName,
      timestamp: new Date().toISOString(),
      info,
      error,
    };
    entry.steps.push(newStep);

    // Save updated data
    await writeMonitoringData(this.monitoringData);
  }

  // Get all monitoring data
  getData(): MonitoringType[] {
    return this.monitoringData;
  }

  // ? Optional: filter by endpoint or method
  filterByEndPoint(endPoint: string) {
    return this.monitoringData.filter((d) => d.endPoint === endPoint);
  }
}
