import map, { swapLayer, subscribeToDataUpdates } from './lib/map'

let sourceDataCache

function initializeLayers() {
  let visibleLayers = []
  subscribeToDataUpdates(function (sourceData) {
    sourceDataCache = sourceData
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
    const updatedSource = Object.assign({}, sourceDataCache, {
      features: sourceDataCache.features.filter((feature) => {
        return !filterFeatureByGeometryType(feature, data.detail)
      }),
    })
    swapLayer(updatedSource)
  })
}

function filterFeatureByGeometryType(feature, geometryType) {
  return feature.geometry.type === geometryType
}

export default initializeLayers
