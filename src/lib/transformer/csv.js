import { Parser as CsvParser } from 'papaparse'
import { parse as parseWkt } from 'wellknown'

const convert = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const csvParser = new CsvParser({
        delimiter: ';',
        header: true,
      })
      const parsedCsv = csvParser.parse(e.target.result)
      const headerRow = parsedCsv.data.slice(0, 1)[0]
      const dataRows = parsedCsv.data.slice(1)
      const wktColIdx = headerRow.findIndex((text) => text.match(/^wkt$/i))
      resolve(
        dataRows
          .map((dataRow) => {
            return dataRow.length > wktColIdx && dataRow[0] !== ''
              ? parseWkt(dataRow[wktColIdx])
              : undefined
          })
          .filter((geometry) => !!geometry),
      )
    }
    reader.onerror = function (e) {
      reject('reading CSV failed')
    }
    reader.readAsText(file)
  })
}

export default convert
