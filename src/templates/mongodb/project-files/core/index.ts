import { config } from "@/config";
import { glideRouteMapper } from "./factory/glide-route-mapper";
import { successLog } from "@/utils/logger";

export const initializeCore = async () => {
  await glideRouteMapper();
  if (config.debugMode) {
    successLog(
      `[GlideAPI - ${new Date().toLocaleTimeString()}]: Core initialized in debug mode.\n`,
    );
  }
};
