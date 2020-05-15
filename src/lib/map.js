mapboxgl.accessToken = process.env.MAPBOX_TOKEN
const layerName = 'geojson-layer'

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

  map.addLayer({
    id: 'sparkgeo-polygon',
    type: 'fill',
    source: layerName,
    paint: {
      'fill-color': '#140beb',
      'fill-opacity': 0.4,
    },
    filter: ['==', '$type', 'Polygon'],
  })

  map.addLayer({
    id: 'sparkgeo-point',
    type: 'circle',
    source: layerName,
    paint: {
      'circle-radius': 6,
      'circle-color': '#B42222',
    },
    filter: ['==', '$type', 'Point'],
  })

  map.addLayer({
    id: 'sparkgeo-line',
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
})

export function swapLayer(data) {
  if (map.getSource(layerName) !== undefined) {
    map.getSource(layerName).setData(data)
  }
  zoomToFeatures(data)
}

export function subscribeToDataUpdates(callback) {
  map.on('sourcedata', function (event) {
    if (event.sourceId === layerName) {
      callback(event.source.data)
    }
  })
}

export default map
