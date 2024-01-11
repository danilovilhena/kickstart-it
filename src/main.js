import chalk from "chalk";
import { kickstart } from "./core/index.js";
import { buildConfig } from "./helpers/config.js";
import { logSuccess } from "./helpers/logger.js";

const main = async () => {
  console.log(`Welcome to ${chalk.bold(chalk.magenta("kickstart 🚀"))}, the ${chalk.underline("fast way")} to setup your projects!`);
  console.log("Let's get started...");

  await buildConfig();
  await kickstart();

  logSuccess("Your project is ready!");
};

main();
