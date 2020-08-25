import {JetView} from "webix-jet";

export default class BarChartView extends JetView {

    constructor(app) {
        // console.log(`PieChartView.constructor()`)
        super(app)

        this.service = app.getService(`accountData`)
        this.accounts = this.service.getAllAccounts()
        }

    config() { 
        // console.log(`PieChartView.config()`)

        let config = {
            height:250,
            id: "renewals",
            select: true,
            cols:[
            {
                rows:[
                {
                    template:"<div style='width:100%;text-align:center'>Account Status</div>",
                    height:30
                    },
                {
                    view:"chart",
                    type:"bar",
                    id: "bar1",
                    localId: "bar1",
                    value:"#count#",
                    label:"#count#",
                    barWidth:35,
                    radius:0,
                    label: "#customer_status#",
                    data:[]
                    } 
                ]
            }]  
        }
    return config
    }

    init( ) {
        let bar = this.$$('bar1')
        this.accounts.map((acct) => bar.add(acct))
        bar.data.group({
            by:"customer_status",
            map: {
                count:["customer_status","count"],
                title: ["customer_status"]
                }
            })
        bar.render()

        this.on(this.app, "app:accounts:dataready", id => {
            // console.log(`EVENT: Piechart=>app:accounts:dataready`)
            
            if (this.service === null) this.service = this.app.getService('accountData')
            let accounts = this.service.getAllAccounts()
            let bar = this.$$('bar1')
            accounts.map((acct) => bar.add(acct))
            bar.data.group({
                by:"customer_status",
                map: {
                    count:["customer_status","count"],
                    title: ["customer_status"]
                    }
                })
            bar.render()
            })
            
        }
}