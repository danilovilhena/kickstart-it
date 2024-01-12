import fs from "fs";
import { promisify } from "util";
import { exec as originalExec, spawn as originalSpawn } from "child_process";
import { logError } from "./logger.js";

const promiseExec = promisify(originalExec);

const cloneFile = async (source, destination) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);

    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    readStream.pipe(writeStream);
  });
};

const exec = async ({ command, errorMessage }) => {
  try {
    return await promiseExec(command);
  } catch (error) {
    logError(errorMessage);
    process.exit(1);
  }
};

const spawn = async ({ command, errorMessage }) => {
  const innerSpawn = () => {
    return new Promise((resolve, reject) => {
      const child = originalSpawn(command, { stdio: "inherit", shell: true });
      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(code));
      });
      child.on("error", () => reject(new Error()));
    });
  }

  try {
    await innerSpawn({ command, errorMessage })
  } catch (error) {
    logError(errorMessage);
    process.exit(1);
  }
}

export {
  cloneFile,
  exec,
  spawn,
}