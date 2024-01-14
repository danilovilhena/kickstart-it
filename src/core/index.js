import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import { cloneFile, exec, spawn } from '../helpers/index.js'
import { args, config } from '../helpers/globals.js'
import { logError, logSuccess, logWarning, startLoading, stopLoading } from '../helpers/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const installCommand = ({ name, isGlobal, isDev, packageManager }) => {
  return {
    npm: `npm install ${isGlobal ? '-g' : ''} ${isDev ? '--save-dev' : ''} ${name}`,
    yarn: `yarn ${isGlobal ? 'global ' : ''}add ${name} ${isDev ? '--dev' : ''}`,
    pnpm: `pnpm add ${isGlobal ? '-g' : ''} ${isDev ? '--save-dev' : ''} ${name}`
  }[packageManager]
}

const hasOutputDirConfig = () => {
  if (args.outputDir && typeof args.outputDir === 'string') return args.outputDir !== '.'
  if (config.outputDir && typeof config.outputDir === 'string') return config.outputDir !== '.'
  return false
}

const checkForOutputDir = () => {
  if (!hasOutputDirConfig()) return

  const outputDir = args.outputDir || config.outputDir
  const hasOutputDir = fs.existsSync(outputDir)

  if (!hasOutputDir) {
    logWarning(`Output directory "${outputDir}" does not exist. Creating it now!`)
    try { fs.mkdirSync(outputDir) } catch (error) {
      logError(`Could not create output directory ${process.cwd()}`)
    }
    logSuccess(`Created output directory ${process.cwd()}!`)
  }

  try { process.chdir(outputDir) } catch (error) {
    logError('Could not enter output directory')
  }
}

const checkForPackageJson = async () => {
  const packageManager = config.packageManager
  const hasPackageJson = fs.existsSync('./package.json')
  if (hasPackageJson) return

  logWarning(`No package.json found. Creating one with ${packageManager}!`)

  const platform = os.platform()
  let initCommand = `${packageManager} init`
  if (packageManager !== 'pnpm') initCommand += ' -y'

  await exec({
    command: `${platform === 'win32' ? 'where' : 'which'} ${packageManager}`,
    errorMessage: `Could not find ${packageManager}. Please install it and try again.`
  })

  await exec({
    command: initCommand,
    errorMessage: 'Could not create package.json'
  })

  logSuccess('Created package.json')
}

const checkForGit = async () => {
  const hasGit = fs.existsSync('./.git')
  if (hasGit) return

  const platform = os.platform()

  logWarning('No git repository found. Creating one now!')

  await exec({
    command: `${platform === 'win32' ? 'where' : 'which'} git`,
    errorMessage: 'Could not find git. Please install it and try again.'
  })

  await exec({
    command: 'git init',
    errorMessage: 'Could not create .git'
  })

  logSuccess('Created .git')
}

const createChangelog = async () => {
  const hasChangelog = fs.existsSync('./CHANGELOG.md')
  if (hasChangelog) return

  try {
    await cloneFile(path.resolve(__dirname, `../defaults/changelog/${config.changelog}.md`), './CHANGELOG.md')
  } catch (error) {
    logError('Could not create CHANGELOG.md')
  }

  logSuccess('Created CHANGELOG.md')
}

const installCommitizen = async () => {
  startLoading('Installing Husky')
  const packageManager = config.packageManager

  await exec({
    command: installCommand({ name: 'commitizen', isGlobal: true, packageManager }),
    errorMessage: 'Could not install commitizen'
  })

  const initCommand = {
    npm: 'commitizen init cz-conventional-changelog --save-dev --save-exact',
    yarn: 'commitizen init cz-conventional-changelog --yarn --dev --exact',
    pnpm: 'commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact'
  }

  await exec({
    command: initCommand[packageManager],
    errorMessage: 'Could not init commitizen'
  })

  stopLoading()
  logSuccess('Installed commitizen')
}

const createReadme = async () => {
  const hasReadme = fs.existsSync('./README.md')
  if (hasReadme) return

  try {
    await cloneFile(path.resolve(__dirname, '../defaults/readme/example.md'), './README.md')
  } catch (error) {
    logError('Could not create README.md')
  }

  logSuccess('Created README.md')
}

const createGitIgnore = async () => {
  const hasGitIgnore = fs.existsSync('./.gitignore')
  if (hasGitIgnore) return

  try {
    await cloneFile(path.resolve(__dirname, '../defaults/gitignore/example.md'), './.gitignore')
  } catch (error) {
    logError('Could not create .gitignore')
  }

  logSuccess('Created .gitignore')
}

