
export function createBignumberComponent(): void {
    console.log(`createBignumberComponent()`)

    let subtitle: string = "Subtitle"

    let api = {
        name: "bignumber",

        //default values for configuration settings
        defaults: {
                title: { 
                    label: "Title",
                    titleColor: "teal",
                },

                subtitle: { 
                    label: subtitle,
                    subtitleColor: "red",
                    },

                height: 150,
                width: 150,
                sizeToContent:true,
                xCount:1, 
                yCount:1,

                // valueColor: "black",
                // valueFormat: "%.2f",

                // backgroundColor: "white",

                /***
                comparison: {
                        show: true,
                        display: "Change",  // Value, Progess, PercentProgress
                        showLabel: true,
                        label: ""
                        },

                conditinalColor: [
                    {"test": "GTE", value1: 0, style: {valueColor: "green", titleColor: "blue"}},
                    {"test": "BETWEEN",  value1: 0, value2: -100, style: {valueColor: "red"}}
                    // EQ, NE, GT, LTE, BETWEEN, NOTBETWEEN, NULL, NOTNULL
                        ],
                ***/

                type: {
                        height: 175,
                        width: 200
                        },
                    },
                
    
        // logic on init
        $init: function (config) {
                console.log(`bignumber.$init()`)

                this.$view.className += " bignumber";
                config.template = this._buildTemplate(config)

                this.attachEvent("onClick", function(id){
                        this.select(id);
                        });
                },

            _buildTemplate(config) {
                console.log(`_buildTemplate()`)
                console.log(config)

                function buildTitleStyle(obj, common, index) {

                    let style = ""
                    let title = config.title
                    if (title) {
                        if (title.color) style += `color:${title.color}; `
                        if (title["background-color"]) style += `background-color:${title["background-color"]}; `
                        if (title["font-size"]) style += `font-size:${title["font-size"]}; `
                        if (title["font-weight"]) style += `font-weight:${title["font-weight"]}; `
                        if (title["text-align"]) style += `text-align:${title["text-align"]}; `
                        if (title["text-decoration"]) style += `text-decoration:${title["text-decoration"]}; `
                        }
                    return style
                    }

                function buildSubtitleStyle(obj, common, index) {

                    let style = ""
                    let subtitle = config.subtitle
                    if (subtitle) {
                        if (subtitle.color) style += `color:${subtitle.color}; `
                        if (subtitle["background-color"]) style += `background-color:${subtitle["background-color"]}; `
                        if (subtitle["font-size"]) style += `font-size:${subtitle["font-size"]}; `
                        if (subtitle["font-weight"]) style += `font-weight:${subtitle["font-weight"]}; `
                        if (subtitle["text-align"]) style += `text-align:${subtitle["text-align"]}; `
                        if (subtitle["text-decoration"]) style += `text-decoration:${subtitle["text-decoration"]}; `
                        }
                    return style
                    }

                function buildDiffStyle(obj, common, index) {

                    let style = ""
                    let diff = config.diff
                    if (diff) {
                        if (diff.color) style += `color:${diff.color}; `
                        if (diff["background-color"]) style += `background-color:${diff["background-color"]}; `
                        if (diff["font-size"]) style += `font-size:${diff["font-size"]}; `
                        if (diff["font-weight"]) style += `font-weight:${diff["font-weight"]}; `
                        if (diff["text-align"]) style += `text-align:${diff["text-align"]}; `
                        if (diff["text-decoration"]) style += `text-decoration:${diff["text-decoration"]}; `
                        }
                    return style
                    }
    
                let templateFn = function(obj, common, index) {
                    console.log(`templateFn()`)
        
                    let customerStatus = obj.customer_status.toUpperCase()
                    let diff = obj.count - obj.prevCount
                    let diffStyle = buildDiffStyle(obj, common, index)
                    let diffTemplate = ""
                    if (diff > 0)
                        diffTemplate = `<span class='webix_icon mdi mdi-arrow-up'></span> <span style="${diffStyle}"; >${diff}</span>`
                    else if (diff < 0)
                        diffTemplate = `<span class='webix_icon mdi mdi-arrow-down'></span> <span style="${diffStyle}"; >${diff}</span>`

                    let titleStyle = buildTitleStyle(obj, common, index)
                    let subtitleStyle = buildSubtitleStyle(obj, common, index)
        
                    let template = `<div>` + 
                            `<div class='bignumber-title'><span style="${titleStyle};"> ${customerStatus}</span></div>`+
                            `<div class='bignumber-subtitle'><span style="${subtitleStyle};"> ${config.subtitle.label}</span></div>`+
                            `<br />`+
                            `<div class='bignumber-value'>${obj.count}</div>` +
                            `<br />`+
                            `<div class='bignumber-comparison'>${diffTemplate}</div>` +
                            `</div>`
                    return template
                    }
                    
                templateFn.bind(config)
                return templateFn
            } 
        }

    webix.html.addStyle(`.bignumber {
        background-color:white
        border-style: solid;
        border-color: red;
        }`)

    webix.html.addStyle(`.bignumber-title {
        background-color:white;
        text-align: center;
        text-decoration: none;
        font-size: 24px;
        color: royalblue;
        margin-top: 10px;
        padding-top: 0px;
        }`)

    webix.html.addStyle(`.bignumber-subtitle {
        background-color:white;
        text-align: center;
        text-decoration: none;
		font-size: 14px;
        color: darkgrey;
        paddding-bottom: 10px;
        }`)

    webix.html.addStyle(`.bignumber-value {
        background-color:white;
        text-align: center;
        font-size: 44px;
        color: darkgrey;
        padding-top: 0px;
        }`)

    webix.html.addStyle(`.bignumber-comparison {
        background-color:white;
        text-align: center;
        font-size: 24px;
        color: royalblue;
        padding-top: 0px;
        }`)
        
    webix.protoUI(api, webix.ui.dataview)
    }

    /***
class BigNumberView {

    static isCreated: boolean = false
    private view: any 
    private api: any = {
        name: "bignumber",

        //default values for configuration settings
        defaults: {
                title: "Title",
                titleColor: "teal",

                subtitle: "Subtitle",
                subtitleColor: "red",

                height: 150,
                width: 150,
                sizeToContent:true,
                xCount:1, 
                yCount:1,

                valueColor: "black",
                valueFormat: "%.2f",
                valueType: "integer",

                backgroundColor: "white",

                
                comparison: {
                        show: true,
                        display: "Change",  // Value, Progess, PercentProgress
                        showLabel: true,
                        label: ""
                        },

                conditinalColor: [
                    {"test": "GTE", value1: 0, style: {valueColor: "green", titleColor: "blue"}},
                    {"test": "BETWEEN",  value1: 0, value2: -100, style: {valueColor: "red"}}
                    // EQ, NE, GT, LTE, BETWEEN, NOTBETWEEN, NULL, NOTNULL
                        ],
                

                type: {
                        height: 200,
                        width: 200,
                        template:  (obj, common, index) => {

                                let customerStatus = obj.customer_status.toUpperCase()
                                let diff = obj.count - obj.prevCount
                                let diffTemplate = ""
                                if (diff > 0)
                                    diffTemplate = `<span class='webix_icon mdi mdi-arrow-up'></span> ${diff}`
                                else if (diff < 0)
                                    diffTemplate = `<span class='webix_icon mdi mdi-arrow-down'></span> ${diff}`

                                let template = `<div>` + 
                                        `<div class='bignumber-title'>${customerStatus}</div>`+
                                        `<div class='bignumber-subtitle'>${obj.subtitle}</div>`+
                                        `<br />`+
                                        `<div class='bignumber-value'>${obj.count}</div>` +
                                        `<br />`+
                                        `<div class='bignumber-comparison'>${diffTemplate}</div>` +
                                        `</div>`
                                return template
                                }
                        }
                },
    
        // logic on init
        $init: function (config) {
                console.log(`bignumber.$init()`)
                console.log(config)

                let templateFn = (obj, common, index) => {

                    let customerStatus = obj.customer_status.toUpperCase()
                    let diff = obj.count - obj.prevCount
                    let diffTemplate = ""
                    if (diff > 0)
                        diffTemplate = `<span class='webix_icon mdi mdi-arrow-up'></span> ${webix.i18n.numberFormat(diff)}`
                    else if (diff < 0)
                        diffTemplate = `<span class='webix_icon mdi mdi-arrow-down'></span> ${webix.i18n.numberFormat(diff)}`

                    let template = `<div> blue` + 
                            `<div class='bignumber-title'>${customerStatus}</div>`+
                            `<div class='bignumber-subtitle'>${this.config.subtitle}</div>`+
                            `<br />`+
                            `<div class='bignumber-value'>${webix.i18n.numberFormat(obj.count)}</div>` +
                            `<br />`+
                            `<div class='bignumber-comparison'>${diffTemplate}</div>` +
                            `</div>`
                    return template
                    }

                this.$view.className += " bignumber";
                this.refresh()

                this.attachEvent("onClick", function(id){
                        this.select(id);
                        });
                },  

    // logic on ready
    $ready:function(){
        console.log(`bignumber.$ready()`)
        // console.log(this.config)
    },

    // logic on ready
    $render: function() {
        console.log(`bignumber.$render()`)
    },

    // function to process configuration settings
    value_setter: function() {}, 
    subtitle_setter: function(subtitle) { this.subtitle = subtitle} 
    }

    constructor(config?:any) {

        if (!BigNumberView.isCreated) {
            this.createWebixComponent()
            this.createDefaultCSS()
            BigNumberView.isCreated = true
            }

        this.view = webix.ui({
            view:"bignumber", 
            id:"bignumber"
            })

        }

    private createWebixComponent() {
        webix.protoUI(this.api, webix.ui.dataview)
        }

    private createDefaultCSS() {

        webix.html.addStyle(`.bignumber {
            background-color:white
            border-style: solid;
            border-color: red;
            }`)
    
        webix.html.addStyle(`.bignumber-title {
            background-color:lightgrey;
            text-align: center;
            font-size: 24px;
            color: royalblue;
            margin-top: 10px;
            padding-top: 0px;
            }`)
    
        webix.html.addStyle(`.bignumber-subtitle {
            background-color:lightpink;
            text-align: center;
            font-size: 14px;
            color: slategrey;
            }`)
    
        webix.html.addStyle(`.bignumber-value {
            background-color:lightgreen;
            text-align: center;
            font-size: 44px;
            color: teal;
            padding-top: 0px;
            }`)
    
        webix.html.addStyle(`.bignumber-comparison {
            background-color:lightgreen;
            text-align: center;
            font-size: 24px;
            color: green;
            padding-top: 0px;
        }`)

        }

    public addStyle(className: string, style:string) {
        let newStyle = `.${className}{ ${style}}`

        }

}
        ***/