import {JetView} from "webix-jet";

export default class PieChartView extends JetView {

    constructor(app) {
        console.log(`PieChartView.constructor()`)
        super(app)

        this.service = app.getService(`accountData`)
        this.accounts = this.service.getAllAccounts()
        }

    config() { 
        console.log(`PieChartView.config()`)

        let config = {
            height:250,
            id: "piechart",
            select: true,
            cols:[
            {
                rows:[
                {
                    template:"<div style='width:100%;text-align:center'>Account Status</div>",
                    height:30
                },
                    {
                    view: "chart",
                    type:"pie",
                    id: "pie1",
                    localId: "pie1",
                    value:"#count#",
                    label: "#title#",
                    pieInnerText:"#count#",
                    shadow:0,
                    data:[]
                    } 
                ]
            }]  
        }
    return config
    }

    init() {
        console.log(`PieChart.init()`)
        let pc = this.$$('pie1')
        this.accounts.map((acct) => pc.add(acct))
        // console.log(this.accounts.length)
        pc.data.group({
            by:"customer_status",
            map: {
                count:["customer_status","count"],
                title: ["customer_status"]
                }
            })
        pc.render()

	
        this.on(this.app, "app:accounts:dataready", id => {
            console.log(`EVENT: Piechart=>app:accounts:dataready`)
            
            if (this.service === null) this.service = this.app.getService('accountData')
            let accounts = this.service.getAllAccounts()
            let pc = this.$$('pie1')
            accounts.map((acct) => pc.add(acct))
            pc.data.group({
                by:"customer_status",
                map: {
                    count:["customer_status","count"],
                    title: ["customer_status"]
                    }
                })
            pc.render()
            })
            
        }

    ready() {
        console.log(`PieChart.ready()`)
        }
}