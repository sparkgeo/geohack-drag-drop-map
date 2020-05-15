import initializeDragDropEvents from './lib/initializeDragDropEvents'
import initializeLayers from './layers'
import generateRandomString from './lib/generateRandomString'
import { exportMapData } from './lib/map'
import generateShareLink from './lib/generateShareLink'
import initializeShareLoader from './lib/shareLoader'

import axios, { post } from 'axios'

initializeDragDropEvents()
initializeLayers()
initializeShareLoader()

// Shares the document
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
      alert('Error: Share was not successful')
      return
    })

    if (data) {
      // create a `File` object
      const file = new File([fileData], fileName, { type: fileType })

      axios({
        method: 'PUT',
        url: data.putUrl,
        data: file,
        headers: { 'Content-Type': fileType, 'Content-Encoding': 'base64' },
      })
        .then(() => {
          generateShareLink(fileName)
        })
        .catch((e) => {
          console.error('Error in uploading file ', e)
          alert('Error: Share was not successful')
        })
    }
  })
