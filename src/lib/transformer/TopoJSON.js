import * as topojson from 'topojson-client'

export default class TopoJson {
  constructor(content) {
    this.content = content
  }

  geojson() {
    debugger

    return topojson.merge(this.content)
  }
}
