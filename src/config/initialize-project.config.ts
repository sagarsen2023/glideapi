import { Command } from "commander";
import { customPrompt } from "../utils/custom-prompt";
import { execSync } from "child_process";
import { templateConfigs } from "../templates/index";
import fs from "fs-extra";
import path from "path";
import { getTemplates } from "../lib/get-templates";
import { errorLog, infoLog, successLog } from "../utils/logger";

export const initCommand = new Command("init")
  .argument(
    "[folder]",
    "folder to initialize project in (default: current folder)",
  )
  .description(
    "Initialize project in the specified folder (default: current folder)",
  )
  .showHelpAfterError()
  .action(async (folder?: string) => {
    try {
      // Asking user to select a database template
      // ? The templates will be automatically fetched from the templates directory
      const choice = await customPrompt({
        message: "Choose your database",
        choices: getTemplates(),
      });
      successLog(`Initializing database ---> ${choice}\n`);

      const target = folder || ".";
      const {
        command,
        postInstallCommands,
        templateFiles,
        finalizationCommands,
      } = await templateConfigs[choice].init(target);

      // Initialize the project
      execSync(command, {
        stdio: "inherit",
      });

      // Running post-install commands
      postInstallCommands?.forEach((cmd) => {
        if (cmd === "") return;
        execSync(cmd, {
          stdio: "inherit",
        });
      });

      // Copy template files if available
      if (templateFiles) {
        infoLog("📂 Copying template files...");
        templateFiles.forEach(({ source, target }) => {
          try {
            const targetDir = path.dirname(target);
            fs.ensureDirSync(targetDir);
            fs.copyFileSync(source, target);
            successLog(`   ✓ ${target}`);
          } catch (error: any) {
            errorLog(
              `   ⚠️  Warning: Could not copy ${source} to ${target}: ${error.message}`,
            );
          }
        });
      }

      // ? Finalizing project setup
      finalizationCommands?.forEach((cmd) => {
        if (cmd === "") return;
        execSync(cmd, {
          stdio: "inherit",
        });
      });

      successLog("✅ Project initialized successfully!");
    } catch (e) {
      const error = e as Error;
      errorLog("Project initialization cancelled!");
      errorLog(error.message);
      process.exit(0);
    }
  });
