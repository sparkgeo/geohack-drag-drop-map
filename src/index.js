import NProgress from 'nprogress'

NProgress.start()

setTimeout(function () {
  NProgress.set(0.4)
}, 1000)

setTimeout(function () {
  NProgress.set(0.7)
}, 2000)

setTimeout(function () {
  NProgress.done()
}, 3000)

function showPanel(e) {
  e.stopPropagation()
  e.preventDefault()
  document.querySelector('.drag-drop-container').style.display = 'block'
  return false
}

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  hidePanel(e)

  var files = e.dataTransfer.files
  if (files.length) {
    // process file(s) being dropped
    // grab the file data from each file
    for (var i = 0, file; (file = files[i]); i++) {
      var reader = new FileReader()
      reader.onload = function () {
        // loadGeoJsonString(e.target.result)
      }
      reader.onerror = function (e) {
        console.error('reading failed', e)
      }
      reader.readAsText(file)
    }
  } else {
    // process non-file (e.g. text or html) content being dropped
    // grab the plain text version of the data
    var plainText = e.dataTransfer.getData('text/plain')
    if (plainText) {
      // loadGeoJsonString(plainText)
    }
  }

  // prevent drag event from bubbling further
  return false
}

function hidePanel() {
  document.querySelector('.drag-drop-container').style.display = 'none'
}

function initializeDragDropEvent() {
  const mapContainer = document.getElementById('map')
  const dropContainer = document.querySelector('.drag-drop-container')

  // map-specific events
  mapContainer.addEventListener('dragenter', showPanel, false)

  // overlay specific events (since it only appears once drag starts)
  dropContainer.addEventListener('dragover', showPanel, false)
  dropContainer.addEventListener('drop', handleDrop, false)
  dropContainer.addEventListener('dragleave', hidePanel, false)
}

initializeDragDropEvent()
