import { IDataFrame } from '../interfaces/AmityApp';
import { BigQuery, Job, JobResponse } from '@google-cloud/bigquery'
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

/**
 * BigQuery API
 */

enum QueryType {
	GRAPHQL = "GRAPHQL",
    BIGQUERY = "BIGQUERY",
    }

export type Nullable<T> = { [P in keyof T]: T[P] } | null

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
		console.log(options)
		this.options = options
		this.query = options.query
		this.bigquery = new BigQuery(options)
		this.type = QueryType.BIGQUERY
		this.machine = null
		}

	run(cb: any): void {
		console.log(`run()`)
		console.log(this.query)
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
		console.log('QueryMachine()')
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
		console.log(`fetch(${typeof callback})`)
		let currentState = this.service.state
		this.service.subscribe(
			(state: any) => console.log(state),
			undefined, 
			callback)
		currentState = this.service.send("FETCH")
		}
	}