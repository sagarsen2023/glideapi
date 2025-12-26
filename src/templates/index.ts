import { ConfigOptions } from "../types/initiator.types";
import { expressMongodbConfig } from "./mongodb/initiator";

interface TemplateConfig {
  [key: string]: {
    init: (folderName: string) => Promise<ConfigOptions>;
    generateRoute?: (route: string) => void;
  };
}

export const templateConfigs: TemplateConfig = {
  "express-mongodb": {
    init: (folderName: string) => expressMongodbConfig(folderName),
  },
};