const installHusky = async () => {
  startLoading('Installing Husky')

  const initCommand = {
    npm: 'npx husky-init',
    yarn: 'yarn dlx husky-init --yarn2',
    pnpm: 'pnpm dlx husky-init'
  }

  await exec({
    command: initCommand[config.packageManager],
    errorMessage: 'Could not install Husky'
  })

  stopLoading()
  logSuccess('Installed Husky')
}

const installTypeScript = async () => {
  startLoading('Configuring TypeScript')

  const hasTsConfig = fs.existsSync('./tsconfig.json')
  if (hasTsConfig) return

  await exec({
    command: installCommand({ name: 'typescript', isDev: true, packageManager: config.packageManager }),
    errorMessage: 'Could not install TypeScript'
  })

  const tsConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../defaults/tsconfig/tsconfig.json'), 'utf-8'))
  if (config.type === 'esm') {
    tsConfig.compilerOptions.module = 'esnext'
    tsConfig.compilerOptions.moduleResolution = 'node'
  }
  fs.writeFileSync('./tsconfig.json', JSON.stringify(tsConfig, null, 2))

  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const previousMain = packageJson.main
  packageJson.main = `dist/${previousMain}`
  packageJson.scripts.build = 'tsc'
  packageJson.scripts.start = `tsc && node dist/${previousMain}`
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

  stopLoading()
  logSuccess('Configured TypeScript')
}

const configureNode = () => {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  packageJson.type = config.type === 'cjs' ? 'commonjs' : 'module'
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
}

const installCss = async () => {
  startLoading(`Installing ${config.css}`)

  if (config.css === 'sass') {
    await exec({
      command: installCommand({ name: 'sass', isGlobal: true, packageManager: config.packageManager }),
      errorMessage: 'Could not install Sass globally'
    })

    await exec({
      command: installCommand({ name: 'sass', isDev: true, packageManager: config.packageManager }),
      errorMessage: 'Could not install Sass'
    })

    stopLoading()
    logSuccess('Installed Sass')
  } else if (config.css === 'tailwind') {
    await exec({
      command: installCommand({ name: 'tailwindcss', isDev: true, packageManager: config.packageManager }),
      errorMessage: 'Could not install Sass globally'
    })

    await exec({
      command: `npx init tailwindcss ${config.language === 'ts' && '--ts'} ${config.type === 'esm' && '--esm'}`
    })

    stopLoading()
    logSuccess('Installed Tailwind')
  } else if (config.css === 'mui') {
    await exec({
      command: installCommand({ name: '@mui/material @emotion/react @emotion/styled', packageManager: config.packageManager }),
      errorMessage: 'Could not install Material UI'
    })

    stopLoading()
    logSuccess('Installed Material UI')
  }
}

const installLint = async () => {
  startLoading(`Installing ${config.lint}`)

  if (config.lint === 'eslint') {
    await exec({
      command: installCommand({ name: 'eslint', isDev: true, packageManager: config.packageManager }),
      errorMessage: 'Could not install ESLint'
    })

    fs.writeFileSync('./.eslintrc.json', JSON.stringify({
      extends: [
        config.eslint.configuration,
        config.eslint.integratePrettier && 'prettier'
      ],
      env: {
        [config.env]: true
      }
    }, null, 2))

    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    packageJson.scripts.lint = 'eslint . --ext .js,.jsx,.ts,.tsx'
    packageJson.scripts['lint:fix'] = 'eslint . --ext .js,.jsx,.ts,.tsx --fix'
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

    stopLoading()
    logSuccess('Installed ESLint')
  } else if (config.lint === 'standardjs') {
    await exec({
      command: installCommand({ name: 'standard', isDev: true, packageManager: config.packageManager }),
      errorMessage: 'Could not install StandardJS'
    })

    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    packageJson.scripts.lint = 'standard'
    packageJson.scripts['lint:fix'] = 'standard --fix'
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

    stopLoading()
    logSuccess('Installed StandardJS')
  }

  if (config.husky && !config.lintStaged) {
    await exec({
      command: 'npx husky add .husky/pre-commit "npm run lint"',
      errorMessage: 'Could not add lint to pre-commit hook'
    })
  }
}

