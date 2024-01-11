import fs from "fs";
import os from "os";
import exec from "../helpers/exec.js";
import { config } from "../helpers/config.js";
import { logSuccess, logWarning } from "../helpers/logger.js";

const checkForPackageJson = async () => {
  const packageManager = config.packageManager;
  const hasPackageJson = fs.existsSync("./package.json");

  if (hasPackageJson) return;

  logWarning(`No package.json found. Creating one with ${packageManager}!`, true);

  const platform = os.platform();

  await exec({
    command: `${platform === "win32" ? "where" : "which"} ${packageManager}`,
    errorMessage: `Could not find ${packageManager}. Please install it and try again.`,
  });

  await exec({
    command: `${packageManager} init -y`,
    errorMessage: "Could not create package.json. This was the error: "
  });

  logSuccess("Created package.json!");
}

const kickstart = async () => {
  await checkForPackageJson();
};

export {
  kickstart,
}