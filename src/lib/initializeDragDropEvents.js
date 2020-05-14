import NProgress from 'nprogress'

import determineDataType from './determineDataType'

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

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  hidePanel(e)

  NProgress.start()

  var files = e.dataTransfer.files

  if (files.length) {
    NProgress.set(0.2)
    try {
      determineDataType(files).then((type) => {
        // TODO: Determine file content
        alert(`The file type is ${type}`)
        NProgress.done()
      })
    } catch (e) {
      NProgress.done()
      alert(e.message)
    }
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
