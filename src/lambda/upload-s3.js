require('dotenv').config()
const AWS = require('aws-sdk')

const fromBase64 = (encodedValue) =>
  Buffer.from(encodedValue, 'base64').toString('utf8')
// ----------------------------------------------------------------------------------- //
const parseBody = (body, isBase64Encoded) =>
  JSON.parse(isBase64Encoded ? fromBase64(body) : body)

exports.handler = (event, _context, callback) => {
  const Bucket = 'data-converter.sparkgeo.app'

  let response

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Method Not Allowed' })
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.FUNCTIONS_AWS_ACCESS_KEY,
    secretAccessKey: process.env.FUNCTIONS_AWS_SECRET_KEY,
    region: 'us-west-2',
  })

  try {
    const body = parseBody(event.body, event.isBase64Encoded)

    const Key = body.clientFilename

    const putParams = {
      Bucket,
      Key,
      Expires: 2 * 60,
      ContentType: body.mimeType,
      ContentEncoding: 'base64',
    }
    const putUrl = s3.getSignedUrl('putObject', putParams)

    const getParams = {
      Bucket,
      Key,
      Expires: 60 * 60,
      ResponseCacheControl: 'max-age=604800',
    }

    response = {
      statusCode: 200,
      body: JSON.stringify({
        putUrl,
      }),
    }
  } catch (e) {
    console.log('Error triggered ', e)
    response = { statusCode: 500, body: 'it does not work' }
  }

  return callback(null, response)
}
