import NProgress from 'nprogress'

import CSV from './transformer/csv'
import getStringFromFile from './getStringFromFile'
import determineDataType from './determineDataType'
import map, { swapLayer } from './map'

function showPanel(e) {
  e.stopPropagation()
  e.preventDefault()
  document.querySelector('.drag-drop-container').style.display = 'flex'
  document.querySelector('#map').style.display = 'none'

  return false
}

function hidePanel() {
  document.querySelector('.drag-drop-container').style.display = 'none'
  document.querySelector('#map').style.display = 'flex'
}

async function handleCSV(data) {
  const parsedData = await getStringFromFile(data)
  const geojson = await new CSV(parsedData).geojson()
  swapLayer(geojson)
  NProgress.done()
}

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  hidePanel(e)

  NProgress.start()

  var files = e.dataTransfer.files

  if (files.length === 1) {
    NProgress.set(0.2)
    determineDataType(files[0])
      .then((type) => {
        NProgress.set(0.4)
        alert(`The file type is ${type}`)
        // TODO: ADD ALL THE OTHER TRANSFORMERS HERE
        switch (type) {
          case 'csv':
            return handleCSV(files[0])
        }
      })
      .then((json) => {
        NProgress.done()
      })
      .catch((e) => {
        NProgress.done()
        alert(e.message)
      })
  } else {
    alert('We only accept one file at a time')
  }

  // prevent drag event from bubbling further
  return false
}

function initializeDragDropEvents() {
  const mapContainer = document.getElementById('map')
  const dropContainer = document.querySelector('.drag-drop-container')

  // map-specific events
  mapContainer.addEventListener('dragenter', showPanel, false)

  // overlay specific events (since it only appears once drag starts)
  dropContainer.addEventListener('dragover', showPanel, false)
  dropContainer.addEventListener('drop', handleDrop, false)
  dropContainer.addEventListener('dragleave', hidePanel, false)
}

export default initializeDragDropEvents
