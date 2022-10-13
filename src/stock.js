import { fi } from "date-fns/locale"

import priceChart from "./price_chart"
export default class Stock{
    constructor(symbol){
        this.symbol = symbol.toUpperCase()
       //sets name, marketcap industy and sector
    }

    getInfo(priceData){
        fetch('src/masterData.json')
        .then(file => {
            return file.json()
        })
        .then(data => {
            console.log(data)
            console.log(Object.keys(data))
            this.name = data["Name"][this.symbol]
            this.marketCap = data["MarketCap"][this.symbol]
            this.industry = data["Industry"][this.symbol]
            this.sector = data["Sector"][this.symbol]

            //add head box info
            document.getElementById("ticker").innerHTML = this.symbol
            document.getElementById("name").innerHTML = `${this.name} |  ${this.sector}`
            document.getElementById("latest-price").innerHTML = `$ ${Object.values(priceData.adjClose).reverse()[0]}`
            document.getElementById("latest-change").innerHTML = `${Object.values(priceData.changePercent).reverse()[0]}`
      
            Object.values(priceData.changePercent).reverse()[0] < 0 ? document.getElementById("latest-change").style.color = "red" : document.getElementById("latest-change").style.color = "green"

            //add stats info
            const priceObj = priceData.adjClose
            const dates = Object.keys(priceObj)
            const prices = Object.values(priceObj)
            const volume = Object.values(priceData.volume).reverse()
            console.log(priceData)
            document.getElementById("stats-open").innerHTML = `$ ${Object.values(priceData.adjClose).reverse()[1]}`
            document.getElementById("stats-close").innerHTML = `$ ${Object.values(priceData.adjClose).reverse()[0]}`
            const pastYearPrices = dates.reverse().slice(0,252).map(date => {
                return priceObj[date]
            })
            let max = 0
            let min = pastYearPrices[0]

            for(let i = 0; i < pastYearPrices.length;i++){
                if(pastYearPrices[i] > max){
                    max = pastYearPrices[i]
                }else if(pastYearPrices[i] < min){
                    min = pastYearPrices[i]
                }
            }
         
            document.getElementById("stats-high").innerHTML = `$${max}`
            document.getElementById("stats-low").innerHTML = `$${min}`
            let total = 0
            volume.forEach(v => {
                total += v
            })
            document.getElementById("stats-avg-volume").innerHTML = Math.floor(total/volume.length)
            document.getElementById("stats-volume").innerHTML = volume[0]
            document.getElementById("stats-mc").innerHTML = `$ ${Math.floor(this.marketCap)}`
            //open (latest price)   
            //52 week high
            //52 week low
            //market cap
            //volume
            //avg volume
        })
    }



        getPrices(){
            const jsonPath = ` ./src/json_prices/${this.symbol}_prices.json`
            const returnData = fetch(jsonPath)
            .then((file) =>{
                return file.json()
            })
            .then((data) => {
                console.log(data)
                return data
            })
            return returnData
        }



        chartPrices(duration){
            if(duration === undefined){duration = "MAX"}
            const dataPoints = []
            const path = `./src/json_prices/${this.symbol}_prices.json`
            fetch(path)
                .then((file) =>{
                    return file.json()
                })
                .then((data) => {
                    
                    const dateIndices = Object.keys(data.date).reverse()
               
                    const durationOptions = {
                        "1W": 5,
                        "1M": 20,
                        "6M": 126,
                        "1Y": 252,
                        "MAX" : dateIndices.length
                    }
                    const keys = dateIndices.slice(0,durationOptions[duration])
                    const subsetData = []
                    for(let i = 0; i < keys.length; i++){
                        let key = keys[i]
                        subsetData.push({'x': key, 'y': data.adjClose[key] })
                    }
                    new priceChart(subsetData.reverse(),duration).render()
                    this.getInfo(data)
                })
            }
    
    
}