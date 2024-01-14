# 🚀 Kickstart
**The fastest way to setup your Javascript projects!**

![npm](https://img.shields.io/npm/v/kickstart-it)
![npm](https://img.shields.io/npm/dt/kickstart-it)
![node-current](https://img.shields.io/node/v/kickstart-it)

![Kickstart demonstration](https://github.com/danilovilhena/kickstart-it/assets/54288190/3432eb44-a96c-4431-a87c-476e257a02f3)

In less than a minute and just answering questions, you're able to setup:

✅ README, Changelog, Commitizen and .gitignore<br>
✅ Husky and lint-staged<br>
✅ Linter (ESLint or StandardJS) and formatter (Prettier)<br>
✅ CSS frameworks (Tailwind, Sass or Material UI)<br>
✅ Unit testing frameworks (Jest or Jasmine)<br>
✅ End-To-End testing frameworks (Cypress or Playwright)

**It's all 100% customizable! 🎉**

## 🔧 Installation

Simply run the command below:
```sh
npm install -g kickstart-it
```

## 💡 Usage

In a new project folder (it can have git initialized or package.json already, but if it doesn't kickstart will create it), run the command:
```sh
kickstart-it [--config=<path-to-file>] [--outputDir=<path-to-directory>]
```

### Flags

- `--config`: use a config file (check the next section)
- `--outputDir`: define the directory to init your project
  - Should be a path string, i.e. `project`, `./project`, `./dir/project`
  - If it's not created, kickstart will create it
  - If it's not specified here or in the config, the default is current directory

### Configuration
The config file must be in JSON. It can have the following properties:

> P.S.: You don't have to add all of them, just include the ones you need! All `false` or missing properties, won't be initialized.

| Property | Accepted values | Note |
| -------- | ------ | ----------- |
| `changelog` | "keepAChangelog", "conventionalChangelog", false  | |
| `commitizen` | true, false | Only used if `changelog` is "conventionalChangelog" |
| `readme` | true, false | |
| `gitignore` | true, false | |
| `husky` | true, false | |
| `language` | "js", "ts" | |
| `type` | "cjs", "esm" | |
| `env` | "node", "browser" | |
| `css` | "sass", "tailwind", "mui", false | |
| `lint` | "eslint", "standardjs", false | |
| `eslint.integratePrettier` | true, false | Only used if `lint` is set to "eslint" |
| `eslint.configuration` | true, false | Only used if `lint` is set to "eslint"  |
| `format` | "prettier", false | If `eslint.integratePrettier` is set, this is unnecessary |
| `lintStaged` | true, false | Only available if `lint` or `prettier` is set |
| `unitTest` | "jest", "jasmine", false | |
| `e2eTest` | "cypress", "playwright", false | |
| `packageManager` | "npm", "yarn", "pnpm" | |
| `outputDir` | String | Path strings, i.e. `project`, `./project`, `./dir/project` |


## 💬 Support
Having trouble? Please email me at danilo.vilhena@gmail.com

## 👥 Contributing

**Please do!** This project is open source, and I greatly appreciate contributions from anyone! So report bugs, suggest new features and open pull requests to improve the current code!

Here's the link for the repo 👇
https://github.com/danilovilhena/kickstart-it

## 📝 Changelog

Please check the [CHANGELOG](https://github.com/danilovilhena/kickstart-it/blob/main/CHANGELOG.md) file.

## Did this package help you?
Star this repo and share it with your friends.