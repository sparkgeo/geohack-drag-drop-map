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
            id="visible-layer-${visibleLayerName}">
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
  const dndReplaceCheckbox = document.getElementById('dnd-replace')
  dndReplaceCheckbox.checked = defaultSwapStrategy === SwapStrategy.REPLACE
  dndReplaceCheckbox.onchange = function () {
    setSwapStrategy(this.checked ? SwapStrategy.REPLACE : SwapStrategy.ADD)
  }
}

function filterFeatureByGeometryType(feature, geometryType) {
  return feature.geometry.type === geometryType
}

export default initializeLayers
