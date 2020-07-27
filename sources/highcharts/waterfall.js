import { JetView } from "webix-jet"
import { Query } from "../bigquery/bigquery.js"

export default class Waterfall extends JetView {

    constructor(app) {
      console.log(`Dashboard()`)

        super(app)
        this.query = new Query()
        this.data = []



        this.barColours = [
          "#e0f2f1",
          "#b2dfdb",
          "#80cbc4",
          "#4db6ac",
          "#26a69a",
          "#009688",
          "#00897b",
          "#00796b",
          "#00695c",
          "#004d40",
          "#a7ffeb",
          "#64ffda",
          "#1de9b6", 
          ]
        }

      static formatAmount(amount) {
        return Math.round(amount / 1000, 2) + 'K'
        }

      config () {
        console.log(`Dashboard.config()`)

        let chart = {
            view:"chart",
            type:"bar",
            borderless: true,
            id: "activities_chart",
            barWidth:25,
            radius:0,
            yAxis:{
              start:0,
              step:5000,
              end:50000,
              title:"Activity Count",
          
            },
            xAxis:{
              template: "#accountName#",
              title:"Account"
            },
            series: []
        };

        return {
            width:1200,
            height:1400,
            rows:[
              {
                template:"<div style='font-weight:bold;padding-left:30px'>Activities</div>",
                height:40
              },
              chart
            ]
          }
        }

    async init(view) {
        console.log(`Dashboard.init()`)
        await this.query
            .runQuery();

        this.data = this.query
            .getData()
        }

    ready(view) {
        console.log(`Dashboard.ready()`)
        console.log(this.data)
        let chart = this.$$(`activities_chart`)

        for (let m = 0; m < 6; m++) {
          let index = `#count${m}#`
          let colour = this.barColours[m]
          let bar = {   // 1st company - turquoise blue bars
            value: index,
            /**
            label: function(obj){
              let val = (obj[`count${m}`] / 1000).toFixed(1)
              console.log(`${index} :: ${val}K`)
              return val
              },
              ***/
            color: colour, 
            width: 100,
            tooltip:{
                template: index
                }
            }

          chart.addSeries(bar)
          }

        console.log(this.data)
        this.$$(`activities_chart`).parse(this.data)
        }
    }