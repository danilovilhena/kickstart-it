import chalk from "chalk";
import ora from "ora";

let spinner;

const logWarning = (message) => {
  console.log(chalk.yellow(message));
};

const logSuccess = (message, showCheckmark = true) => {
  console.log(`${showCheckmark ? "✓ ": ""}${chalk.green(message)}`);
};

const logError = (message) => {
  console.error(chalk.red(`[ERROR] ${message}`));
  process.exit(1);
}

const startLoading = (message) => {
  spinner = ora(message).start();
  spinner.color = "green";
}

const stopLoading = () => {
  spinner.stop();

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}

export {
  logError,
  logSuccess,
  logWarning,
  startLoading,
  stopLoading,
}