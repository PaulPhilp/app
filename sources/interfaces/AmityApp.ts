'use strict';

import {JetView, JetApp, plugins } from "webix-jet";
import { IJetConfig, IJetApp, IJetView, IBaseView } from "webix-jet/dist/types/interfaces"
import { BigQuery, Job, JobResponse } from '@google-cloud/bigquery'
import { Index, Series, DataFrame } from "data-forge"
import abslog from 'abslog';
import metrics from 'metrics'

// webpack require
declare function require(_$url: string): any;

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
  } from 'xstate';

import { stateValuesEqual } from "xstate/lib/State";
import { createNonNullExpression } from "typescript";
import { readdirSync } from 'fs-extra';
const { choose, log } = actions;

export type Nullable<T> = { [P in keyof T]: T[P] } | null 

type Layout = webix.ui.layout
type DataTable = webix.ui.datatable

type DataCollection = webix.DataCollection

type TreeCollection = webix.TreeCollection

enum DataSourceType {
    GRAPHQL = "GRAPHQL",
    BIGQUERY = "BIGQUERY",
    CSV = "CSV",
    JSON = "JSON"
	}

enum QueryType {
	GRAPHQL = "GRAPHQL",
    BIGQUERY = "BIGQUERY",
	}

/**
 * BigQuery API
 */

type IDatasetReference = {
	/**
	 * [Required] A unique ID for this dataset, without the project name. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.
	 */
	datasetId?: string;
	/**
	 * [Optional] The ID of the project containing this dataset.
	 */
	projectId?: string;
	};

type IProjectReference = {
		/**
		 * [Required] ID of the project. Can be either the numeric ID or the assigned ID of the project.
		 */
		projectId?: string;
	  };

type IQueryParameter = {
		/**
		 * [Optional] If unset, this is a positional parameter. Otherwise, should be unique within a query.
		 */
		name?: string;
		/**
		 * [Required] The type of this parameter.
		 */
		parameterType?: IQueryParameterType;
		/**
		 * [Required] The value of this parameter.
		 */
		parameterValue?: IQueryParameterValue;
	  };


type IQueryParameterType = {
	/**
	 * [Optional] The type of the array's elements, if this is an array.
	 */
	arrayType?: IQueryParameterType;
	/**
	 * [Optional] The types of the fields of this struct, in order, if this is a struct.
	 */
	structTypes?: Array<{
		/**
		 * [Optional] Human-oriented description of the field.
		 */
		description?: string;
		/**
		 * [Optional] The name of this field.
		 */
		name?: string;
		/**
		 * [Required] The type of this field.
		 */
		type?: IQueryParameterType;
	}>;
	/**
	 * [Required] The top level type of this field.
	 */
	type?: string;
	};

type IQueryParameterValue = {
	/**
	 * [Optional] The array values, if this is an array type.
	 */
	arrayValues?: Array<IQueryParameterValue>;
	/**
	 * [Optional] The struct field values, in order of the struct type's declaration.
	 */
	structValues?: {[key: string]: IQueryParameterValue};
	/**
	 * [Optional] The value of this value, if a simple scalar type.
	 */
	value?: string;
	};

export type BigQueryOptions = {

	destination?: string
	keyFilename?: string
	projectId?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params?: any[] | {[param: string]: any};
	dryRun?: boolean;
	types?: string[] | string[][] | {[type: string]: string[]};
	maxResults?: number
	timeoutMs?: number
	pageToken?: string
	autoRetry?: boolean
	maxRetries?: number
	location?: string
	userAgent?: string
	/**
	 * The API endpoint of the service used to make requests.
	 * Defaults to `bigquery.googleapis.com`.
	 */
	apiEndpoint?: string
	query?: string
	credentials: any
	}

type IQuery  = {

	type?: QueryType
	query: string

	/**
	 * Query parameters for Standard SQL queries.
	 */
	queryParameters?: Array<IQueryParameter>;

	/**
	 * Query options.
	 */
	options?: BigQueryOptions

	run(cb: any): void
	cancel(): void
	getResults(): IDataFrame
	getStats(): any
	}

