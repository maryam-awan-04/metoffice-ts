import got from 'got'

const key = "YOUR-KEY"
const url = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=${key}`

got.get(url).then(result => console.log(result.body))
