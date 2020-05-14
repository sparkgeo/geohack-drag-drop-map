import { feature } from 'topojson-client'

export default class TopoJson {
  constructor(content) {
    this.content = JSON.parse(content)
  }

  geojson() {
    const keys = Object.keys(this.content.objects)
    return feature(this.content, this.content.objects[keys[0]])
  }
}
