import map, { swapLayer } from './lib/map'

let sourceData

function initializeLayers() {
  map.on('sourcedata', function (event) {
    if (event.sourceId === 'geojson-layer') {
      let visibleLayers = []
      sourceData = event.source.data
      const features =
        sourceData && sourceData.features ? sourceData.features : []
      if (features.length) {
        visibleLayers = [
          'Point',
          'LineString',
          'Polygon',
          'MultiPolygon',
        ].filter((layerName) => {
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
            id="visible-layer-${visibleLayerName}">
            ${visibleLayerName} Layer
            <span
              class="visible-layer-remover"
              onClick="document.dispatchEvent(new CustomEvent('removeLayer', {detail: '${visibleLayerName}'}))">x</span>
          </div>`
        })
        .join('')
    }
  })
  document.addEventListener('removeLayer', (data) => {
    const updatedSource = Object.assign({}, sourceData, {
      features: sourceData.features.filter((feature) => {
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
