#!/usr/bin/env node
import fs from 'fs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { kickstart } from './core/index.js'
import { originalConfig } from './helpers/globals.js'
import { clearUndefined, formatTime, parseArgs } from './helpers/index.js'
import { logSuccess } from './helpers/logger.js'
import { promptQuestions } from './helpers/prompt.js'

const main = async () => {
  const executionStart = performance.now()
  parseArgs(process.argv.slice(2))
  console.log(`Welcome to ${chalk.bold(chalk.magenta('kickstart-it 🚀'))}, the ${chalk.underline('fastest way')} to setup your projects!`)
  console.log("Let's get started...")

  await promptQuestions()
  await kickstart()
  clearUndefined()

  const { answer } = await inquirer.prompt({
    type: 'confirm',
    prefix: `${chalk.magenta('?')}`,
    name: 'answer',
    message: 'Would you like to save your config file? (to reuse in the future)'
  })

  if (answer) fs.writeFileSync('kickstart.config.json', JSON.stringify(originalConfig, null, 2))

  const executionEnd = performance.now()
  logSuccess('------', false)
  logSuccess('🎉 Your project is ready!', false)
  logSuccess(`In just ${chalk.underline(formatTime(executionEnd - executionStart))}, you just saved hours of setup!`, false)
  logSuccess('------', false)

  // TODO: add a section with a \n before saying: here's what you should do next
}

main()
