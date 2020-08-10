import { JetView } from "webix-jet"

export default class PlainView extends JetView {

	constructor(args) { 
		super(args)
		}

	config() {
		return {template:"Hello World!", css:"webix_shadow_medium app_start"}
		}
}