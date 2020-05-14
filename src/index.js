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
