import initializeDragDropEvents from './lib/initializeDragDropEvents'
import initializeLayers from './layers'
import generateRandomString from './lib/generateRandomString'
import { exportMapData } from './lib/map'
import axios, { post } from 'axios'

document
  .querySelector('#generate-link')
  .addEventListener('click', async function () {
    // Set request to lambda
    const generateSignedS3Url = '/.netlify/functions/upload-s3'

    const fileName = `${generateRandomString()}.json`
    const fileType = 'text/plain'

    let fileData = exportMapData()

    // Do nothing if no data present
    if (!fileData) {
      return false
    }

    fileData = JSON.stringify(fileData)

    // Generates tempoary signed url for uploading data
    const { data } = await post(generateSignedS3Url, {
      clientFilename: fileName,
      mimeType: fileType,
    }).catch((e) => {
      console.error('Error in generating signed url ', e)
    })

    // create a `File` object
    const file = new File([fileData], fileName, { type: fileType })

    await axios({
      method: 'PUT',
      url: data.putUrl,
      data: file,
      headers: { 'Content-Type': fileType, 'Content-Encoding': 'base64' },
    }).catch((e) => {
      console.error('Error in uploading file ', e)
    })

    // TODO update sharing link with link url
  })

initializeDragDropEvents()
initializeLayers()