const installPrettier = async () => {
  startLoading('Installing Prettier')

  await exec({
    command: installCommand({ name: 'prettier', isDev: true, packageManager: config.packageManager }),
    errorMessage: 'Could not install Prettier'
  })

  try {
    await cloneFile(path.resolve(__dirname, '../defaults/format/.prettierrc'), './.prettierrc')
    await cloneFile(path.resolve(__dirname, '../defaults/format/.prettierignore'), './.prettierignore')
  } catch (error) {
    logError('Could not create prettier config files')
  }

  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  packageJson.scripts.format = 'prettier --write . "**/*.{cjs,mjs,js,jsx,ts,tsx,json,md}"'
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

  stopLoading()
  logSuccess('Installed Prettier')
}

const installLintStaged = async () => {
  startLoading('Installing lint-staged')

  await exec({
    command: installCommand({ name: 'lint-staged', isDev: true, packageManager: config.packageManager }),
    errorMessage: 'Could not install lint-staged'
  })

  let command
  if (config.format === 'prettier') command = 'prettier --write'
  else if (config.lint === 'eslint') command = 'eslint . --ext .js,.jsx,.ts,.tsx --fix'
  else if (config.lint === 'standardjs') command = 'standard --fix'

  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  packageJson['lint-staged'] = {
    '*.{cjs,mjs,js,jsx,ts,tsx,json,md}': [command]
  }
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

  if (config.husky) {
    await exec({
      command: 'npx husky add .husky/pre-commit "npx lint-staged"',
      errorMessage: 'Could not add lint-staged to pre-commit hook'
    })
  }

  stopLoading()
  logSuccess('Installed lint-staged')
}

const installUnitTest = async () => {
  if (config.unitTest === 'jest') {
    const commands = {
      npm: 'npm init jest@latest',
      pnpm: 'pnpm create jest@latest',
      yarn: 'yarn create jest@latest'
    }
    await spawn({ command: commands[config.packageManager], errorMessage: 'Could not install Jest' })
  } else if (config.unitTest === 'jasmine') {
    startLoading('Installing Jasmine')
    await exec({
      command: installCommand({
        name: config.env === 'node' ? 'jasmine' : 'jasmine-browser-runner jasmine-core',
        isDev: true,
        packageManager: config.packageManager
      }),
      errorMessage: 'Could not install Jasmine'
    })

    await exec({
      command: config.env === 'node' ? 'npx jasmine init' : 'npx jasmine-browser-runner init',
      errorMessage: 'Could not init Jasmine'
    })

    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    packageJson.scripts.test = config.env === 'node' ? 'jasmine' : 'jasmine-browser-runner runSpecs'
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
    stopLoading()
  }

  logSuccess(`Installed ${config.unitTest}`)
}

const installE2eTest = async () => {
  if (config.e2eTest === 'cypress') {
    startLoading('Installing cypress')
    await exec({
      command: installCommand({ name: 'cypress', isDev: true, packageManager: config.packageManager }),
      errorMessage: 'Could not install Cypress'
    })

    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    packageJson.scripts['cypress:open'] = 'cypress open'
    packageJson.scripts.test = 'cypress run'
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
    stopLoading()
  } else if (config.e2eTest === 'playwright') {
    const commands = {
      npm: 'npm init playwright@latest',
      pnpm: 'pnpm create playwright@latest',
      yarn: 'yarn create playwright@latest'
    }
    await spawn({ command: commands[config.packageManager], errorMessage: 'Could not install Playwright' })

    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    packageJson.scripts.test = 'npx playwright test'
    packageJson.scripts.codegen = 'npx playwright codegen'
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
  }

  logSuccess(`Installed ${config.e2eTest}`)
}

const kickstart = async () => {
  checkForOutputDir()
  await checkForPackageJson()
  await checkForGit()
  if (config.changelog) await createChangelog()
  if (config.commitizen) await installCommitizen()
  if (config.readme) await createReadme()
  if (config.gitignore) await createGitIgnore()
  if (config.husky) await installHusky()
  if (config.language === 'ts') await installTypeScript()
  if (config.type) configureNode()
  if (config.css) await installCss()
  if (config.lint) await installLint()
  if (config?.eslint?.integratePrettier || config.format) await installPrettier()
  if (config.lintStaged && (config.format === 'prettier' ||
    ['eslint', 'standardjs'].includes(config.lint))) await installLintStaged()
  if (config.unitTest) await installUnitTest()
  if (config.e2eTest) await installE2eTest()
}

export {
  kickstart
}
