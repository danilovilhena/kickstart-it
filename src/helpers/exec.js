import { promisify } from "util";
import { exec as originalExec } from "child_process";
import { logError } from "./logger.js";

const exec = promisify(originalExec);

export default async ({ command, errorMessage }) => {
  try {
    return await exec(command);
  } catch (error) {
    logError(errorMessage);
    process.exit(1);
  }
};