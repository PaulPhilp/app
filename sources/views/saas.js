import { createModuleResolutionCache } from "typescript";
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
            maxWidth: 1000,
            borderless: true,
            type: "line",
            cols: [{
                borderless: true,
                id: "saas1",
                view: "bignumber",
                subtitle: "Wonderful"
                },
                {},
                
            {   borderless: true,
                id: "saas2",
                view: "bignumber"
                },
                {},
            {            
                id: "saas3",
                borderless: true,
                view: "bignumber"
                },
                {},
            ]
        }

    console.log(config)
    return config
    }

    init( ) {
        console.log(`DashboardView.init()`)
        let saas1 = this.$$('saas1')
        let saas2 = this.$$('saas2')
        let saas3 = this.$$('saas3')
        let status = [
            {"customer_status": "active",   subtitle: "Active Accounts",    count: 0,   prevCount: 30},
            {"customer_status": "inactive", subtitle: "Expired Accounts",   count: 0,   prevCount: 38},
            {"customer_status": "churned",  subtitle: "Churned Accounts",   count: 0,   prevCount: 80},
        ]

        this.accounts.map((acct) => {
            if (acct.customer_status == 'active') status[0].count++
            if (acct.customer_status == 'inactive') status[1].count++
            if (acct.customer_status == 'churned') status[2].count++
        })
        saas1.add(status[0]);
        saas2.add(status[1])
        saas3.add(status[2])

	
        this.on(this.app, "app:accounts:dataready", id => {
            console.log(`EVENT: Piechart=>app:accounts:dataready`)
            
            if (this.service === null) this.service = this.app.getService('accountData')
            let accounts = this.service.getAllAccounts()
            let saas1 = this.$$('saas1')
            let saas2 = this.$$('saas2')
            let saas3 = this.$$('saas3')

            let status = [
                {"customer_status": "active", count: 0},
                {"customer_status": "inactive", count: 0},
                {"customer_status": "churned", count:0},
            ]
    
            this.accounts.map((acct) => {
                if (acct.customer_status == 'active') status[0].count++
                if (acct.customer_status == 'inactive') status[1].count++
                if (acct.customer_status == 'churned') status[2].count++
            })

            console.log(status)
            saas1.add(status[0]);
            saas1.api.subtitle = "active"
            saas1.define("subtitle", "Active Accounts");
            saas1.render()
            saas2.add(status[1])
            saas3.add(status[2])
            })
            
        }
}