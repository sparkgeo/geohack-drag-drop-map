import {
  subscribeToDataUpdates,
  filterSourceData,
  setSwapStrategy,
  defaultSwapStrategy,
} from './lib/map'
import { SwapStrategy } from './lib/swapStrategy'

function initializeLayers() {
  subscribeToDataUpdates(function (sourceData) {
    let visibleLayers = []
    const features =
      sourceData && sourceData.features ? sourceData.features : []
    if (features.length) {
      visibleLayers = ['Point', 'LineString', 'Polygon', 'MultiPolygon'].filter(
        (layerName) => {
          return (
            features.filter((feature) =>
              filterFeatureByGeometryType(feature, layerName),
            ).length > 0
          )
        },
      )
    }
    document.getElementById('layers-list-container').innerHTML = visibleLayers
      .map((visibleLayerName) => {
        return `
          <div
            class="visible-layer"
            id="visible-layer-${visibleLayerName}"
            draggable="true"
            ondragover="document.dispatchEvent(new CustomEvent('dragOver', {detail: event}))"
            ondragstart="document.dispatchEvent(new CustomEvent('dragStart', {detail: event}))">
            <div
              class="visible-layer-name">
              ${visibleLayerName} Layer
            </div>
            <div
              class="visible-layer-remover"
              onClick="document.dispatchEvent(new CustomEvent('removeLayer', {detail: '${visibleLayerName}'}))"
              title="Remove ${visibleLayerName} Layer">
              x
            </div>
          </div>`
      })
      .join('')
  })
  document.addEventListener('removeLayer', (data) => {
    filterSourceData((feature) => {
      return !filterFeatureByGeometryType(feature, data.detail)
    })
  })
  let draggedElement
  document.addEventListener('dragStart', (event) => {
    const dragEvent = event.detail
    dragEvent.dataTransfer.effectAllowed = 'move'
    dragEvent.dataTransfer.setData('text/plain', null) // Thanks to bqlou for their comment.
    draggedElement = dragEvent.target
  })
  document.addEventListener('dragOver', (event) => {
    const dragEvent = event.detail
    if (dragEvent.target.parentNode !== draggedElement) {
      if (isBefore(draggedElement, dragEvent.target)) {
        dragEvent.target.parentNode.parentNode.insertBefore(
          draggedElement,
          dragEvent.target.parentNode,
        )
      } else {
        dragEvent.target.parentNode.parentNode.insertBefore(
          draggedElement,
          dragEvent.target.parentNode.nextSibling,
        )
      }
    }
  })
  document.addEventListener('dragover', function (e) {
    e.preventDefault()
  })
  const dndReplaceCheckbox = document.getElementById('dnd-replace')
  dndReplaceCheckbox.checked = defaultSwapStrategy === SwapStrategy.REPLACE
  dndReplaceCheckbox.onchange = function () {
    setSwapStrategy(this.checked ? SwapStrategy.REPLACE : SwapStrategy.ADD)
  }
}

function filterFeatureByGeometryType(feature, geometryType) {
  return feature.geometry.type === geometryType
}

function isBefore(el1, el2) {
  if (el2.parentNode.parentNode === el1.parentNode) {
    for (
      let cur = el1.previousSibling;
      cur && cur.nodeType !== 9;
      cur = cur.previousSibling
    ) {
      if (cur === el2.parentNode) {
        return true
      }
    }
  }
  return false
}

export default initializeLayers
