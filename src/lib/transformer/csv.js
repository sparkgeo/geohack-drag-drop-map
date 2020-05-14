import { Parser as CsvParser } from 'papaparse'
import { parse as parseWkt } from 'wellknown'

const csvcontent = `WKT;"fid";"note"
"POINT (-13677323.5585376 7152295.86018164)";"1";"centre of spark"
"LINESTRING (-13677392.7323534 7153229.70669517,-13678049.8836037 7154405.66156405,-13678049.8836037 7155685.37715666,-13678049.8836037 7155685.37715666)";"1";"bit of spark"
"LINESTRING (-13676424.298932 7153022.18524772,-13676113.0167608 7154336.48774823,-13675559.6262343 7155270.33426176)";"2";"bit of spark"
"LINESTRING (-13676182.1905766 7152053.75182628,-13674141.56301 7151984.57801047)";"3";"bit of spark"
"LINESTRING (-13677046.8632743 7151604.12202348,-13676009.2560371 7149978.53735178,-13674694.9535366 7149183.03846989)";"4";"bit of spark"
"LINESTRING (-13678119.0574195 7151846.23037883,-13679260.4253805 7150739.44932577,-13679295.0122884 7150393.58024668,-13679467.9468279 7149909.36353597,-13679571.7075516 7149528.90754898,-13679295.0122884 7149321.38610153,-13679571.7075516 7148906.34320662)";"5";"bit of spark"
"LINESTRING (-13678361.1657749 7152607.14235282,-13679502.5337358 7152918.42452399,-13679675.4682754 7152849.25070818,-13679779.2289991 7153022.18524772,-13679917.5766307 7152987.59833981,-13680021.3373545 7153229.70669517)";"6";"bit of spark"
"POLYGON ((-13665771.5312962 7151119.90531276,-13664318.8811641 7151119.90531276,-13664042.1859008 7151846.23037883,-13664318.8811641 7152399.62090537,-13665979.0527437 7152607.14235282,-13666878.3123493 7152330.44708955,-13667224.1814284 7151707.8827472,-13667639.2243233 7150601.10169413,-13667639.2243233 7149217.6253778,-13667085.8337967 7148422.12649591,-13665425.6622171 7148283.77886427,-13664111.3597166 7148387.539588,-13663869.2513613 7149044.69083826,-13665875.2920199 7149044.69083826,-13665909.8789279 7149390.55991734,-13664699.3371511 7149494.32064107,-13664664.7502432 7150047.7111676,-13666186.5741911 7149978.53735178,-13665771.5312962 7151119.90531276))";"1";"e in geo"
"POLYGON ((-13668918.9399159 7152226.68636583,-13671236.2627457 7152019.16491838,-13671789.6532723 7150912.38386531,-13671858.8270881 7149701.84208852,-13671478.3711011 7148698.82175917,-13670613.6984034 7148352.95268009,-13669161.0482712 7148352.95268009,-13668815.1791922 7148698.82175917,-13668815.1791922 7149390.55991734,-13668158.0279419 7149494.32064107,-13668296.3755735 7150151.47189132,-13670094.8947848 7150151.47189132,-13670129.4816927 7149459.73373316,-13669333.9828108 7149425.14682525,-13669576.0911661 7149217.6253778,-13670164.0686006 7149217.6253778,-13670613.6984034 7149909.36353597,-13670129.4816927 7150635.68860204,-13669368.5697187 7150843.21004949,-13668503.897021 7150808.62314158,-13668918.9399159 7152226.68636583))";"2";"g in geo"
"MULTIPOLYGON (((-13659234.6057015 7151621.41547743,-13660548.9082021 7152174.80600396,-13662243.6666896 7152174.80600396,-13662831.644124 7151413.89402998,-13662969.9917556 7150618.39514809,-13662831.644124 7149753.72245038,-13662554.9488607 7148785.28902895,-13661586.5154393 7148508.59376568,-13660306.7998467 7148612.3544894,-13659580.4747806 7149200.33192385,-13659234.6057015 7149822.8962662,-13659096.2580699 7150583.80824018,-13659234.6057015 7151621.41547743),(-13660375.9736625 7151068.0249509,-13660963.951097 7151344.72021416,-13661690.276163 7151240.95949044,-13661897.7976105 7150756.74277972,-13661724.8630709 7149857.4831741,-13661033.1249128 7149477.02718711,-13660410.5605704 7149892.07008201,-13660099.2783992 7150237.9391611,-13660375.9736625 7151068.0249509)))";"1";"o in geo"`

const convertCsv = (csvcontent) => {
  const csvParser = new CsvParser({
    delimiter: ';',
    header: true,
  })
  const parsedCsv = csvParser.parse(csvcontent)
  const headerRow = parsedCsv.data.slice(0, 1)[0]
  const dataRows = parsedCsv.data.slice(1)
  const wktColIdx = headerRow.findIndex((text) => text.match(/^wkt$/i))
  return dataRows.map((dataRow) => {
    console.log(parseWkt(dataRow[wktColIdx]))
  })
}

export default () => {
  convertCsv(csvcontent)
}
