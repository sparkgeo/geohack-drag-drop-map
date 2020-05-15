import axios from 'axios'
import NProgress from 'nprogress'
import map, { swapLayer } from './map'

const TOKEN_QUERY_PARAM_NAME = 'share_token'
const SHARE_ROOT =
  'https://s3.amazonaws.com/cdn.brianbancroft.io/assets/nanaimo-ladysmith'

function getShareToken() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(TOKEN_QUERY_PARAM_NAME)
}

function getS3Url(shareToken) {
  return `${SHARE_ROOT}/${shareToken}`
}

function loadWhenReady(response) {
  map.on('load', function () {
    swapLayer(response.data)
    NProgress.done()
  })
}

async function initializeShareLoader() {
  const shareToken = getShareToken()
  if (!shareToken) return
  const s3Url = getS3Url(shareToken)
  await axios
    .get(s3Url)
    .then(loadWhenReady)
    .catch(function (error) {
      console.log(error)
      alert(`Something went wrong trying to load ${shareToken}`)
    })
}
export default initializeShareLoader
