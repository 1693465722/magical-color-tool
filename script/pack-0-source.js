import { resolve } from 'path'
import { execSync } from 'child_process'
import { modifyDelete, modifyCopy } from 'dr-js/module/node/file/Modify'
console.log("------@@@@@@@@@@@------------")
import { getScriptFileListFromPathList } from 'dr-dev/module/node/file'
import { runMain, argvFlag } from 'dr-dev/module/main'
import { getTerserOption, minifyFileListWithTerser } from 'dr-dev/module/minify'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../pack-0-source-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)
const execOptionRoot = { cwd: fromRoot(), stdio: 'inherit', shell: true }
const BABEL_ENV = process.env.BABEL_ENV || ''
const isDev = BABEL_ENV.includes('dev')
runMain(async (logger) => {
  const { padLog } = logger

  padLog('reset output')
  await modifyDelete(fromOutput()).catch(() => {})
  if (!isDev) {
    padLog('[PROD] babel source file to output, or just copy for test')
    console.log(4)
    execSync('npm run build-pack-0-source', execOptionRoot)
    console.log(3)

    padLog('[PROD] minify to for better reading')
    await minifyFileListWithTerser({
      fileList: await getScriptFileListFromPathList([ '' ], fromOutput),
      option: getTerserOption({ isReadable: true }),
      rootPath: PATH_OUTPUT,
      logger
    })
  } else {
    padLog('[DEV] babel source file to output, or just copy for test')
    console.log(1)
    console.log(execSync)
    execSync('npm run build-pack-0-source-dev', execOptionRoot)
    console.log(2)
  }

  padLog('copy "package.json"')
  await modifyCopy(fromRoot('package.json'), fromOutput('package.json'))
  if(!isDev){
    await modifyCopy(fromRoot('node_modules'), fromOutput('node_modules'))
  }
  
}, 'pack-0-source')