type StateTypes = "atomic" | "compound" | "final" | "history" | "parallel"
type QueryEvent = DoneEventObject

interface IQueryContext {
	results: any;
	error: any;
  }

interface IQueryStateSchema {
	states: {
		ready: 		{},
		starting: 	{}, 
	  	fetching: 	{},
		success: 	{},
		error: 		{}
		}
	}

interface IQueryStateMachineConfig extends IQueryStateSchema {
	id:string
	initial: "ready" | "fetching" 
	context: IQueryContext
	src?: string
	type?: StateTypes
	onDone?: string 
	onError?: string 
	strict: boolean
  }

let queryAssign = assign

function assignSuccess() {
	console.log(`assignSuccess()`)
	}

function assignFailure () {
	console.log(`assignFailure()`)
	}

const getDataFromAPI = (job: any): Promise<any> => {
	return job.getQueryResults()
			  .then((data: Array<any>) => { 
					return data[0]
					})
	}
	
class QueryMachine  {
	job: Job
	data: any = Array(0)
	machine: StateMachine<any, any, any>
	service: any
	results: any

	config: IQueryStateMachineConfig = {
		id: "bigQueryFetcher",
		initial: "ready",
		strict: true,
		context: {
			results: null, 
			error:null
			},
		states: {
			ready: {
				on: {
					START: "starting",
					}
				},
			starting: {
				on: {
					FETCH: "fetching",
				}
			},
			fetching: {
				invoke: {
					id: "bigqueryFetch",
					src: (ctx: any, event: any): Promise<any> => {
						return getDataFromAPI(this.job)
						},
					onDone: { 
							target: "success",  
							actions: (context: any, event: any) => {
								context.results = event.data
								}
							},
					onError: { 
							target: "error",
							actions: (context: any, event: any) => assign<IQueryContext, QueryEvent>({
								error: (context: any, event: any) => event.data,
								})
						 }
					}
				},
			success: {
				type: 'final',
				action: (ctx: any, evt: any) => {
					console.log('final action')
					},
				data: {
					data: (context: any, event: any) => {
						// console.log(`SUCCESS FINAL`)
						return event.data
						}
				  }
				},
			error: {
				type: 'final'
				}
		}
	}

	constructor(job: Job) {
		// console.log('QueryMachine()')
		this.job = job
		this.config.id = this.config.id + `-${job.id}`
		this.machine = Machine<IQueryContext, IQueryStateMachineConfig, QueryEvent>(this.config)
		this.service = interpret(this.machine)
			.onTransition((state) => {
				console.log(`onTransition(${JSON.stringify(state.value)})`)
				})

		this.service.start()
		this.service.send("START")
		}

	fetch(callback: any) {
		// console.log(`fetch(${typeof callback})`)
		let currentState = this.service.state
		this.service.subscribe(
			(state: any) => console.log(state),
			undefined, 
			callback)
		currentState = this.service.send("FETCH")
		}
	}

export class Query implements IQuery {

	public type: QueryType
	private job: Nullable<JobResponse> = null
	query: string = ""
	queryParameters?: Array<IQueryParameter>
	options?: BigQueryOptions
	bigquery: BigQuery
	private machine: Nullable<QueryMachine>

	constructor(options: BigQueryOptions) {
		console.log(`new Query()`)
		// console.log(options)
		this.options = options
		this.query = options.query
		this.bigquery = new BigQuery(options)
		this.type = QueryType.BIGQUERY
		this.machine = null
		}

	run(cb: any): void {
		// console.log(`run()`)
		// console.log(this.query)
		this.bigquery.createQueryJob({
			query: this.query,
			location: 'us'
			})
		.then((job) => {
			this.job = job
			this.machine = new QueryMachine(this.job[0])
			this.machine.fetch(cb)
			})
		}

	async cancel(): Promise<any> {

		}

