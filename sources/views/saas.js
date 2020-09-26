import { createModuleResolutionCache } from "typescript";
import {JetView} from "webix-jet";

export default class DashboardView extends JetView {

    constructor(app) {
        console.log(`DashboardView()`)
        super(app)
        this.service = app.getService(`AccountStatusService`)
        this.accounts = this.service.getAllAccounts()
        }

    config() { 
        console.log(`DashboardView.config()`)
        let config = {
            maxWidth: 1000,
            borderless: true,
            type: "line",
            cols: [{
                id: "saas1",
                borderless: true,
                view: "bignumber",
                title: {
                    label: "Active",
                    color: "teal",
                    "font-weight": "900"
                    },
                subtitle: {
                    label: "active accounts",
                    color: "slategrey"
                    },
                value: {
                    field: "count",
                    color: "teal",
                    format: "0"
                    },
                diff: {
                    color: "navy",
                    "font-size": "10px",
                    "negative-color": "red",
                    label: "accounts",
                }
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
                    color: "slategrey"
                    },
                value: {
                    field: "count",
                    color: "teal",
                    format: "0"
                    },
                diff: {
                    color: "navy",
                    "font-size": "14px",
                    "negative-color": "red",
                    label: "accounts"
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
                    color: "slategrey"
                    },
                value: {
                    field: "count",
                    color: "teal",
                    format: "0"
                    },
                diff: {
                    "font-size": "14px",
                    color: "navy",
                    "negative-color": "red",
                    label: "Accounts"
                    },
                },
                {},
            ]
        }
        
    // console.log(config)
    return config
    }

    init() {
        console.log(`DashboardView.init()`)
    }

    ready() {
        console.log(`DashboardView.ready()`)

        // console.log(`saas1`)
        let saas1 = this.$$('saas1')
        // console.log(saas1)

        // console.log(`saas2`)
        let saas2 = this.$$('saas2')

        // console.log(`saas3`)
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

        saas1.add([status[0]], 0)
        saas1.refresh()

        saas2.add([status[1]], 0)
        saas2.refresh()

        saas3.add([status[2]], 0)
        saas3.refresh()
    }
}