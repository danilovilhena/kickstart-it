import inquirer from "inquirer";
import chalk from "chalk";
import defaultConfig from "../defaults/defaultConfig.js";

const config = { ...defaultConfig };

const listPromptConfig = (name) => ({
  type: "list",
  prefix: `${chalk.magenta("?")}`,
  name
});

const buildChangelogConfig = async () => {
  const { changelog } = await inquirer.prompt({
    ...listPromptConfig("changelog"),
    message: "Would you like to add a CHANGELOG?",
    choices: [
      { name: `Keep a Changelog ${chalk.dim("(recommended)")}`, value: "keepAChangelog" },
      { name: "Conventional Changelog", value: "conventionalChangelog" },
      { name: "No", value: false }
    ],
  });
  
  config.changelog = changelog;

  if (changelog === "conventionalChangelog") {
    const { commitizen } = await inquirer.prompt({
      ...listPromptConfig("commitizen"),
      message: "Would you like to use Commitizen?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
    });
    
    config.commitizen = commitizen;
  }
};

const buildFirstBlockConfig = async () => {
  const answers = await inquirer.prompt([
    {
      ...listPromptConfig("readme"),
      message: "Would you like to add a README?",
      choices: [
        { name: "Yes, with a basic template", value: true },
        { name: "No", value: false }
      ],
    },
    {
      ...listPromptConfig("gitignore"),
      message: "Would you like to add a .gitignore file?",
      choices: [
        { name: `Yes, with a general template ${chalk.dim("(recommended)")}`, value: true },
        { name: "No", value: false }
      ],
    },
    {
      ...listPromptConfig("husky"),
      message: "Would you like to add Husky 🐶?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
    },
    {
      ...listPromptConfig("language"),
      message: "Which language would you like to use?",
      choices: [
        { name: "JavaScript", value: "js" },
        { name: "TypeScript", value: "ts" }
      ],
    },
    {
      ...listPromptConfig("type"),
      message: "Which module system would you like to use?",
      choices: [
        { name: `CommonJS - ${chalk.green("const path = require('path')")}`, value: "cjs" },
        { name: `ES Modules - ${chalk.green("import path from 'path'")}`, value: "esm" }
      ],
    },
    {
      ...listPromptConfig("env"),
      message: "Where is the type of your project?",
      choices: [
        { name: "Node.js", value: "node" },
        { name: "Browser", value: "browser" }
      ],
    },
  ]);

  Object.keys(answers).forEach((key) => {
    config[key] = answers[key];
  });
};

const buildLintConfig = async () => {
  const { lint } = await inquirer.prompt({
    ...listPromptConfig("lint"),
    message: "Which linter would you like to use?",
    choices: [
      { name: "ESLint", value: "eslint" },
      { name: "StandardJS", value: "standardjs" },
      { name: "No", value: false }
    ],
  });

  config.lint = lint;

  if (config.lint === "eslint") {
    const { integratePrettier } = await inquirer.prompt({
      ...listPromptConfig("integratePrettier"),
      message: "Would you like to integrate Prettier with ESLint?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
    });
    
    config.eslint.integratePrettier = integratePrettier;

    const { configuration } = await inquirer.prompt({
      ...listPromptConfig("configuration"),
      message: "Choose the configuration for ESLint:",
      choices: [
        { name: "Standard", value: "standard" },
        { name: "Airbnb", value: "airbnb" },
        { name: "Google", value: "google" },
        { name: "Recommended", value: "recommended" },
      ],
    });
    
    config.eslint.configuration = configuration;
  }

  if (!config.eslint.integratePrettier) {
    const { format } = await inquirer.prompt({
      ...listPromptConfig("format"),
      message: "Would you like to use a formatter?",
      choices: [
        { name: "Prettier", value: "prettier" },
        { name: "No", value: false }
      ],
    });

    config.format = format;
  }

  const { lintStaged } = await inquirer.prompt({
    ...listPromptConfig("lintStaged"),
    message: "Would you like to use a lint-staged?",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false }
    ],
  });
  
  config.lintStaged = lintStaged;
};

const buildOtherConfig = async () => {
  // const { bundler } = await inquirer.prompt({
  //   ...listPromptConfig("bundler"),
  //   message: "Would you like to use a module bundler for your project?",
  //   choices: [
  //     { name: "Webpack", value: "webpack" },
  //     { name: "Rollup", value: "rollup" },
  //     { name: "Vite", value: "vite" },
  //     { name: "Parcel", value: "parcel" },
  //     { name: "No", value: false }
  //   ],
  // });

  // config.bundler = bundler;

  // if (config.bundler === "webpack") {
  //   const { integrateBabel } = await inquirer.prompt({
  //     ...listPromptConfig("integrateBabel"),
  //     message: "Would you also like to include Babel with Webpack?",
  //     choices: [
  //       { name: "Yes", value: true },
  //       { name: "No", value: false }
  //     ],
  //   });
    
  //   config.integrateBabel = integrateBabel;
  // } else if (config.bundler !== false) {
  //   const { integrateBabel } = await inquirer.prompt({
  //     ...listPromptConfig("integrateBabel"),
  //     message: "This bundler comes with built-in transpilation features. Do you want to explicitly add Babel?",
  //     choices: [
  //       { name: "Yes", value: true },
  //       { name: "No", value: false }
  //     ],
  //   });
    
  //   config.integrateBabel = integrateBabel;
  // }

  const answers = await inquirer.prompt([
    {
      ...listPromptConfig("test"),
      message: "Would you like to use a testing framework?",
      choices: [
        { name: "Jest", value: "jest" },
        { name: "Jasmine", value: "jasmine" },
        { name: "Cypress", value: "cypress" },
        { name: "Playwright", value: "playwright" },
        { name: "No", value: false }
      ],
    },
    {
      ...listPromptConfig("packageManager"),
      message: "Which package manager would you like to use?",
      choices: [
        { name: "npm", value: "npm" },
        { name: "Yarn", value: "yarn" },
        { name: "pnpm", value: "pnpm" }
      ],
    },
    // {
    //   ...listPromptConfig("ci"),
    //   message: "Would you like to use a CI/CD tool?",
    //   choices: [
    //     { name: "GitHub Actions", value: "githubActions" },
    //     { name: "GitLab CI", value: "gitlabCI" },
    //     { name: "CircleCI", value: "circleCI" },
    //     { name: "Travis CI", value: "travisCI" },
    //     { name: "Jenkins", value: "jenkins" },
    //     { name: "No", value: false }
    //   ],
    // }
  ]);

  Object.keys(answers).forEach((key) => {
    config[key] = answers[key];
  });
}


const buildConfig = async () => {
  await buildChangelogConfig();
  await buildFirstBlockConfig();
  await buildLintConfig();
  await buildOtherConfig();
};

export {
  config,
  buildConfig,
};

/*
TODO: add the following options:
--config: receive a config file
--lang: receive a language (i18n)

TODO: add schema validation if config file is provided
*/
