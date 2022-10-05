import got from 'got'

const key = "YOUR-KEY-HERE"
const url = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=${key}`

const json = await got.get(url).json()

console.log(JSON.stringify(json))
