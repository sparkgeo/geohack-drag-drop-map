/**
 * Determines which file type is being used
 * @function
 * @param {Array, <object>} files - A series of files
 * @returns {String} - The type of the file
 */

export const fileTypes = {
  SHP: 'shapfile',
  GPK: 'geopackage',
  GEOJSON: 'geojson',
  TOPOJSON: 'topojson',
  CSV: 'csv',
  WKT: 'wkt',
}

function getStringFromFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = function () {
      resolve(fr.result)
    }
    fr.readAsDataURL(file)
  })
}

const verifyJsonFormat = (file) => {
  return getStringFromFile(file)
    .then((result) =>
      JSON.parse(result).type === 'Topology'
        ? fileTypes.TOPOJSON
        : fileTypes.GEOJSON,
    )
    .catch(() => {
      alert('Unknown JSON format')
      return ''
    })
}

export async function determineDataType(files) {
  if (files.length === 1) {
    const extension = files[0].name.split('.')[1]
    switch (extension) {
      case 'geojson':
        return fileTypes.GEOJSON
      case 'json':
        return await verifyJsonFormat(files[0])
      case 'topojson':
        return fileTypes.TOPOJSON
      case 'csv':
        return fileTypes.CSV
      case 'shp':
        alert('We can only accept zipped shapefiles.')
        return ''
      case 'zip':
        alert('TODO: determine if zipped shapefile')
        return fileTypes.SHP
      default:
        alert('TODO: Handle unknown file type')
        return ''
    }

    // It is possible that this might be a bundle of files, such as a shapefile.
  } else {
    // This is where you have just one or two or more files to go through.
  }
}

export default determineDataType
