import copyToClipboard from './copyToClipboard'

const generateShareLink = (fileName) => {
  const url = `https://https://data-converter.sparkgeo.app?share_token=${fileName}`
  document.querySelector('#link-field').value = url

  copyToClipboard(url)
}

export default generateShareLink
