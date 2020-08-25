import { createUnparsedSourceFile } from "typescript";
import { JetView, JetApp, EmptyRouter, HashRouter } from "webix-jet"

export default class DataView extends JetView {

	constructor(app, name, data){
		console.log(`DataView(${JSON.stringify(name)})`)
		super(app, name)
		this.service = this.app.getService('accountData')
		this.accounts = this.service.getAllAccounts()
	    }

    config() { 
		console.log(`DataView.config()`)
			let config = {
				view:"datatable",
				id: "datatable",
				localId: "datatable",
				columns:[
					{ id:"customer_status",   header:"Status", sort:"string"},
					{ id:"name",    		  header:"Name",   width:100, sort:"string"},
					],
				data: this.accounts
				}
			return config
			}
		
		init(view) { 
			console.log(`DataView.init()`)
	
			this.on(this.app, "app:accounts:dataready", id => {
				console.log(`EVENT: DataView=>app:accounts:dataready`)
				if (this.service === null) this.service = this.app.getService('accountData')
				let accounts = this.service.getAllAccounts()
				if (accounts) accounts.map((acct) => { this.accounts.push(acct)})
				this.$$('datatable').parse(this.accounts)
				this.$$('datatable').show()
				})
			}

		ready() { 
			console.log(`DataView.ready()`)
			}

   }

/***
export class DataView extends JetView {

    constructor(app, name, data){
		console.log(`DataView()`)
		super(app, name)
		this.accounts = [{'name': "Fred", customer_status: "active"}];
	    }

	config(){
		return {
            template:"DataTable", css:"webix_shadow_medium app_start"
            }
		let config = {
            view:"datatable",
            id: "datatable",
			columns:[
				{ id:"customer_status",   header:"Title", sort:"string"},
				{ id:"name",    header:"Name",  width:100, sort:"string"},
			    ],
			data: this.accounts
			}
		console.log(`DataView.config()`)
		return config
		}



	
}
***/