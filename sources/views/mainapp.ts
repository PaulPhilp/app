import { JetView } from "webix-jet"
import { MenuWidget } from '../interfaces/AmityApp';
let widgets = require("../widgets/widgets.json")

const mainMenu = {
	"cols": [
		{
			"localId": "mainapp_menu",
			"id": "mainapp_menu",
			"name": "mainapp_menu",
			"view": "sidebar",
			"width": 200,
			"height": 200,
			"data": [
				{ "id": "dash", "value": "Dashboard", "icon": "mdi mdi-view-dashboard" }
			]
		}
	]
}

export default class MainAppView extends JetView {

	private sideMenu: any
	private menuWidget: MenuWidget
	private $menu: any

	constructor(args: any) { 
		super(args, {})
		console.log(`MainAppView()`)

		this.menuWidget = new MenuWidget(this.app, "Main Menu")
		this.menuWidget.addWidgets(widgets)
		// console.log(this.menuWidget)
		
		this.sideMenu = {
			localId: "mainapp",
			id: "mainapp",
			name: "mainapp",
			"rows":[
					{
					"view":"template",
					"template":"Amity App Playground",
					"role":"placeholder",
					"height":50,
					"tooltip":{
							"template":"Hello World"
					}
					},
					{
					"cols":[
							this.menuWidget,

							{type:"wide",
							"paddingY":10,
							"paddingX":5,
							"rows":[{
								  "$subview":true
							   }
							]}
					],
					"type":"wide"
					},
					{
					"view":"template",
					"template":"Debug ",
					"role":"placeholder",
					"height":50
					}
			],
			"disabled":false,
			"isolate":false,
			"type":"wide"
			}
		}

	config() {
		console.log(`MainView.config()`)

		let newItem = {
			id: widgets.viewName,
			value: widgets.menuItem,
			icon: "mdi mdi-view-dashboard"
			}

		mainMenu.cols[0].data.push(newItem)
		return this.sideMenu
		}

	init() {
		console.log(`MainView.init()`)
		
		}
	}