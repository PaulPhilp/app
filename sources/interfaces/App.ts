import { 
    JetApp
    }
from 'webix-jet'

import {
    IApp,
    IWidget,
    IAppOptions,
    AppContext,
    AppStateSchema,
    AppEvent,
    Nullable
} from './AmityApp'

import {
	Machine,
	StateMachine,
	actions,
	assign,
	send,
	sendParent,
	interpret,
	spawn,
	AnyAssignAction,
	DoneEventObject,
	MachineConfig,
	AssignAction,
	Actions
  } from 'xstate'

import abslog from 'abslog'
// import metrics from 'metrics'

// type Nullable<T> = { [P in keyof T]: T[P] | null }

export abstract class App extends JetApp implements IApp{

	private name:               string
	private version:            string = ""
	private container:          string = ""
	private pathname:           string = ""
	private manifest:           string = ""
	private development:        boolean = true
    // private metrics:            metrics.Report = new metrics.Report()
    // private reporter:           metrics.ConsoleReporter = new metrics.ConsoleReporter(this.metrics);
    protected uiState:          Nullable<StateMachine<AppContext, AppStateSchema, AppEvent>> = null
    private widgets:            Array<IWidget> = new Array()

    registerWidget(widget: IWidget): void {
        this.widgets.push(widget)
        }

    hide(): void {

        }

	show(): Promise<any> { 
        return Promise.resolve(true)
		}
		
	constructor(config: any) {
        super(config)
        console.log(`App()`)
		this.name = config.name
		// this.logger = console
		this.log = abslog(console)
		this.attachEvent("app:error:resolve", function(name: string, error: string){
			window.console.error(error);
		    });
        }
    
    initialize(): void {}
	start(): void {}
	logger(): void { abslog(console) }
	log(): void {}
	validate(): boolean { return true}
	destructor():void{}
	}
