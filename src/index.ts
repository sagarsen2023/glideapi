import { Command } from "commander";
import { initCommand } from "./config/initialize-project.config";

const program = new Command();

program
  .name("glideapi")
  .description(
    "CLI to scaffold projects and generate modules for backend development",
  )
  .version("1.0.0");

// Initialize project command
program.addCommand(initCommand);

// Module generation command
// program.addCommand(generateModuleCommand);

program.parse();
