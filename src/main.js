import fs from "fs";
import chalk from "chalk";
import { exec } from "child_process";

import { buildConfig } from "./helpers/config.js";

const main = async () => {
  console.log(`Welcome to ${chalk.bold(chalk.magenta("kickstart 🚀"))}, the ${chalk.underline("fast way")} to setup your projects!`);
  console.log("Let's get started...");

  await buildConfig();

  console.log(`${chalk.yellow("Thanks for answering! Starting the setup...")}`)

  // TODO: replace with support to yarn and pnpm
  const hasPackageJson = fs.existsSync("./package.json");
  if (!hasPackageJson) {exec("npm init -y", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });}

  console.log(`${chalk.green("Your project is ready!")}`)
};

main();
