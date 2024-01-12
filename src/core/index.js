import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

import { cloneFile, exec } from "../helpers/index.js";
import { config } from "../helpers/config.js";
import { logError, logSuccess, logWarning, startLoading, stopLoading } from "../helpers/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const installCommand = ({ name, isGlobal, isDev, packageManager }) => {
  return {
    npm: `npm install ${isGlobal && "-g"} ${isDev && "--save-dev"} ${name}`,
    yarn: `yarn ${isGlobal && "global "}add ${name} ${isDev && "--dev"}`,
    pnpm: `pnpm add ${isGlobal && "-g"} ${isDev && "--save-dev"} ${name}`,
  }[packageManager];
}

const checkForPackageJson = async () => {
  const packageManager = config.packageManager;
  const hasPackageJson = fs.existsSync("./package.json");
  if (hasPackageJson) return;

  logWarning(`No package.json found. Creating one with ${packageManager}!`);

  const platform = os.platform();

  await exec({
    command: `${platform === "win32" ? "where" : "which"} ${packageManager}`,
    errorMessage: `Could not find ${packageManager}. Please install it and try again.`,
  });

  await exec({
    command: `${packageManager} init -y`,
    errorMessage: "Could not create package.json",
  });

  logSuccess("Created package.json");
}

const checkForGit = async () => {
  const hasGit = fs.existsSync("./.git");
  if (hasGit) return;

  const platform = os.platform();

  logWarning("No git repository found. Creating one now!");

  await exec({
    command: `${platform === "win32" ? "where" : "which"} git`,
    errorMessage: "Could not find git. Please install it and try again.",
  });

  await exec({
    command: "git init",
    errorMessage: "Could not create .git"
  });

  logSuccess("Created .git");
}

const createChangelog = async () => {
  const hasChangelog = fs.existsSync("./CHANGELOG.md");
  if (hasChangelog) return;

  try {
    await cloneFile(path.resolve(__dirname, `../defaults/changelog/${config.changelog}.md`), "./CHANGELOG.md");
  } catch (error) {
    logError("Could not create CHANGELOG.md");
  }

  logSuccess("Created CHANGELOG.md");
}

const installCommitizen = async () => {
  const packageManager = config.packageManager;

  await exec({
    command: installCommand({ name: "commitizen", isGlobal: true, packageManager }),
    errorMessage: "Could not install commitizen",
  });

  const initCommand = {
    npm: "commitizen init cz-conventional-changelog --save-dev --save-exact",
    yarn: "commitizen init cz-conventional-changelog --yarn --dev --exact",
    pnpm: "commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact",
  };

  await exec({
    command: initCommand[packageManager],
    errorMessage: "Could not init commitizen",
  });

  logSuccess("Installed commitizen");
}

const createReadme = async () => {
  const hasReadme = fs.existsSync("./README.md");
  if (hasReadme) return;

  try {
    await cloneFile(path.resolve(__dirname, "../defaults/readme/example.md"), "./README.md");
  } catch (error) {
    logError("Could not create README.md");
  }

  logSuccess("Created README.md");
}

const createGitIgnore = async () => {
  const hasGitIgnore = fs.existsSync("./.gitignore");
  if (hasGitIgnore) return;

  try {
    await cloneFile(path.resolve(__dirname, "../defaults/gitignore/example.md"), "./.gitignore");
  } catch (error) {
    logError("Could not create .gitignore");
  }

  logSuccess("Created .gitignore");
}

const installHusky = async () => {
  startLoading("Installing husky");

  const initCommand = {
    npm: "npx husky-init && npm install",
    yarn: "yarn dlx husky-init --yarn2 && yarn",
    pnpm: "pnpm dlx husky-init && pnpm install",
  };

  await exec({
    command: initCommand[config.packageManager],
    errorMessage: "Could not install husky",
  });

  stopLoading();
  logSuccess("Installed husky");
}

const configureTypescript = async () => {
  const hasTsConfig = fs.existsSync("./tsconfig.json");
  if (hasTsConfig) return;

  exec({
    command: installCommand({ name: "typescript", isDev: true, packageManager: config.packageManager }),
    errorMessage: "Could not install TypeScript",
  });

  const tsConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../defaults/tsconfig/tsconfig.json"), "utf-8"));
  if (config.type === "esm") tsConfig.compilerOptions.module = "esnext";
  fs.writeFileSync("./tsconfig.json", JSON.stringify(tsConfig, null, 2));

  const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  const previousMain = packageJson.main;
  packageJson.main = `dist/${previousMain}`;
  packageJson.scripts.build = "tsc";
  packageJson.scripts.start = `tsc && node dist/${previousMain}`;
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

  logSuccess("Configured TypeScript");
}

const configureNode = async () => {
  const file = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  file.type = config.node.moduleSystem === "cjs" ? "commonjs" : "module";
  fs.writeFileSync("./package.json", JSON.stringify(file, null, 2));
}

const kickstart = async () => {
  await checkForPackageJson();
  await checkForGit();
  if (config.changelog) await createChangelog();
  if (config.commitizen) await installCommitizen();
  if (config.readme) await createReadme();
  if (config.gitignore) await createGitIgnore();
  if (config.husky) await installHusky();
  if (config.language === "ts") await configureTypescript();
  await configureNode();
};

export {
  kickstart,
}