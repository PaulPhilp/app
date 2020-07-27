import { JetView } from "webix-jet"

export default class StartView extends JetView {

	constructor(args) { 
		super(args)
		}

	config() {
		return {template:"Start page", css:"webix_shadow_medium app_start"}
		}
}