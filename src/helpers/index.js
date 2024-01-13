import fs from 'fs'
import { promisify } from 'util'
import { exec as originalExec, spawn as originalSpawn } from 'child_process'
import { logError } from './logger.js'
import { acceptedArgs, args } from './globals.js'

const promiseExec = promisify(originalExec)

const cloneFile = async (source, destination) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source)
    const writeStream = fs.createWriteStream(destination)

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('finish', resolve)

    readStream.pipe(writeStream)
  })
}

const exec = async ({ command, errorMessage }) => {
  try {
    return await promiseExec(command)
  } catch (error) {
    logError(errorMessage)
  }
}

const spawn = async ({ command, errorMessage }) => {
  const innerSpawn = () => {
    return new Promise((resolve, reject) => {
      const child = originalSpawn(command, { stdio: 'inherit', shell: true })
      child.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(code))
      })
      child.on('error', () => reject(new Error()))
    })
  }

  try {
    await innerSpawn({ command, errorMessage })
  } catch (error) {
    logError(errorMessage)
  }
}

const clearUndefined = () => {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

  if (packageJson.devDependencies?.undefined) delete packageJson.devDependencies.undefined
  if (packageJson.dependencies?.undefined) delete packageJson.dependencies.undefined

  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
}

const parseArgs = (originalArgs) => {
  originalArgs.forEach((arg) => {
    const [key, value] = arg.split('=')
    const sanitizedKey = key.replace(/-/g, '')

    if (!acceptedArgs.includes(sanitizedKey)) {
      logError(`Invalid argument: ${key}`)
    }

    args[sanitizedKey] = value
  })
}

const formatTime = (time) => {
  const seconds = Math.round(time / 1000)
  const minutes = Math.round(seconds / 60)

  if (minutes > 0) return `${minutes} and ${seconds % 60} seconds`
  return `${seconds} seconds`
}

export {
  clearUndefined,
  cloneFile,
  exec,
  formatTime,
  spawn,
  parseArgs
}
