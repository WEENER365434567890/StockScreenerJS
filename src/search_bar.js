import Stock from "./stock"
import { clearChart, addDurationButtons,updateStatementChart } from "./index"


export class SearchBar {
   
    constructor(){
        this.inputTag = document.createElement("input")
        this.inputTag.setAttribute("id", "search-bar")
        this.inputTag.setAttribute("value","")
        this.inputTag.setAttribute("type","text")
        this.inputTag.setAttribute("placeholder", "search company")

        this.inputTag.addEventListener("keydown",this.getInput)
        document.getElementById("search-container").appendChild(this.inputTag)
        
    }

    getInput(e){
        if(e.key === 'Enter'){
            e.preventDefault()
            return null
        }


        const  searchResultsContainer = document.getElementById("search-result-container")
        Array.from(searchResultsContainer.children).map(tag => tag.remove())
        fetch("src/masterData.json")
        .then(res => {
            return res.json()
        })
        .then(data => {
            const inputTag = document.getElementById("search-bar")

            const newData = {} // reformat data to switch company name to key
            Object.keys(data.Name).forEach(key => newData[data.Name[key]] = key)
     
            const companyNames = Object.values(data.Name)
            .filter(name => name.toLowerCase()[0] === inputTag.value.toLowerCase()[0])
            .filter(name => 
                name.toLowerCase().search(`${inputTag.value.toLowerCase()}`) !== -1
            )
   
        
            for(let i = 0; i < companyNames.length; i++){
                let newTag = document.createElement("div")
                let nameTag = document.createElement("div")
                let tickerTag = document.createElement("div")
                newTag.setAttribute("class","search-result")
                newTag.setAttribute("id",newData[companyNames[i]])
                newTag.addEventListener("click", (e) => {

      
                    clearChart("priceChart")
        
                    addDurationButtons()
                    new Stock(e.target.id).chartPrices('1Y')
        
                     updateStatementChart(e.target.id.toUpperCase(),"BS")
                     inputTag.value = null
                     Array.from(searchResultsContainer.children).forEach(tag => tag.remove())
                })
                nameTag.innerHTML = companyNames[i]
                nameTag.setAttribute("id",newData[companyNames[i]])
                tickerTag.innerHTML = newData[companyNames[i]]
                tickerTag.setAttribute("id",newData[companyNames[i]])
                newTag.appendChild(nameTag)
                newTag.appendChild(tickerTag)
               searchResultsContainer.appendChild(newTag)
            }
        
        })


        
    }
}