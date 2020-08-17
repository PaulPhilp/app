
export function createBignumberComponent(): void {
    console.log(`createBignumberComponent()`)

    let subtitle: string = "Subtitle"
    let api = {
        name: "bignumber",

        //default values for configuration settings
        defaults: {
                // title: "Title",
                // titleColor: "teal",

                // subtitle: subtitle,
                // subtitleColor: "red",

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

                let templateFn = (obj, common, index) => {
                    console.log(`templateFunction()`)
                    console.log(obj)

                    let customerStatus = obj.customer_status.toUpperCase()
                    let diff = obj.count - obj.prevCount
                    let diffTemplate = ""
                    if (diff > 0)
                        diffTemplate = `<span class='webix_icon mdi mdi-arrow-up'></span> ${diff}`
                    else if (diff < 0)
                        diffTemplate = `<span class='webix_icon mdi mdi-arrow-down'></span> ${diff}`

                    let template = `<div>` + 
                            `<div class='bignumber-title'>${customerStatus}</div>`+
                            `<div class='bignumber-subtitle'>${this.config.subtitle}</div>`+
                            `<br />`+
                            `<div class='bignumber-value'>${obj.count}</div>` +
                            `<br />`+
                            `<div class='bignumber-comparison'>${diffTemplate}</div>` +
                            `</div>`
                    return template
                    }

                this.$view.className += " bignumber";

                this.attachEvent("onClick", function(id){
                        this.select(id);
                        });
                },  

    // logic on ready
    $ready:function(){
        console.log(`bignumber.$ready()`)
    },

    // logic on ready
    $render: function() {
        console.log(`bignumber.$render()`)
    },

    // function to process configuration settings
    value_setter: function() {}, 
    subtitle_setter: function(subtitle) { this.subtitle = subtitle} 
    }

    webix.protoUI(api, webix.ui.dataview)
    }

class bigNumberView {

}