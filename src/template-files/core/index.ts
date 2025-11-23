import { config } from "@/config";
import { glideRouteMapper } from "./factory/glide-route-mapper";
import { GlideMonitor } from "./factory/glide-monitoring";
import { successLog } from "@/utils/logger";

export const initializeCore = async () => {
  const glideMonitor = new GlideMonitor();
  await glideRouteMapper();
  if (config.debugMode) {
    await glideMonitor.init();
    successLog(
      `[GlideAPI - ${new Date().toLocaleTimeString()}]: Core initialized in debug mode.\n`,
    );
  }
};
