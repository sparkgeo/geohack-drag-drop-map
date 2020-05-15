import { SwapStrategy } from './swapStrategy'

mapboxgl.accessToken = process.env.MAPBOX_TOKEN
const layerName = 'geojson-layer'
export const defaultOrderedLayers = ['Point', 'LineString', 'Polygon']
export const defaultSwapStrategy = SwapStrategy.REPLACE

let sourceDataCache
let dataSwapStrategy = defaultSwapStrategy

const zoomToFeatures = (mapData) => {
  const bounds = new mapboxgl.LngLatBounds()
  mapData.features.forEach(({ geometry: { coordinates } }) => {
    processPoints(coordinates, bounds.extend, bounds)
  })
  map.fitBounds(bounds, { padding: 35 })
}

const processPoints = (geometry, callback, thisArg) => {
  if (!Array.isArray(geometry[0])) {
    callback.call(thisArg, geometry)
  } else {
    geometry.forEach(function (g) {
      processPoints(g, callback, thisArg)
    })
  }
}

export function orderLayersBy(requestedOrder) {
  defaultOrderedLayers.forEach((layerType) => {
    const layerId = getLayerId(layerType)
    if (!!map.getLayer(layerId)) {
      map.removeLayer(layerId)
    }
  })
  requestedOrder
    .slice(0)
    .reverse()
    .forEach((layerType) => {
      addMapLayer(layerType)
    })
}

const getLayerId = (type) => {
  return `sparkgeo-${type}`
}

const addMapLayer = (type) => {
  switch (type) {
    case 'Point':
      map.addLayer({
        id: getLayerId(type),
        type: 'circle',
        source: layerName,
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
        },
        filter: ['==', '$type', 'Point'],
      })
      break
    case 'Polygon':
      map.addLayer({
        id: getLayerId(type),
        type: 'fill',
        source: layerName,
        paint: {
          'fill-color': '#140beb',
          'fill-opacity': 0.4,
        },
        filter: ['==', '$type', 'Polygon'],
      })
      break
    case 'LineString':
      map.addLayer({
        id: getLayerId(type),
        type: 'line',
        source: layerName,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#fdd53a',
          'line-width': 8,
        },
        filter: ['==', '$type', 'LineString'],
      })
      break
  }
}

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-10, 30],
  zoom: 2,
})

map.on('load', function () {
  map.addSource(layerName, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  })
  defaultOrderedLayers
    .slice(0)
    .reverse()
    .forEach((layerType) => {
      addMapLayer(layerType)
    })
})

export function swapLayer(data, requestedSwapStrategy) {
  if (map.getSource(layerName) !== undefined) {
    let newSourceData
    const swapStrategy =
      requestedSwapStrategy === undefined
        ? dataSwapStrategy
        : requestedSwapStrategy
    switch (swapStrategy) {
      case SwapStrategy.ADD:
        if (sourceDataCache) {
          newSourceData = Object.assign({}, sourceDataCache, {
            fileName: `multiple`,
            features: [...sourceDataCache.features, ...data.features],
          })
          break
        }
      // fall through if no sourceDataCache as it is effectively a REPLACE
      case SwapStrategy.REPLACE:
        newSourceData = data
        break
    }
    map.getSource(layerName).setData(newSourceData)
    if (newSourceData.features.length) {
      zoomToFeatures(newSourceData)
    }
    sourceDataCache = Object.freeze(Object.assign({}, newSourceData)) // store an immutable copy of data for future reference
  }
}

export function subscribeToDataUpdates(callback) {
  map.on('sourcedata', function (event) {
    if (event.sourceId === layerName) {
      callback(event.source.data)
    }
  })
}

export function filterSourceData(filter) {
  const updatedSource = Object.assign({}, sourceDataCache, {
    features: sourceDataCache.features.filter((feature) => {
      return filter(feature)
    }),
  })
  swapLayer(updatedSource, SwapStrategy.REPLACE)
}

export function setSwapStrategy(newSwapStrategy) {
  dataSwapStrategy = newSwapStrategy
}

export function exportMapData() {
  return sourceDataCache
}

export default map
