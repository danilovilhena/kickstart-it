#!/usr/bin/env node
import chalk from "chalk";
import { kickstart } from "./core/index.js";
import { clearUndefined } from "./helpers/index.js";
import { buildConfig } from "./helpers/config.js";
import { logSuccess } from "./helpers/logger.js";

const main = async () => {
  console.log(`Welcome to ${chalk.bold(chalk.magenta("kickstart 🚀"))}, the ${chalk.underline("fast way")} to setup your projects!`);
  console.log("Let's get started...");

  await buildConfig();
  await kickstart();
  clearUndefined();

  // TODO: ask if user want to download the config

  logSuccess("\n------", false);
  logSuccess("🎉 Your project is ready!", false);
  logSuccess("------", false);

  // TODO: add a section with a \n before saying: here's what you should do next
};

main();
