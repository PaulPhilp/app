import {JetView} from "webix-jet";

export default class DashboardView extends JetView {

    constructor(app) {
        console.log(`DashboardView.constructor()`)
        super(app)

        this.service = app.getService(`accountData`)
        this.accounts = this.service.getAllAccounts()
        }

    config() { 
        console.log(`DashboardView.config()`)

        let config = {
            height:250,
            id: "saas",
            view: "dataview",
            select:true,
            type: {
                height: 60,
                width:120
                },
            datatype: "json",
            template: "<div class='webix_strong'>#customer_status#</div><div>#count#</div>"
        }

    console.log(config)
    return config
    }

    init( ) {
        console.log(`DashboardView.init()`)
        let pc = this.$$('saas')
        let status = [
            {"customer_status": "active", count: 0},
            {"customer_status": "inactive", count: 0},
            {"customer_status": "churn", count:0},
        ]

        this.accounts.map((acct) => {
            if (acct.customer_status == 'active') status[0].count++
            if (acct.customer_status == 'inactive') status[1].count++
            if (acct.customer_status == 'churn') status[2].count++
        })
        console.log(status)
        status.map((s) => { pc.add(s)})

	
        this.on(this.app, "app:accounts:dataready", id => {
            console.log(`EVENT: Piechart=>app:accounts:dataready`)
            
            if (this.service === null) this.service = this.app.getService('accountData')
            let accounts = this.service.getAllAccounts()
            let pc = this.$$('saas')
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
}