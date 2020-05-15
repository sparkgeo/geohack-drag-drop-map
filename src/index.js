import initializeDragDropEvents from './lib/initializeDragDropEvents'
import initializeLayers from './layers'
import initializeShareLoader from './lib/shareLoader'

document.querySelector('#generate-link').addEventListener('click', function () {
  console.log('Click detected')

  // TODO generate string

  // TODO consolidate geojson into file

  // TODO upload geojson file into s3

  // TODO update sharing link with link url
})

initializeDragDropEvents()
initializeLayers()
initializeShareLoader()
