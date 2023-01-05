
import Chart from 'chart.js/auto'
import Utils  from 'chart.js'
import 'chartjs-adapter-date-fns'
import { SearchBar } from './search_bar'
import StatementChart from "./statement_chart"
import priceChart from './price_chart'

import Stock from './stock'

export function handleSocial(){
    const links = {
        "linkedin": "https://www.linkedin.com/in/michael-aman-ba1086258/",
        "github": "https://github.com/michael-aman01/StockScreenerJS"
    }
    let tags = Array.from(document.getElementsByClassName("social-link"))
    tags.forEach(tag => {
        tag.addEventListener("click",(e) => {
            const link = links[e.target.id]
      
            window.open(link, "_blank")
        })
    })
}


export function clearChart(chartType){
    let parentID
    let containerID
    let buttonContainerID
    let canvasID
    let newButtonID
    if(chartType === 'priceChart'){
        parentID = "head-container"
        containerID = "chart-container"
        buttonContainerID = "chart-duration-buttons"
        canvasID = "chart"
        
    }else{
        parentID= "chart-container"
        containerID = "statement-container"
        buttonContainerID = "statement-buttons"
        canvasID = "statement-chart"
    }
    const parentContainer = document.getElementById(parentID)
    //remove chart container
    const chartContainer = document.getElementById(containerID)
    chartContainer.remove()

    //create and add new container and canvas
    const newChartContainer = document.createElement("div")
    const newButtonContainer = document.createElement("div")
    newChartContainer.appendChild(newButtonContainer)
    newButtonContainer.setAttribute("id",buttonContainerID)
    newChartContainer.setAttribute("id",containerID)
    const newCanvas = document.createElement("canvas")
    newCanvas.setAttribute("id",canvasID)
    newCanvas.setAttribute("height",400)
    newCanvas.setAttribute("width",600)
    newChartContainer.appendChild(newCanvas)
    parentContainer.insertAdjacentElement("afterend",newChartContainer)

}
export function searchQuery(){
   const searchBar = document.getElementById("search-bar")
   searchBar.addEventListener("keypress",(e) => {

        if(e.key === 'Enter' && e.target.value){
            const stockSymbol = e.target.value
            clearChart("priceChart")

            addDurationButtons()
            new Stock(stockSymbol).chartPrices('1Y')

             updateStatementChart(stockSymbol.toUpperCase(),"BS") 
      
        }
   })
}



function changeDuration(newDuration){
    const currentTicker = document.getElementById("ticker")
    clearChart('priceChart')
    new Stock(currentTicker.textContent).chartPrices(newDuration)
    addDurationButtons()
  
}


export function addDurationButtons(){
    const durations = ["1W","1M","6M","1Y","MAX"]
    const buttonContainer = document.getElementById("chart-duration-buttons")

    durations.forEach(duration => {
        const newButton = document.createElement("button")
        newButton.setAttribute("id",duration)
        newButton.setAttribute("class","duration-btn")
        newButton.innerHTML = duration
        buttonContainer.appendChild(newButton)
        newButton.addEventListener("click",(e) =>{
                changeDuration(e.target.id)
             
        })
    })
  
}

export function updateStatementChart(stockSymbol,type){
    clearChart("statementChart")
    addStatementButtons()
    new StatementChart(stockSymbol,type).render()
}

function _handleStatement(e){

    const selectedButton  = document.getElementById(`${e.target.id}_container`)
    console.log(selectedButton)
    selectedButton.style.border = "10px solid red"
    clearChart("statementChart")
    addStatementButtons()
    const currentTicker = document.getElementById("ticker").textContent
    const statementType = this.id
    return updateStatementChart(currentTicker,statementType)
}

function addStatementButtons(){
    const bsButton = document.createElement("button")
    const isButton = document.createElement("button")
    const cfButton = document.createElement("button")

    bsButton.innerHTML = "Balance Sheet"
    isButton.innerHTML = "Income Statement"
    cfButton.innerHTML = "Cashflow Statement"

    bsButton.setAttribute("id","BS")
    isButton.setAttribute("id","IS")
    cfButton.setAttribute("id","CF")

    bsButton.setAttribute("class","statement-button")
    isButton.setAttribute("class","statement-button")
    cfButton.setAttribute("class","statement-button")

    const container = document.getElementById("statement-buttons")

    const statementButtons = [bsButton,isButton,cfButton]
    for(let i = 0; i < statementButtons.length; i++){
         statementButtons[i].addEventListener("click",_handleStatement)
         let bContainer = document.createElement("div")
         bContainer.setAttribute("id", `${statementButtons[i].id}_container`)
         bContainer.appendChild(statementButtons[i])
         container.appendChild(bContainer)
    }


}



function initPage(){

    addDurationButtons()
    addStatementButtons()

     new Stock('msft').chartPrices("1Y")

    new StatementChart("MSFT","BS").render()
    new SearchBar()
    handleSocial()

    
    
}
initPage()

 
