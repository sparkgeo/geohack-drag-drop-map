import initializeDragDropEvents from './lib/initializeDragDropEvents'
import initializeLayers from './layers'
import generateRandomString from './lib/generateRandomString'

document.querySelector('#generate-link').addEventListener('click', function () {
  console.log('Click detected')

  const fileName = `${generateRandomString()}.json`

  console.log('file name ', fileName)

  // TODO consolidate geojson into file

  // TODO upload geojson file into s3

  // TODO update sharing link with link url
})

initializeDragDropEvents()
initializeLayers()
