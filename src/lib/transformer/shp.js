import JSZip from 'jszip'

export default class Shp {
  constructor(zipContent) {
    this.zipContent = zipContent
  }

  geojson() {
    JSZip.loadAsync(this.zipContent)
      .then((content) => {
        console.log('got to here')
      })
      .catch((err) => {
        console.error(`something wrong: ${err}`)
      })
  }
}
