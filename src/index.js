import NProgress from 'nprogress'

import initializeDragDropEvents from './lib/initializeDragDropEvents'

NProgress.start()

setTimeout(function () {
  NProgress.set(0.4)
}, 1000)

setTimeout(function () {
  NProgress.set(0.7)
}, 2000)

setTimeout(function () {
  NProgress.done()
}, 3000)

initializeDragDropEvents()
mapboxgl.accessToken = process.env.MAPBOX_TOKEN

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [0, 0],
  zoom: 2,
})
