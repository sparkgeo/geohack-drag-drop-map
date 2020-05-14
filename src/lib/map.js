mapboxgl.accessToken = process.env.MAPBOX_TOKEN

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [0, 0],
  zoom: 2,
})

export default map
