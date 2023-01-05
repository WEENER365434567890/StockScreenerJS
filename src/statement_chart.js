import { Chart  } from "chart.js";
import { enUS, tr } from "date-fns/locale";
import { capitalCase } from "change-case";

export default class StatementChart{
    constructor(symbol,type){
        this.symbol = symbol
        const statementLabels = {
            
            "BS": 'balance-sheet-statement',
            "IS": 'income-statement',
            "CF": 'cash-flow-statement',

        }
        this.label = statementLabels[type]

        this.type = type
        this.statementURL = `https://financialmodelingprep.com/api/v3/${this.label}/${this.symbol}?apikey=${process.env.API_KEY}`
        this.chartContainer = document.getElementById("statement-container")
        this.canvas = document.getElementById("statement-chart")
        this.ctx = this.canvas.getContext("2d")

      
    }





    render(){

        fetch(this.statementURL)
            .then(res => {
                if(res.ok){
                    return res.json()
                }else{
                    console.log(res)
                }
          
            })
            .then((data) => {
                console.log(data)
                const statementYears = data.map(obj => parseInt(obj.date.split("-")[0]))
                const colors = ["red","blue","green", "white","yellow","purple","grey"]
                const unwanted = ["date", "symbol","cik","fillingDate","acceptedDate","period","calendarYear"]
                const labels = Object.keys(data[0]).filter(key => !unwanted.includes(key))

                const dataSets = []
                data.slice(0,2).map((statement,i) => {
                    const newStatement = {}
                    labels.map(label => {
                        newStatement[label] = statement[label]
                    })

                    dataSets.push(
                        {
                            data: Object.values(newStatement),
               
                            borderColor: colors[i],
                            borderPercentage: 1,
                            backgroundColor: colors[i],
                            fillColor: colors[i],
                            label: ` ${this.label} ${statementYears[i]}`,
                        }
                    )
                })

    

                
          

                const chartData = {
                    labels: labels.filter(label => label !== 'reportedCurrency').map(label => capitalCase(label)),
        
               
                

                    datasets:dataSets
                    }
                    const config = {
                        type: 'bar',
                        data: chartData,
              
                        options: {
                   
                            indexAxis: 'y',
                       
                            responsive: true,
       
                            plugins:{
                            legend: {
                                position: "top",
                                labels: {
                            
                                    color: "white",
                                },
                            },
                        },
         
                            scales: {
                             
                                x: {
                       
                                    ticks: {
                                   
                                        color: "white",
            
                                    }
                                },
                                y: {
                                    
                                    ticks: {
                                        font: {
                                            size: 15,
                                            lineHeigth: 200,
                                        },
                                    
                                        color: "white"
                                    }
                                },

                            },
                            
                        }
                }
                    new Chart(this.ctx,config)
                })
            
            }

        }
    


