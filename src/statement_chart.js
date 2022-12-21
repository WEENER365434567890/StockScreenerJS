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

      
    }





    render(){

        fetch(this.statementPath)
            .then(raw => {
                return raw.json()
            })
            .then((data) => {
                const statementYears = Object.keys(data).reverse()
                const labels = Object.keys(data[statementYears[0]])

                const chartData = {
                    labels: labels,
        
                    base: 10000,
                    datasets: [{
                        data: Object.values(data[statementYears[0]]),
                        strokeColor: "red",
                        barPercentage: 0.5,
                        borderColor: "red",
                        borderWidth: 1,
                        backgroundColor: "red",
                        fillColor: "red",
                        label: ` ${this.label} ${statementYears[0]} (in USD Millions)`,
                
           
                    },
                    {
                        data: Object.values(data[statementYears[1]]),
                        strokeColor: "blue",
                        borderColor: "blue",
                        barPercentage: 0.5,
                        borderWidth: 1,
                        backgroundColor: "blue",
                        fillColor: "blue",
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
                            plugins:{
                            legend: {
                                labels: {
                                    color: "white",
                                },
                            },
                        },
         
                            scales: {
                                offset: true,
                                x: {
                                    ticks: {
                                        color: "white"
                                    }
                                },
                                y: {
                                    
                                    ticks: {
                            
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