	async getResults(): Promise<any> {
		
		}

	async getStats(): Promise<any> {

		}

	}

export interface IDataSource {
	type: DataSourceType
	}
	
export interface IDataFrame {

	}

// namespace Webix {

	type VIEW = webix.ui.view 					// https://webix.com/widget/view/

	/***
	 * UI Layout Types
	 ***/
	type ACCORDIAN = webix.ui.accordion			// https://webix.com/widget/accordion/
	type ACCORDIANITEM = webix.ui.accordionitem // https://webix.com/widget/accordionitem/
	type LAYOUT = webix.ui.layout				// https://webix.com/widget/layout/
	type ABSLAYOUT = webix.ui.abslayout			// https://webix.com/widget/abslayout/
	type CAROUSEL = webix.ui.carousel			// https://webix.com/widget/carousel/
	type PORTLET = webix.ui.portlet				// https://webix.com/widget/portlet/
	type GRIDLAYOUT = webix.ui.gridlayout		// https://webix.com/widget/gridlayout/
	type DASHBOARD = webix.ui.dashboard			// https://webix.com/widget/dashboard/
	type FORM = webix.ui.form					// https://webix.com/widget/form/
	type SCROLLVIEW = webix.ui.scrollview		// https://webix.com/widget/scrollview/
	type MULTIVIEW = webix.ui.multiview			// https://webix.com/widget/multiview/
	type TABVIEW = webix.ui.tabview				// https://webix.com/widget/tabview/

	/***
	 * UI Widget Types
	 ***/

	type SPREADSHEET = webix.ui.spreadsheet			// https://webix.com/spreadsheet/
	type PIVOTTABLE = webix.ui.pivot				// https://webix.com/spreadsheet/
	type PIVOTCHART = webix.ui.pivot
	type KANBAN = webix.ui.kanban					// https://webix.com/kanban/
	type FILEMANAGER = webix.ui.filemanager			// https://webix.com/filemanager/
	// type DOCMANAGER = webix.ui.doc
	type QUERY = webix.ui.querybuilder				// https://webix.com/widget/querybuilder/
	// type USERMANAGER = webix.ui.usermanager

	/***
	 * Data Components
	 ***/
	type DATATABLE = webix.ui.datatable
	type DATAVIEW = webix.ui.dataview
	type DATALAYOUT = webix.ui.datalayout
	type LIST = webix.ui.list
	type GROUPLIST = webix.ui.grouplist
	type UNITLIST = webix.ui.unitlist
	type PROPERTYSHEET = webix.ui.property
	type QUERYBUILDER = webix.ui.querybuilder
	// type FILTER = webix.ui.filter
	// type TIMELINE = webix.ui.timeline
	type TREE = webix.ui.tree
	type TREEVIEW = webix.ui.treemap
	type TREETABLE = webix.ui.treetable

	/***
	 * UI Controls Types
	 ***/
	type BUTTON = webix.ui.button
	type CHECKBOX = webix.ui.checkbox
	type COLORPICKER = webix.ui.colorpicker
	type COMBO = webix.ui.combo
	type COUNTER = webix.ui.counter
	type DATEPICKER = webix.ui.datepicker
	type DATERANGEPICKER = webix.ui.daterangepicker
	// type DOUBLELIST = webix.ui.doublelist
	type FIELDSET = webix.ui.fieldset
	type FORMINPUT = webix.ui.forminput
	type ICON = webix.ui.icon
	type LABEL = webix.ui.label
	type MULTICOMBO = webix.ui.multicombo
	type MULTISELECT = webix.ui.multiselect
	type MULTITEXT = webix.ui.multitext
	type RADIO = webix.ui.radio
	type RANGESLIDER = webix.ui.rangeslider
	type RICHSELECT = webix.ui.richselect
	type RICHTEXT = webix.ui.richtext
	type SEARCH = webix.ui.search
	type SELECT = webix.ui.select
	// type SEGMENTEDBUTTON = webix.ui.segmentedbutton
	type SLIDER = webix.ui.slider
	type SWITCHBUTTON = webix.ui.switchButton
	type TABADDR = webix.ui.tabbar
	type TEXT = webix.ui.text
	type TEXTAREA = webix.ui.textarea
	// type TEXTHIGHLIGHT = webix.ui.texthighlight
	// type TOOGLEBUTTON = webix.ui.togglebutton

