import { JetApp, EmptyRouter, HashRouter } from "webix-jet"

import { 
        IApp, 
        IAppOptions, 
        defaultAppStateMacine, 
        Query, 
        BigQueryOptions
} from "./interfaces/AmityApp"

// import StartView from "./views/start"

import {
	Machine,
	StateMachine,
	actions,
	assign,
	send,
	sendParent,
	interpret,
	spawn
  } from 'xstate'

declare const BUILD_AS_MODULE: boolean
declare var PRODUCTION: boolean

const key = {
        "type": "service_account",
        "project_id": "amityamitydatasandbox",
        "private_key_id": "068cbf4d1fa4146c9e7d76e4fc33f4adfdc850ca",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0eVje7UPJUcaT\n5lM7DoEyNbjxeK8dkCRPkfUuJ+PpFg0mDikMwb+KbZtx8Ntpy1Gx+GPlodT25j7V\ncCkhzTU18FGi/wPO4i4Qh63uHvjioml1mZfajByefcxfOq6V7bAlw3Qs91W3q9DI\nV7zWLsMeLTU4qniMQ2+8p14sOQgptgUhBaGeZnP0MXepsgFn/2ZXzkGkVelFzv+i\nSyQknZFyc0LtXZfOVgTHA1r8DESle3fnbLgOFchzzz0yEO/r6+b/faTsIk6MK4cL\nHjqV5qtogbkdd5MpZnGEFZQM0tPirE7UIhF1a8qSZ1ffbe9miJiRJq3vX43hiMce\nuKhFS7wtAgMBAAECggEADR3kstvu8urZ0lYJjPlFtC7pyi/jSlrEYnDq4pGAcKhr\nPDpucVodLPDacDJfpnv7uNujJxI9nQd1YAq1P2esV/p0QUx9+MNazCJdJp/JpwjD\npKOmwPn9+oCNVT6Gm3VmOaU2N5TVl6VwZZ862LZKKB9RBu7psNTitVHUxMVAYQeV\nVc9MrUuVMFwAEG2xQGFEvAofWh3tVmGCEyMz6+4rLW284hSjqDIRE8esEWeRldJj\nOA6Jq9r50W9BGgXCQEf++CV0Sin2M+VC6xzwVlC4G4ynFxvOwKOr8djOCizOnSt8\nmTANtB4YrfUiNqxe25odIb31OKOnQ8ks2elMlYePYQKBgQD26QzLHdBcgoCIOE/d\nnxDUDRy9/aYbyhgJJJ+zLMwAjzCbGtnrQQqJXVEUn1db6C0V0yM709IUip8ypdUx\nWU/HBZShC0jVLODnyDW0vZoEPbd0pG8TMJuZClWklj6qXr2zKmPDqeVJ3IkUUrv4\nq6/ygnBRyyl/cITkIjjR3UrNDwKBgQC7Hi7hLSjVXKUhrrsNRb5mEHOs3yh6yOmA\nhG/8JpJ+ztS3/6ol+LxocDEJP+AsuldFOfGCCE+b2pjm4NNKrIt7jPpRuN71OxMM\nc6x8jgfxlE4fz0zOlotlCO4emVa4lji5gl3hOFwby5HkqsheWjlv2M0IHbb26N1/\n7c7cDwlbAwKBgHNTqXEaDN+Y6RY3Tz6R9JdHRJyNZE/olk929s0G6IZ+W1KnORBE\nQfqlRqDeSDyadqySAQwJxT9o/DD4+lphf/zS43hRQASqQKaigktYoB7JAO6Pe344\nHwVdqWEF+GE1fV+5Nf4HVhyo0LJYbooZD0aznGjn/wsScE/qmCWWOkELAoGAdI+7\n0keobSj2MQJAwWbV0YykEmc9Nyea1ZUqkV+R2G6NckVQP7Ev5LsmwMVKp3I41QXg\nXQlCVisZHpGk7ZqIlSFf+bJ5KThwiEwygbCUYDfrZsNi7Do5gWnLs8H/lKL3mRAN\n3TOXpTTtoA2HHceEihj6t/iStkKfYIbKWqj/QfMCgYEA5VWeSp4zKEtYWAyTwWp5\ntv7dczlHWUIqc8LuLaa4voi6tdcn8Tnfbx/R+Q0lWMl6TYlGPyIAxMklvgrYgjQu\nLdKgbsLk6XRKfYoaSYzweZud2ocSdKl2C4uzzX6+rQD3XmxweqdD556cqOi7ZX2i\naJgSmll5Bb6lkLM3S0kKlFs=\n-----END PRIVATE KEY-----\n",
        "client_email": "productionbigquery@master-crossing-687.iam.gserviceaccount.com",
        "client_id": "109859439778697539074",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/productionbigquery%40master-crossing-687.iam.gserviceaccount.com"
      }

