import fileTypes from './fileTypes'

function getStringFromFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = function (e) {
      resolve(e.target.result)
    }
    fr.readAsText(file)
  })
}

function verifyJsonFormat(file) {
  return getStringFromFile(file)
    .then((result) => {
      return JSON.parse(result).type === 'Topology'
        ? fileTypes.TOPOJSON
        : fileTypes.GEOJSON
    })
    .catch(() => {
      alert('Unknown JSON format')
      return ''
    })
}

/**
 * Determines which file type is being used
 * @function
 * @param {Array, <object>} files - A series of files
 * @returns {String} - The type of the file
 */

export async function determineDataType(files) {
  if (files.length === 1) {
    const extension = files[0].name.split('.')[1]
    switch (extension) {
      case 'geojson':
        return fileTypes.GEOJSON
      case 'json':
        return verifyJsonFormat(files[0])
      case 'topojson':
        return fileTypes.TOPOJSON
      case 'csv':
        return fileTypes.CSV
      case 'zip':
        return fileTypes.SHP
      case 'shp':
        throw new Error('This demo only accepts zipped shapefiles')
      default:
        throw new Error('Unknown file format')
    }
  } else {
    throw new Error('This demo can only accept one file at a time')
  }
}

export default determineDataType