/***
 * UI Window and Popups Types
 ***/
type WINDOW = webix.ui.window
type POPUP = webix.ui.popup
type TOOLTIP  = webix.ui.tooltip
type CONTEXT = webix.ui.context

/***
 * Visualization Types
 ***/

 type chart = webix.ui.chart
 type gage = webix.ui.gage

// }  // End: Webix Namespace

type State =
  | {
      value: 'parent' | { parent: 'child' }
      context: AppContext;
    }

export interface AppContext {
	count: number
	visible: boolean
	}

export interface AppStateSchema {
	states: {
	  idle: {}
	  loading: {}
	  render: {}
	  ready: ReadyAppStateSchema	
	  close: {}
	  failure: any
	};
  }

interface ReadyAppStateSchema {
	type?: 'atomic' | 'final' | 'compound' | 'parallel' | 'history',
	initial: 'running',
	id: string,
	states: {
		running: {}
		hideApp: {}
		showApp: {}
		closeApp: {}
	}
}

export type AppEvent =
  | { type: 'START' }
  | { type: 'CLOSE' }
  | { type: 'SUCCESS' }
  | { type: 'FAILURE' }
  | { type: 'RETRY' }

type ReadyAppEvent =
  | { type: 'HIDE' }
  | { type: 'SHOW' }
  | { type: 'CLOSE' }


  const isVisible = (context: any, event: any, state: any): boolean => {
	// console.log(`isVisible()`)
	return context.visible
	};

const isHidden = (context: any, event: any, state: any): boolean => {
	// console.log(`isHidden()`)
	return !context.visible
	};

// const readyAppStateMachine = Machine<AppContext, ReadyAppStateSchema, ReadyAppEvent>(readyAppStateDef)

const readyAppStateDef: ReadyAppStateSchema = {
	initial: 'running',
	id: 'ReadyApp',
	states: {
		running: {
			on: {
				SHOW: {
					target: '#ReadyApp.showApp',
					cond: isHidden,
					actions: assign({
						visible: (context: AppContext) => true,
						count: (context: AppContext) => context.count++
					  })
				  },
				HIDE: {
					target: 'hideApp',
					cond: isVisible,
					actions: assign({
						visible: (context: any) => false
					  })
				  },
				CLOSE: 'closeApp'
				}
			},
		hideApp: {
			on: {
				SHOW: {
					target: 'showApp', 
					cond: isHidden,
					actions: assign({
						visible: (context: any) => !context.visible
					  })
					}
				}
			},
		showApp: {
			on: {
				HIDE: {
					target: 'hideApp', 
					cond: isVisible,
					actions: assign({
						visible: (context: any) => !context.visible
					  })
					}
				}
			},
		closeApp: {
			type: 'final'
			}
		}
	}

export const defaultAppStateMacine = Machine<any, any, any>({
    id: 'APP',
	initial: 'idle',
	type: "compound",
	strict: true,
    context: {
	  count: 0,
	  visible: false
    },
    states: {
      idle: {
        on: {
          START: 'loading'
        }
      },
      loading: {
        on: {
          SUCCESS: 'render',
          FAILURE: 'failure'
        }
	  },
	  render: {
        on: {
			SUCCESS: 'ready',
			FAILURE: 'failure'
        }
      },
      ready: { 
		  on: {
			  CLOSE: 'close',
			  FAILURE: 'failure'
		  },
		  ...readyAppStateDef
		},
	  close: {
			type: 'final'
	  		},
      failure: {
        on: {
          RETRY: {
            target: 'loading',
            actions: assign({
              count: (context: any, event: any) => context.count + 1
            })
          }
        }
      }
    }
  })

