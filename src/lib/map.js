mapboxgl.accessToken = process.env.MAPBOX_TOKEN
const layerName = 'geojson-layer'

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-20.7453699, 53.9128645],
  zoom: 1,
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
}

export default map
