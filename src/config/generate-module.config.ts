import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { templateConfigs } from "../templates";
import { GlideApiJson } from "../types/glideapi-json.types";

const log = console.log;

export const generateModuleCommand = new Command("generate-module")
  .argument("<module>", "The module to generate")
  .description("Generates a new module. Like users, accounts")
  .action((module: string) => {
    try {
      log(chalk.blueBright(`Generating module: ${module}`));

      const cwd = process.cwd(); // Getting current directory
      const glideApiJson: GlideApiJson = fs.readJsonSync(
        path.join(cwd, "glideapi.json"),
      );

      // Generating module
      templateConfigs[glideApiJson.database].generateModule?.(module);
    } catch (e) {
      const error = e as Error;
      log(
        chalk.redBright(`Error generating module "${module}": ${error.message}`),
      );
    }
  });
