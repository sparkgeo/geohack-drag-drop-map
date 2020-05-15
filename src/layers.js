import {
  subscribeToDataUpdates,
  filterSourceData,
  setSwapStrategy,
  defaultSwapStrategy,
  orderLayersBy,
  defaultOrderedLayers,
} from './lib/map'
import { SwapStrategy } from './lib/swapStrategy'

let orderedLayers
function initializeLayers() {
  subscribeToDataUpdates(function (sourceData) {
    let visibleLayers = []
    orderedLayers = !!orderedLayers ? orderedLayers : defaultOrderedLayers
    const features =
      sourceData && sourceData.features ? sourceData.features : []
    if (features.length) {
      visibleLayers = orderedLayers.filter((layerName) => {
        return (
          features.filter((feature) =>
            filterFeatureByGeometryType(feature, layerName),
          ).length > 0
        )
      })
    }
    document.getElementById('layers-list-container').innerHTML = visibleLayers
      .map((visibleLayerName) => {
        return `
          <div
            class="visible-layer"
            id="visible-layer-${visibleLayerName}"
            draggable="true"
            ondragover="document.dispatchEvent(new CustomEvent('dragOver', {detail: event}))"
            ondragstart="document.dispatchEvent(new CustomEvent('dragStart', {detail: event}))"
            ondragend="document.dispatchEvent(new CustomEvent('dragEnd'))">
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
  // drag-drop adapted from https://stackoverflow.com/a/28962290/519575
  document.addEventListener('dragStart', (event) => {
    const dragEvent = event.detail
    dragEvent.dataTransfer.effectAllowed = 'move'
    dragEvent.dataTransfer.setData('text/plain', null)
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
  document.addEventListener('dragEnd', () => {
    const orderedLayerElements = document.querySelectorAll(
      '#layers-list-container .visible-layer',
    )
    let ordered = []
    for (let i = 0; i < orderedLayerElements.length; i++) {
      ordered.push(
        orderedLayerElements.item(i).id.replace(/^visible\-layer\-/, ''),
      )
    }
    orderedLayers = ordered.filter((value, index, self) => {
      // handle edge case where drag-drop can create two instances of a layer
      return self.indexOf(value) === index
    })
    defaultOrderedLayers.forEach((defaultLayer) => {
      if (orderedLayers.indexOf(defaultLayer) === -1) {
        orderedLayers.push(defaultLayer)
      }
    })
    orderLayersBy(orderedLayers)
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
  if (geometryType === 'Polygon') {
    return ['Polygon', 'MultiPolygon'].indexOf(feature.geometry.type) > -1
  }
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
