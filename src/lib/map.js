const token = process.env.MAPBOX_TOKEN
mapboxgl.accessToken = token

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [0, 0],
  zoom: 2,
})

let layerAdded = false

export function swapLayer(data) {
  const layerName = 'geojson-layer'

  if (layerAdded) {
    map.removeLayer(layerName)
    map.removeSource(layerName)
  }
  layerAdded = true

  map.addSource(layerName, {
    type: 'geojson',
    data,
  })

  map.addLayer({
    id: layerName,
    type: 'fill',
    source: layerName,
    layout: {},
    paint: {
      'fill-color': '#088',
      'fill-opacity': 0.8,
    },
  })
}

export default map