const keyFilename = "./master-crossing-687-068cbf4d1fa4.json"

// let startView = new StartView()

const config: IAppOptions = {
    name: "Amity Apps",
    router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
    debug: true,
    start: "/top/start",
    container: "mainapp",
    views: [{
        top: "top", 
        start: "start",
        datatable: "datatable", 
        piechart: "piechart"
        }]
    }

class MainApp extends JetApp {

        container: string = ""
        name: string = "MainApp"
        data: Array<0> = []
        uiState: any

        constructor(config:IAppOptions) {
                super(config)
                console.log(`MainApp()`)
                this.uiState = defaultAppStateMacine
                this.setService('accountData', {
                        getAllAccounts: () => { return this.getData()}
                        })
                }

        getData(): Array<any> {
                console.log(`Main.getData()`)
                console.log(this.data)
                return this.data 
                }

        async receiveData(state: any): Promise<any> {
                console.log('MainApp.receiveData()')
                this.data = state.data.data
                this.callEvent('app:accounts:dataReady', [])
                }

    async start():Promise<any> {
                console.log(`MainApp.start()`)
                const service = interpret(this.uiState as any).onTransition(state => {
                        // console.log(state);
                        });

                service.start()

                let options: BigQueryOptions = {
                        "projectId":"amityamitydatasandbox",
                        credentials: {
                                "client_email": "amityamity-bq-standard@amityamitydatasandbox.iam.gserviceaccount.com",
                                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDU25gMrHyFtSmd\nGrqwU3h52MB98J1cFAcUzzQtTecTpYLYmAuH8MZJkbTZysTdnHdKulDhTrpnebDf\nXI3H6ON/Sf8mBTrC53L1FdGgXaMV6tcdyBfZJQ8lZLXZOxVPcXB+YcaX6g9uWYCT\nQ4rv6zISzIBsRmn6rwePeQ7MqytGM1t5ld8UOBnuYL6sSFS9OfXwyFep+46dXkSd\nHKcJYiqGGFtDbl+ctnJUdn6SN27orMHEA4owW8ups2gjyS3Z13VVIj+OEZOypkws\nKrbjIZpO/Sa4rTQkLynfnJAkWQWPKniP/iltydPKTZNv+FlBNYMkVQNNz+wThcNw\nzE01rAYVAgMBAAECggEAAtkxbrH8NJnZBbYu218ylIbXBJhssqe99IRVUWnidrvX\nRWi7dsU9Egz2G5gADGskmYZmwK0aB3p0aHjHmO4/5RsrY+ncAHGycx8on/nAzfFH\nkal00D4Tts9jM5X70gVVmQtb6fqC3FosQ0w7FrzR/bho24oRrv4ansvi69A6kwTk\nrAAUUziq5KQh3lynJ840xs85ninfaxmc1ZB6O0VWbjQpWavPphEENwyv88SaL3gU\nUgeNo1bs87TVr46d9jQ6HWvys0aU0N+MMdEgSoUIJRVgyg814bxFMlJtCyJNGiDX\nwN+f5+Wb1Zm6yYYs2CYPioVf/N+i08mDc//yOjRs4QKBgQDr6wGfPaEnp/8mzapb\nn6EizLRwBBbTRlSTRr8XqERXOnSTDpHWOu0dTayWYnMEjo5cmmmhKsBpeetPjb81\niC5ujnx+dEdLQS5riRdHuC655EmmGaGvHTorZHOMMdvNIJibkJP23zKpsO0KY0/S\nsnwjPwAi3zVIYMclBjLU+UAJ7QKBgQDm+hKMhXFB3+pY90bVqVBDOkMRkZvgtjCJ\nAL8dnDT5FcGvvEIGpQWslBlN7aKRckT868EfWO1S0rn4XLzBfkQ59jWgolGzJcJL\nE12L4LX3cY3iSA6/bH7K7t1OOCdU6cT7JYs/P6BKuzgjr0KLIinZKH54cQyRxL5B\nu6HeW8HHyQKBgQCcenLH+WvDzuUpCq8dOKL7XwWrarrtBbAhQ4KKIXy60rXxuG84\nxjrx/cwkr0YU1q1MdMrtMFsRWuGeEamqyxnpEK84fM2w95nfj72WP28Ws3m6JzQb\n32nu0CDn80YUJ7OxM1NBIsgKz6RaCIcwfFxkUGw5tQ01ZaORRiw/INe9/QKBgQDB\nPrIsLSz/r0ZTHrd95UVIqcMZPNjMncFnrl83d8x+JWzCCeC3zHM92z58i3f69j6v\n2NLf1jfglnuPRo+J14lfcRWXCpcOKmYvB8m5UM0NdEz/58em8i/2uvgfDC4kBd2P\nPe8NgL8sJw0mFei3nWKj1BRT0klw38lKF6Cq99vduQKBgQDOdUNUzDdTDhWzqmTO\n0MtTmOLHKy0LWuogGskEzde8B0D+30Kr5cYCOya8qhmMxywODkq8FcJ3YrnpxUuU\nFHk6hG90k5VKjo55oli6ez0X8/K91bQVfKh/djG9jBuCA1kfWyFI5G9qvQzamoLh\nH2OFRt37ONmkhpxiMrt3HEZckg==\n-----END PRIVATE KEY-----\n",
                                },
                        query: "SELECT name, customer_status FROM `amityamitydatasandbox.amity_accounts.data20200630`"
                        }

                let query = new Query(options)
                let fn = this.receiveData.bind(this)
                query.run(fn)

                // let pandas = new PandasDataSource(data)
                // console.log(app)
                // let chart = new PieChart(app, "/piechartAccounts")
                // let s = app.createView(chart, "/data")
                // app.config.views = [s]
                // console.log(app)
                // app.show("piechartAccounts")
                }

