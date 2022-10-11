import express from 'express'
import got from 'got'
import promptSync from 'prompt-sync'

const app = express()
const port = 3000
const hostname = 'localhost'
    
app.use(express.json())

interface Location {
  elevation: string,
  id: string,
  latitude: string,
  longitude: string,
  name: string,
  region: string,
  unitaryAuthArea: string,
}
interface SitelistResponse {
  Locations: {
      Location: Location[]
  }
}
interface Rep {
  D: string,
  Gn: string,
  Gm: string,
  Hn: string,
  Hm: string,
  PPd: string,
  PPn: string,
  S: string,
  V: string,
  Dm: string,
  Nm: string,
  FDm: string,
  FNm: string,
  W: string,
  U: string,
  $: string,
}
interface Period {
  type: string, 
  value: string, 
  Rep: Rep[],
}
interface Location {
  i: string,
  lat: string, 
  lon: string,
  name: string, 
  country: string, 
  continent: string, 
  elevation: string,
  Period: Period[],
}
interface Param {
  name: string,
  units: string, 
  $: string,
}
interface DV {
  dataData: string,
  type: string,
  Location: Location,
}
interface Wx {
  Param: Param[]
}
interface IdResponse {
  SiteRep: {
      Wx: Wx,
      DV: DV,
  }
}

const prompt = promptSync()

const key = "9092ec1b-9728-46a8-8a39-34e778b9539c"
const url = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=${key}`

const json = await got.get(url).json() as SitelistResponse
const locationNames = json.Locations.Location.map(location => location.name)

console.log(locationNames.join("\n"))

let selected = prompt(("Which location's forecast would you like to access?"))
for (let i = 0; i < json.Locations.Location.length; i++) {
  if (selected === json.Locations.Location[i].name) {
    const selectedId = json.Locations.Location[i].id
    const url2 = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/${selectedId}?res=daily&key=${key}`

    const json2 = await got.get(url2).json() as IdResponse

    let selectedTime = 0
    let dayNight = prompt(("Do you want the forecast for the day or night? [d / n]"))

    if (dayNight === 'd') {
      const windDirection = json2.SiteRep.DV.Location.Period[0].Rep[0].D
      const windGustNoon = json2.SiteRep.DV.Location.Period[0].Rep[0].Gn
      const screenRelativeHumidityNoon = json2.SiteRep.DV.Location.Period[0].Rep[0].Hn
      const precipitationProbability = json2.SiteRep.DV.Location.Period[0].Rep[0].PPd
      const windSpeed = json2.SiteRep.DV.Location.Period[0].Rep[0].S
      const visibility = json2.SiteRep.DV.Location.Period[0].Rep[0].V
      const dMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[0].Dm
      const feelsLikeDMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[0].FDm
      const weatherType = json2.SiteRep.DV.Location.Period[0].Rep[0].W
      const maxUVIndex = json2.SiteRep.DV.Location.Period[0].Rep[0].U

      app.get('/', (_req, res) => {
        res.status(200).json({
        message: 'Hello there! Here is the day forecast...',
        windDirection: windDirection,
        windGust: windGustNoon,
        screenRelativeHumidityNoon: screenRelativeHumidityNoon,
        precipitationProbability: precipitationProbability,
        windSpeed: windSpeed,
        visibility: visibility,
        maximumTemperature: dMaxTemp,
        feelsLikeDMaxTemp: feelsLikeDMaxTemp,
        weatherType: weatherType,
        maxUVIndex: maxUVIndex,
      })})

    }
    else if (dayNight === 'n') {
      const windDirection = json2.SiteRep.DV.Location.Period[0].Rep[1].D
      const windGustMn = json2.SiteRep.DV.Location.Period[0].Rep[1].Gn
      const screenRelativeHumidityNoon = json2.SiteRep.DV.Location.Period[0].Rep[1].Hn
      const precipitationProbability = json2.SiteRep.DV.Location.Period[0].Rep[1].PPd
      const windSpeed = json2.SiteRep.DV.Location.Period[0].Rep[1].S
      const visibility = json2.SiteRep.DV.Location.Period[0].Rep[1].V
      const nMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[1].Dm
      const feelsLikeDMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[1].FDm
      const weatherType = json2.SiteRep.DV.Location.Period[0].Rep[1].W

      app.get('/', (_req, res) => {
        res.status(200).json({
        message: 'Hello there! Here is the night forecast...',
        windDirection: windDirection,
        windGust: windGustMn,
        screenRelativeHumidityMn: screenRelativeHumidityNoon,
        precipitationProbability: precipitationProbability,
        windSpeed: windSpeed,
        visibility: visibility,
        maximumTemperature: nMaxTemp,
        feelsLikeDMaxTemp: feelsLikeDMaxTemp,
        weatherType: weatherType,
      })})
    }
  }
}


app.listen(port, hostname, () => {
console.log(
    `API is running at ` +
    `http://${hostname}:${port}`
)})