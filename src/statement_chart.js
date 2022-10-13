import { Chart  } from "chart.js";
import { enUS, tr } from "date-fns/locale";


export default class StatementChart{
    constructor(symbol,type){
        this.symbol = symbol
        const statementLabels = {
            
            "BS": `${this.symbol} Balance Sheet`,
            "IS": `${this.symbol} Income Statement`,
            "CF": `${this.symbol} Cashflow Statement`,

        }
        this.label = statementLabels[type]

        this.type = type
        this.statementPath = `src/statements_json/${this.symbol}_${this.type}.json`
        this.chartContainer = document.getElementById("statement-container")
        this.canvas = document.getElementById("statement-chart")
        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = this.chartContainer.clientWidth/2
      
    }





    render(){

        fetch(this.statementPath)
            .then(raw => {
                return raw.json()
            })
            .then((data) => {
                const statementYears = Object.keys(data)
                const labels = Object.keys(data[statementYears[0]])

                const chartData = {
                    labels: labels,
                    barThickness: 6,
                    base: 10000,
                    datasets: [{
                        data: Object.values(data[statementYears[0]]),
                        borderWidth: 4,
                        borderColor:"blue",
                        label: ` ${this.label} ${statementYears[0]}`,
                    
           
                    },
                    {
                        data: Object.values(data[statementYears[1]]),
                        borderWidth: 4,
                        borderColor: "red",
            
                        label:  ` ${this.label} ${statementYears[1]}`,
                    }
                ],
                    }
                    const config = {
                        type: 'bar',
                        data: chartData,
               
                        options: {
                            indexAxis: 'y',
                            grouped: true,
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                                offset: true,
                            },
                            
                        }
                }
                    new Chart(this.ctx,config)
                })
            
            }

        }



