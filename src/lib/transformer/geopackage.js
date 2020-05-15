import { GeoPackageAPI } from '@ngageoint/geopackage'

export default class GeoPackage {
  constructor(gpkgContent) {
    this.gpkgContent = new Uint8Array(gpkgContent)
  }

  async geojson() {
    const geoPackage = await GeoPackageAPI.open(this.gpkgContent)
    const featureTables = geoPackage.getFeatureTables()
    let features = []
    featureTables.forEach(function (table) {
      try {
        const geoms = geoPackage.queryForGeoJSONFeaturesInTable(table)
        features = features.concat(geoms)
      } catch (err) {
        console.log('Error reading table ' + table, err)
      }
    })

    return {
      type: 'FeatureCollection',
      features: features,
    }
  }
}
