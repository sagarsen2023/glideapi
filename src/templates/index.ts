import { ConfigOptions } from "../types/initiator.types";
import { expressMongodbConfig } from "./express-mongodb/initiator";
import { expressMongodbRouteGenerator } from "./express-mongodb/route-generator";

interface TemplateConfig {
  [key: string]: {
    init: (folderName: string) => Promise<ConfigOptions>;
    generateModule?: (module: string) => void;
  };
}

export const templateConfigs: TemplateConfig = {
  "express-mongodb": {
    init: (folderName: string) => expressMongodbConfig(folderName),
    generateModule: (module: string) => expressMongodbRouteGenerator(module),
  },
};
