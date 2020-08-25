import { createModuleResolutionCache } from "typescript";
import {JetView} from "webix-jet";

export default class DashboardView extends JetView {

    constructor(app) {
        console.log(`DashboardView()`)
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
                title: {
                    label: "Active",
                    color: "teal",
                    "font-weight": "900"
                    },
                subtitle: {
                    label: "active accounts",
                    color: "navy",
                    "text-decoration": "none",
                    "font-weight": "none"
                    },
                },
                {},
                
            {   borderless: true,
                id: "saas2",
                view: "bignumber",
                title: {
                    label: "Inactive",
                    color: "teal",
                    "font-weight": "900"
                    },
                subtitle: {
                    label: "inactive accounts",
                    color: "navy"
                    },
                },
                {},
            {            
                id: "saas3",
                borderless: true,
                view: "bignumber",
                title: {
                    label: "Churned",
                    color: "teal",
                    "font-weight": "900"
                    },
                subtitle: {
                    label: "churned accounts",
                    color: "navy"
                    },
                },
                {},
            ]
        }
        
    console.log(config)
    return config
    }

    init() {
        console.log(`DashboardView.init()`)

        console.log(`saas1`)
        let saas1 = this.$$('saas1')
        console.log(saas1)

        console.log(`saas2`)
        let saas2 = this.$$('saas2')

        console.log(`saas3`)
        let saas3 = this.$$('saas3')

        let status = [
            {"customer_status": "active", count: 0,   prevCount: 30},
            {"customer_status": "inactive",  count: 0,   prevCount: 38},
            {"customer_status": "churned", count: 0,   prevCount: 80},
        ]

        this.accounts.map((acct) => {
            if (acct.customer_status == 'active') status[0].count++
            if (acct.customer_status == 'inactive') status[1].count++
            if (acct.customer_status == 'churned') status[2].count++
        })

        saas1.add(status[0])
        saas1.render()

        saas2.add(status[1])
        saas2.refresh()

        saas3.add(status[2])
        saas3.refresh()
	
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

            saas1.add(status[0]);
            saas1.api.subtitle = "active"
            saas1.define("subtitle", "Active Accounts");
            saas1.render()

            saas2.add(status[1])
            saas2.refresh()

            saas3.add(status[2])
            saas3.refresh()
            })
            
    }
}