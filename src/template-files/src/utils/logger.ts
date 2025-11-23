import chalk from "chalk";

export const errorLog = (message: string) => {
  console.log(chalk.redBright(`x ${message}`));
};

export const infoLog = (message: string) => {
  console.log(chalk.blueBright(`[INFO] ${message}`));
};

export const successLog = (message: string) => {
  console.log(chalk.greenBright(`✔ ${message}`));
};