export interface Methods {
	[key: string]: (...args: any[]) => any;
	  }

enum ServiceType {
	BIGQUERY,
	PANDAS,
	CUBE,
	JSON,
	CSV
}

enum StorageType {
	WEBIX
	}
	  
export interface IService {
		name: string
		type: ServiceType
		query: string
		storage:  StorageType

		start(): void

		getData(): void
		// useValue?: any
		// useDefinedValue?: any
		// useFactory?: (...args: any[]) => any
		// useClass?: { new(...args: any[]): any; }
		// usePandas?: {}
		// useCube?: {}
		// useDataCollection?: {}
		// deps?: any[]
		// NOTE: Providers will have extra properties which are not statically defined here.
		// This extra property is needed to make TSC less strict, and enable extra properties.
		// [others: string]: any;
		// methods?: Methods;
	  }

class AppSize {
	width?: 		number
	minWidth?: 		number
	maxWidth?: 		number
	height?: 		number
	minHeight?: 	number
	maxHeight?: 	number
	}

export interface IAppOptions {
	name: string
	appSize?: AppSize
	container: string
	[key: string]: any
	}

export interface IApp extends IJetApp {
	logger():		void
	log():			void
	registerWidget(w: IWidget): void

    // App Lifecyle
	start(demoApp: any):		void
	hide(): 		void
	show(): 		Promise<any>
	destructor(): 	void

	/***
    // Data Sources
    datasource: IDataSource
    addDataSource(source: any): void
	removeDataSource(id: string): void
	***/
	}
	
export interface IWidget extends IJetView{

	name: string
	pathname: string
	configuration: IAppOptions
	viewName: string
	menuItem: string
	menuIcon: string

	logger(): any
	log(): void
	metrics: metrics.Report

	// constructor(app: IApp, name: string, config?: IAppOptions): void

    // load(): 			void
	// start(): 		void
	// update(): 		void
	}

export class MenuWidget extends JetView implements IWidget  {

	public 	name: string
	public 	pathname: string
	public  configuration: IAppOptions
	public  viewName: string = ""
	public	menuItem: string = ""
	public	menuIcon: string = ""

	private menuName: string = "mainapp_menu"
	public 	metrics: metrics.Report
	private widgets: Array<IWidget> = []
	private menu: any
	private menuView: any
	private menuViews: Array<IJetView> = Array<IJetView>(0)

	constructor(app: IJetApp, name: string, config?: IAppOptions) {
		super(app, config)
		// console.log(`MenuWidget(${name})`)

		this.menu = {
			view:"menu", 
			id:"app:menu", 
			localId:"app:menu", 
			css:"app_menu",
			width:180, 
			layout:"y", 
			select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			
			on:{
				onBeforeSelect: function (id) {
					// console.log(`onBeforeSelect(${id})`)
					return true
					},

				onMenuItemClick: (id) => {
					// console.log(`onMenuItemClick(${id})`)
					return

					if (this.menuView === null) return
					this.menuView.select(id)
					let n  = this.menuView.getIndexById(id)
					let view = this.menuViews[n]
					view.render("widget_panel")
				
					// view.render(this.app, '/mainapp/' + id)
					// this.app.show()
					}
				},
				data: []
			}
		}

	public addWidget(widget: IWidget): void {
		// (`addWidget()`)
		this.widgets.push(widget)
		}

	public addWidgets(widgets: Array<IWidget>): void {
		// console.log(`addWidgets()`)
		widgets.map((widget: IWidget) => { this.addWidget(widget)})
		this.addMenuItems(this.widgets)
		}

	private addMenuItem (widget: IWidget): void {
		// console.log(`addMenuItem()`)
		// console.log(widget)

		let newItem = {
			id: widget.viewName,
			value: widget.menuItem,
			icon: "mdi mdi-view-dashboard"
			}

		if (widget.menuIcon) newItem.icon =  `mdi ${widget.menuIcon}`

		this.menu.data.push(newItem)

		const view = require(`./../views/${widget.viewName}`)
		let newView = this.app.createView(view, widget.viewName)
		console.log(this.app.getSubView())
		this.menuViews.push(newView)
		// this.$$("app:menu").ui.
		// this.app.config.views.push(newView)
		}

