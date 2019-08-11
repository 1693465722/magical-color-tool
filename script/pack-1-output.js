import { resolve } from 'path'

import ElectronPackager from 'electron-packager'
import debug from 'debug'

import { modify } from 'dr-js/module/node/file/Modify'

import { runMain } from 'dr-dev/module/main'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../pack-1-output-gitignore')
const PATH_LOGO = resolve(__dirname, '../source/static/img/logo.ico')
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
console.log(PATH_LOGO)
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)

const getElectronVersion = () => {
  const { version: electronVersion } = require(fromRoot('node_modules/electron/package.json'))
  return electronVersion
}

const APP_NAME = 'Magical Color Tool'

runMain(async (logger) => {
  const { padLog, log } = logger

  padLog('reset output')
  await modify.delete(fromOutput()).catch(() => {})

  padLog('build with "electron-packager" (may auto download electron)')
  // debug('electron-packager').enabled = true // debug.enable('*')
  console.log( fromRoot('pack-0-source-gitignore/'))
  const electronPackagerOutputList = await ElectronPackager({
    electronVersion: getElectronVersion(),
    platform: process.platform,
    arch: process.arch,
    asar: true, // set to false for unpacked code source
    dir: fromRoot('pack-0-source-gitignore/'),
    out: fromOutput(),
    name: APP_NAME,
    icon: PATH_LOGO,
    appVersion: '0.0.0',
    overwrite:true,
    appCopyright: `Copyright © ${new Date().getFullYear()} MockingBot`,
    // darwin
    appBundleId: 'com.Q.Magical Color Tool',
    appCategoryType: 'public.app-category.developer-tools',
    // win32
    win32metadata: {
      ProductName: 'Magical Color Tool',
      FileDescription: 'Magical Color Tool',
      CompanyName: 'Q'
    }
  })
  log('electronPackagerOutputList:', electronPackagerOutputList)

  const [ electronPackagerOutput ] = electronPackagerOutputList // only one output since this is single arch packing
  const PATH_ELECTRON_COLOR_PICKER = fromRoot(electronPackagerOutput, process.platform !== 'darwin'
    ? 'resources/electron-color-picker'
    : `${APP_NAME}.app/Contents/Resources/electron-color-picker`
  )
  const PATH_ELECTRON_nedb = fromRoot(electronPackagerOutput, process.platform !== 'darwin'
    ? 'resources/nedb'
    : `${APP_NAME}.app/Contents/Resources/nedb`
  )

  padLog('copy "electron-color-picker" to output')
  await modify.copy(fromRoot('node_modules/electron-color-picker/'), PATH_ELECTRON_COLOR_PICKER)
  await modify.copy(fromRoot('node_modules/nedb/'), PATH_ELECTRON_nedb)
  // await modify.copy(fromRoot('node_modules/electron-color-picker/'), PATH_ELECTRON_COLOR_PICKER)
  log('copied to:', PATH_ELECTRON_COLOR_PICKER)

  padLog('trim extra platform from "electron-color-picker" (OPTIONAL)') // Optional, to make output package smaller
  process.platform !== 'win32' && await modify.delete(fromOutput(PATH_ELECTRON_COLOR_PICKER, 'library/win32/'))
  process.platform !== 'linux' && await modify.delete(fromOutput(PATH_ELECTRON_COLOR_PICKER, 'library/linux/'))
  process.platform !== 'darwin' && await modify.delete(fromOutput(PATH_ELECTRON_COLOR_PICKER, 'library/darwin/'))
}, 'pack-1-output')
