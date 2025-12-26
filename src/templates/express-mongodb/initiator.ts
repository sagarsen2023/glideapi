import os from "os";
import { ConfigOptions, TemplateFile } from "../../types/initiator.types";
import fs from "fs-extra";
import path from "path";

export const expressMongodbConfig = async (
  folderName: string,
): Promise<ConfigOptions> => {
  const templateDir = `${__dirname}/project-files`;

  const isWindows = os.platform() === "win32";

  const getAllFilesRecursively = (dir: string, prefix = ""): TemplateFile[] => {
    let results: TemplateFile[] = [];
    const list = fs.readdirSync(dir);

    list.forEach((file: string) => {
      const filePath = path.join(dir, file);
      const relPath = path.join(prefix, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        results = results.concat(getAllFilesRecursively(filePath, relPath));
      } else {
        results.push({
          source: filePath,
          target: path.join(folderName, relPath),
        });
      }
    });
    return results;
  };

  const allProjectFiles: TemplateFile[] = getAllFilesRecursively(templateDir);

  return {
    name: "Express with MongoDB",
    command: `npm init -y ${folderName === "." ? "" : folderName} && cd ${folderName} && npm i express mongoose cors dotenv bcrypt chalk fs-extra jsonwebtoken zod && npm i -D @types/bcrypt @types/cors @types/express @types/fs-extra @types/jsonwebtoken @types/mongoose @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint ts-node ts-node-dev tsc-alias tsconfig-paths typescript`,

    templateFiles: [
      // ? All files and folders under project-files copied into folderName
      ...allProjectFiles,
    ],
    postInstallCommands: [
      `cd ${folderName} && npx npm-add-script -k "dev" -v "ts-node -r tsconfig-paths/register src/index.ts"`,
      `cd ${folderName} && npx npm-add-script -k "error-check" -v "eslint . --ext .ts && tsc --noEmit && echo 'No errors found!'"`,
      `cd ${folderName} && npx npm-add-script -k "build" -v "tsc && tsc-alias"`,
      `cd ${folderName} && npx npm-add-script -k "start" -v "node dist/index.js"`,
    ],
    finalizationCommands: [
      `cd ${folderName} && git init`,
      `cd ${folderName} && git add . ${isWindows ? "> NUL 2>&1" : "> /dev/null 2>&1"}`,
      `cd ${folderName} && git branch -M main`,
      `cd ${folderName} && git commit -m "Initialized base project" ${
        isWindows ? "> NUL 2>&1" : "> /dev/null 2>&1"
      }`,
    ],
  };
};
