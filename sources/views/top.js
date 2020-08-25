import {JetView, plugins} from "webix-jet";

import PieChartView from 'views/piechart'
import DataTableView from 'views/datatable'
// import StartView  from 'views/start'

export default class TopView extends JetView {

	constructor(app) {
		super(app)
		console.log(`TopView()`)
		this.menu = null
		this.currIndex = -1
		this.currItem = null
		this.menuViews = [
			// this.app.createView(StartView, 'start'),
			this.app.createView(DataTableView, 'datatable'),
			this.app.createView(PieChartView, 'piechart'),
			]
		}

	config(){
		console.log('TopView.config()')
		self = this
		var header = {
			type:"header", template:this.app.config.name, css:"webix_header app_header"
			}

		var menu = {
			view:"menu", 
			id:"app:menu", 
			localId:"app:menu", 
			css:"app_menu",
			width:200, 
			layout:"y", 
			select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			data:[
				{ value:"Dashboard",  	id: "start", 		icon:"wxi-columns" },
				{ value:"Data",		  	id: "datatable", 	icon:"wxi-pencil" },
				{ value:"PieChart",  	id: "piechart", 	icon:"wxi-chart" }
			],
			on:{

				onBeforeSelect: function (id) {
					// console.log(`onBeforeSelect(${id})`)
					return true
					},

				onMenuItemClick: (id) => {
					// console.log(`onMenuItemClick(${id})`)

					if (this.menu === null) return

					this.menu.select(id)
					return
					let n  = this.menu.getIndexById(id)
					this.menuViews[n].refresh()
					this.app.refresh('/top/' + id)
					}
				}
			}

		var ui = {
			type:"clean", 
			id: "TopMenu",
			strict: true,
			paddingX:5, 
			css:"app_layout", 
			cols:[
				{  paddingX:5, 
					paddingY:10, 
					rows: [ {css:"webix_shadow_medium", 
						rows:[header, menu]} 
						]},
				{ type:"wide", 
				paddingY:10, 
				paddingX:5, 
				rows:[
					{ $subview:true } 
				]}
			]
		};

		return ui;
	}

	init(){
		console.log('Top.init()')
		this.use(plugins.Menu, "app:menu")
		}	

	ready() {
		console.log(`TopView.ready()`)

		this.menu = this.app.$$('app:menu')
		let id = 0
		let n = this.menu.getIdByIndex(0)
		
		this.menu.select(n)
		return 

		this.menuViews[id].show(n)
		// this.show()

		this.currIndex = id
		this.currItem = this.getRoot().queryView({id: 'app:menu'})
		
		// this.getRoot().queryView({id: 'start'}).show()
		}
	}