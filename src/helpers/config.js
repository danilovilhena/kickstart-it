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
      { name: "Keep a Changelog", value: "keepAChangelog" },
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
        { name: "Yes, with a basic template", value: "basic" },
        { name: "Yes, with a detailed template", value: "detailed" },
        { name: "No", value: false }
      ],
    },
    {
      ...listPromptConfig("gitignore"),
      message: "Would you like to add a .gitignore file?",
      choices: [
        { name: "Yes, with a general template", value: true },
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
      message: "What type of project is this?",
      choices: [
        { name: "Node.js", value: "node" },
        { name: "Browser", value: "browser" }
      ],
    }
  ]);

  Object.keys(answers).forEach((key) => {
    config[key] = answers[key];
  });
};

const buildNodeConfig = async () => {
  const answers = await inquirer.prompt([
    {
      ...listPromptConfig("moduleSystem"),
      message: "Which module system would you like to use?",
      choices: [
        { name: `CommonJS - ${chalk.green("const path = require('path')")}`, value: "cjs" },
        { name: `ES Modules - ${chalk.green("import path from 'path'")}`, value: "esm" }
      ],
    },
    {
      ...listPromptConfig("framework"),
      message: "Which framework would you like to use?",
      choices: [
        { name: "None", value: false },
        { name: "Express", value: "express" },
        { name: "Fastify", value: "fastify" }
      ],
    }
  ]);

  Object.keys(answers).forEach((key) => {
    config.node[key] = answers[key];
  });
};

const buildBrowserConfig = async () => {
  const { framework } = await inquirer.prompt([
    {
      ...listPromptConfig("framework"),
      message: "Which framework would you like to use?",
      choices: [
        { name: "None", value: false },
        { name: "React", value: "react" },
        { name: "Vue", value: "vue" },
        { name: "Angular", value: "angular" }
      ],
    }
  ]);

  config.browser.framework = framework;

  if (config.browser.framework === "react") {
    const { reactVariation } = await inquirer.prompt({
      ...listPromptConfig("reactVariation"),
      message: "Which variation of React would you like to use?",
      choices: [
        { name: "Default", value: "default" },
        { name: "Next.js", value: "nextjs" },
        { name: "Gatsby", value: "gatsby" },
        { name: "Preact", value: "preact" }
      ],
    });
    
    config.browser.reactVariation = reactVariation;
  } else if (config.browser.framework === "vue") {
    const { vueVariation } = await inquirer.prompt({
      ...listPromptConfig("vueVariation"),
      message: "Which variation of Vue would you like to use?",
      choices: [
        { name: "Default", value: "default" },
        { name: "Nuxt.js", value: "nuxt" },
        { name: "Vite", value: "vite" }
      ],
    });
    
    config.browser.vueVariation = vueVariation;
  } else if (config.browser.framework === "angular") {
    const { angularVariation } = await inquirer.prompt({
      ...listPromptConfig("angularVariation"),
      message: "Which variation of Angular would you like to use?",
      choices: [
        { name: "Default", value: "default" },
        { name: "Universal", value: "universal" },
        { name: "Nx Workspace", value: "nx-workspace" }
      ],
    });
    
    config.browser.angularVariation = angularVariation;
  }

  const { css } = await inquirer.prompt({
    ...listPromptConfig("css"),
    message: "Which CSS framework would you like to use?",
    choices: [
      { name: "None", value: false },
      { name: "Sass", value: "sass" },
      { name: "Tailwind CSS", value: "tailwind" },
      { name: "Bootstrap", value: "bootstrap" },
      { name: "Material UI", value: "mui" }
    ],
  });

  config.browser.css = css;
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
        { name: "Prettier", value: "prettier" }
      ],
    });
    
    config.eslint.configuration = configuration;
  }

  const { format, lintStaged } = await inquirer.prompt([
    {
      ...listPromptConfig("format"),
      message: "Would you like to use a formatter?",
      choices: [
        { name: "Prettier", value: "prettier" },
        { name: "No", value: false }
      ],
    },
    {
      ...listPromptConfig("lintStaged"),
      message: "Would you like to use a lint-staged?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
    }
  ]);

  config.format = format;
  config.lintStaged = lintStaged;
};

const buildOtherConfig = async () => {
  const { bundler } = await inquirer.prompt({
    ...listPromptConfig("bundler"),
    message: "Would you like to use a module bundler for your project?",
    choices: [
      { name: "Webpack", value: "webpack" },
      { name: "Rollup", value: "rollup" },
      { name: "Vite", value: "vite" },
      { name: "Parcel", value: "parcel" },
      { name: "No", value: false }
    ],
  });

  config.bundler = bundler;

  if (config.bundler === "webpack") {
    const { integrateBabel } = await inquirer.prompt({
      ...listPromptConfig("integrateBabel"),
      message: "Would you also like to include Babel with Webpack?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
    });
    
    config.integrateBabel = integrateBabel;
  } else if (config.bundler !== false) {
    const { integrateBabel } = await inquirer.prompt({
      ...listPromptConfig("integrateBabel"),
      message: "This bundler comes with built-in transpilation features. Do you want to explicitly add Babel?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
    });
    
    config.integrateBabel = integrateBabel;
  }

  const answers = await inquirer.prompt([
    {
      ...listPromptConfig("test"),
      message: "Would you like to use a testing framework?",
      choices: [
        { name: "Jest", value: "jest" },
        { name: "Mocha + Chai", value: "mocha+chai" },
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
    {
      ...listPromptConfig("ci"),
      message: "Would you like to use a CI/CD tool?",
      choices: [
        { name: "GitHub Actions", value: "githubActions" },
        { name: "GitLab CI", value: "gitlabCI" },
        { name: "CircleCI", value: "circleCI" },
        { name: "Travis CI", value: "travisCI" },
        { name: "Jenkins", value: "jenkins" },
        { name: "No", value: false }
      ],
    }
  ]);

  Object.keys(answers).forEach((key) => {
    config[key] = answers[key];
  });
}


const buildConfig = async () => {
  await buildChangelogConfig();
  await buildFirstBlockConfig();

  if (config.type === "node") await buildNodeConfig();
  else await buildBrowserConfig();
  
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
*/
