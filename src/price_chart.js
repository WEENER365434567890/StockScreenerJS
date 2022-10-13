import { Chart  } from "chart.js";
import { enUS } from "date-fns/locale";

export default class priceChart{
    constructor(data,duration){
      this.duration = duration
      this.data = data
      this.type = "line"
      if(["1W","1M","6M"].includes(this.duration)){
        this.yType = "linear"
      }else{
        this.yType = "logarithmic"
      }
     //   this.labels = labels

      this.canvas = document.getElementById('chart')
      this.ctx = this.canvas.getContext('2d');
   
        //possible durations = [1D,5D,1m,6m,ytd,1y,5y,max]
    }
   
    render(){
      const configs = this.getConfigs()
      console.log(configs)
      return new Chart(this.ctx,configs)
    }

    lineAnimation(){
      const ctx = this.ctx
      const totalDuration = 1000;
      const delayBetweenPoints = totalDuration / this.data.length;
      const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
      const animation = {
        x: {
              type: 'number',
              easing: 'linear',
              duration: delayBetweenPoints,
              from: NaN, // the point is initially skipped
              delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                  return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
              }
            },
            y: {
              type: 'number',
              easing: 'linear',
              duration: delayBetweenPoints,
              from: previousY,
              delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                  return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
              }
            }
      };
      return animation
    }

    getConfigs(){
        const animation = this.lineAnimation()
        const config = {
          type: 'line',
          data: {
            datasets: [{
              borderColor: "green",
              borderWidth: 1,
              radius: 0,
              data: this.data,
            }]
          },
          options: {
                animation,
                interaction: {
                intersect: false
            },
            maintainAspectRatio: false,
            plugins: {
              legend: false
            },
            scales: {
              xAxis: [{
                gridLines: {
                  drawBorder: false,
                  display: false,
                },
                scaleLabel:{display: true},
              }],
              y: {
                type: this.yType,
                position: "right",
              },
              x: {
                    type: "time",
                    time: {
                      unit: "week"
                        //set depending on duration passed to price chart class
                    },
                  ticks: {
                    callback: () => (' ')
                  },

                  adapters: {
                      date: {
                          locale: enUS
                      }
                  }
              },
            }
          }
        };
        return config
    }

  }