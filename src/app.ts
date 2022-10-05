import got from 'got'

const key = "9092ec1b-9728-46a8-8a39-34e778b9539c"
const url = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=${key}`

const json = await got.get(url).json() as SitelistResponse
const locationNames = json.Locations.Location.map(location => location.name)

console.log(locationNames.join("\n"))

//console.log(JSON.stringify(json))

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