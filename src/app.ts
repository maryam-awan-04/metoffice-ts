import got from 'got'
import promptSync from 'prompt-sync'

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
            console.log(`Wind Direction: ${windDirection} compass`)

            const windGustNoon = json2.SiteRep.DV.Location.Period[0].Rep[0].Gn
            console.log(`Wind Gust Noon: ${windGustNoon} mph`)

            const screenRelativeHumidityNoon = json2.SiteRep.DV.Location.Period[0].Rep[0].Hn
            console.log(`Screen Relative Humidity Noon: ${screenRelativeHumidityNoon} %`)

            const precipitationProbability = json2.SiteRep.DV.Location.Period[0].Rep[0].PPd
            console.log(`Precipitation Probability: ${precipitationProbability} %`)

            const windSpeed = json2.SiteRep.DV.Location.Period[0].Rep[0].S
            console.log(`Wind Speed: ${windSpeed} mph`)

            const visibility = json2.SiteRep.DV.Location.Period[0].Rep[0].V
            console.log(`Visibility: ${visibility}`)

            const dMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[0].Dm
            console.log(`Day Maximum Temperature: ${dMaxTemp} C`)

            const feelsLikeDMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[0].FDm
            console.log(`Feels Like Day Maximum Temperature: ${feelsLikeDMaxTemp} C`)

            const weatherType = json2.SiteRep.DV.Location.Period[0].Rep[0].W
            console.log(`Weather Type: ${weatherType}`)

            const maxUVIndex = json2.SiteRep.DV.Location.Period[0].Rep[0].U
            console.log(`Maximum UV Index: ${maxUVIndex}`)
        }
        else if (dayNight === 'n') {
            const windDirection = json2.SiteRep.DV.Location.Period[0].Rep[1].D
            console.log(`Wind Direction: ${windDirection} compass`)

            const windGustMn = json2.SiteRep.DV.Location.Period[0].Rep[1].Gm
            console.log(`Wind Gust Midnight: ${windGustMn} mph`)

            const screenRelativeHumidityMn = json2.SiteRep.DV.Location.Period[0].Rep[1].Hm
            console.log(`Screen Relative Humidity Midnight: ${screenRelativeHumidityMn} %`)

            const precipitationProbability = json2.SiteRep.DV.Location.Period[0].Rep[1].PPn
            console.log(`Precipitation Probability: ${precipitationProbability} %`)

            const windSpeed = json2.SiteRep.DV.Location.Period[0].Rep[1].S
            console.log(`Wind Speed: ${windSpeed} mph`)

            const visibility = json2.SiteRep.DV.Location.Period[0].Rep[1].V
            console.log(`Visibility: ${visibility}`)

            const nMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[1].Nm
            console.log(`Night Maximum Temperature: ${nMaxTemp} C`)

            const feelsLikeNMaxTemp = json2.SiteRep.DV.Location.Period[0].Rep[1].FNm
            console.log(`Feels Like Night Maximum Temperature: ${feelsLikeNMaxTemp} C`)

            const weatherType = json2.SiteRep.DV.Location.Period[0].Rep[1].W
            console.log(`Weather Type: ${weatherType}`)
        }

        // const userForecast = json2.SiteRep.DV.Location.Period.map(forecast => forecast.Rep)--
        const date = json2.SiteRep.DV.Location.Period[0].value
        console.log(`Forecast: ${date}`)
    }
}