    loadWidget():void {

        }

    hide(): void {}

    addDataSource(): void {}

    removeDataSource(): void {}

    destructor():void {

        }
    }

let mainApp = new MainApp(config)
mainApp.start()

const demos = new webix.DataCollection({ data:[
        { group:4, value:"Using Datatable with Subview", app: mainApp, id:"data" },
        ]})


if (!BUILD_AS_MODULE){
        webix.ready(() => {
                mainApp.render() 
                });
        }


/***
webix.ready(function(){
    webix.ui({
        cols:[
            {
                id: "hchart", view:"highchart",
                modules:["series-label", "exporting", "export-data"],
                settings:{
                    title: {
                            text: 'Highcharts with Webix: Solar Employment Growth by Sector, 2010-2016'
                    },
                    subtitle: {
                            text: 'Source: thesolarfoundation.com'
                    },
                    yAxis: {
                            title: {
                                    text: 'Number of Employees'
                            }
                    },
                    legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                    },
                    plotOptions: {
                            series: {
                                    label: {
                                            connectorAllowed: false
                                    },
                                    pointStart: 2010
                            }
                    },
                    series: [{
                            name: 'Installation',
                            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                    }, {
                            name: 'Manufacturing',
                            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
                    }, {
                            name: 'Sales & Distribution',
                            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
                    }, {
                            name: 'Project Development',
                            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
                    }, {
                            name: 'Other',
                            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
                    }]
                }
            },
            {view:"resizer"},
            { gravity:0.2 }
        ]
    });
});
***/

