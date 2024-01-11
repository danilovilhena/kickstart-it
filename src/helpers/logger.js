import chalk from "chalk";

const logWarning = (message, withIcon = false) => {
  console.log(`${withIcon && "🟡"} ${chalk.yellow(message)}`);
};

const logSuccess = (message) => {
  console.log(chalk.green(message));
};

const logError = (message) => {
  console.error(chalk.red(`[ERROR] ${message}`));
}

export {
  logError,
  logSuccess,
  logWarning,
}