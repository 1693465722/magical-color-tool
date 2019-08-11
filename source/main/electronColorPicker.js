const { getColorHexRGB } = (() => {
    try { return require('electron-color-picker') } catch (error) {}
    try { return require('../electron-color-picker') } catch (error) {}
    try { return require('../../electron-color-picker') } catch (error) {}
  })()

export { getColorHexRGB }
const { Datastore } = (() => {
    try { return require('nedb') } catch (error) {}
    try { return require('../nedb') } catch (error) {}
    try { return require('../../nedb') } catch (error) {}
  })()

export { Datastore }