	private addMenuItems(widgets: Array<IWidget>) {
		//console.log(`addMenuItems()`)
		widgets.map((widget) => { this.addMenuItem(widget)})
		// console.log(this.menu.data)
		}

	config() {
		// console.log(`MenuWidget.config()`)
		// console.log(this.menu)
		return this.menu
		}

	init() {
		// console.log(`MenuView.init()`)
		this.use(plugins.Menu, "app:menu")
		}

	ready() {
		console.log(`MenuWidget.ready()`)
		this.menuView = this.$$('app:menu')
		let n = this.menuView.getIdByIndex(0)
		// this.menuView.select(n)
		}

	logger(): any {
		return console
		}

	log(): void {

		}

	
	}

export interface IAppOptions {
	name: string
	}

/***
export class PieChart extends JetView {

	data: any = null
	app: AmityApp
	private name: string
	id: "piechartAccounts"

	configuration: {
			name: "piechartAccounts",
			id: "piechartAccounts",
			view: "chart",
			type:"pie",
			value:"#sales#",
			color:"#color#",
			label:"#month#",
			pieInnerText:"#sales#",
			shadow:0,
			data: Array<0>
		}

	constructor(app: AmityApp, name: string) {
		
		super(app, name)
		this.app = app
		this.name = name
		console.log('======= PieChart() ====== ')
		}

	addData(data: any) {
		this.data = data
		this.configuration.data = data
		}

	config() {
		console.log(`PieChart.config()`)
		return this.configuration
		}
	}

interface IChart {

}




export interface IEvent {
	name: string
	detail: any
	}

export interface IContext {
	name: string
	debug: boolean
	
	}

export interface IAmityApp {  // Container (MFE Layout)

	name: 			string
	container: 		string
	version: 		string
	pathname: 		string 
	manifest: 		string
	fallback: 		string 
	logger(): 		void
	log():			void
	development: 	boolean
	proxy: 			any
		
	validate(): boolean
	start(): void
	destructor():void
	}

export class AmityApp extends JetApp implements IAmityApp{

	name: string
	version: string
	container: string
	pathname: string
	manifest: string
	development: boolean
	fallback: any
	proxy: any


	private toolbar: any
	private menu: any
	uiState: any

	constructor(config: any) {
		console.log(`AmityApp()`)
		super(config)
		this.name = config.name
		this.log = abslog(this.logger)
		this.attachEvent("app:error:resolve", function(name, error){
			window.console.error(error);
		});
		}

	start(): void {}
	logger(): void { abslog(console) }
	log(): void {}
	validate(): boolean { return true}
	destructor():void{}
	}

enum WebixDataSourceTypes {
	PANDAS = "pandas",
	CUBE = 	 "cube"
	}

interface IWebixDataSource {
	type: WebixDataSourceTypes

	toObject(): 		any
	getRecords(): 		any
	getDetails(data: any): 		any
	getInfo(): 			any
	}

export class PandasDataSource implements IWebixDataSource {
	type =  WebixDataSourceTypes.PANDAS

	private dataframe: DataFrame = null

	constructor(data: Array<any>) {
		this.dataframe = new DataFrame(data)
		webix.DataDriver[this.type] = {
			toObject: this.toObject,
			getRecords: this.getRecords,
			getDetails: this.getDetails,
			getInfo: this.getInfo
			}
		}

	toObject(): any {
		let json = this.dataframe.toJSON()
		return JSON.parse(json)
		}

	getRecords(): any {
		return this.dataframe.toArray()
		}

	getDetails(data: any): any {
		return data
		}

	getInfo(): any {
		return { 
			size:0, 
			from:0 
			}
		}
	}
	***/


