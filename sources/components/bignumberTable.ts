export function createBignumberTableComponent(): void { 

    let api = {
        name: "bignumbertable",
        default: {
        height: 175,
        width: 175,
        rows: [{ 
                borderless: true,
                view: "bignumber",
                title: {
                    label: "Active",
                    color: "teal",
                    "font-weight": "900"
                    },
                subtitle: {
                    label: "active accounts",
                    color: "slategrey"
                    },
                value: {
                    field: "count",
                    color: "teal",
                    format: "0"
                    },
                diff: {
                    color: "navy",
                    "negative-color": "red",
                    label: "accounts",
                    "font-size": "14px",
                    },
                data: []
                },
        // {subview: true},
            /***
        view:"datatable",
        hidden:true,
        columns:[
            { id:"rank",	header:"", css:"rank",  		width:50},
            { id:"title",	header:"Film title",width:200},
            { id:"year",	header:"Released" , width:80},
            { id:"votes",	header:"Votes", 	width:100}
        ],
        autoheight:true,
        autowidth:true,
        data: [
            { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1},
            { id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2}
            ]

        ***/
        ]
    },

    $init: function(config){
        console.log(`bignumbertable.$init()`)
        console.log(config)
        this.$view.className += " bignumbertable";
        console.log(`bignumbertable.$init(DONE)`)
        }
    }

    webix.html.addStyle(`.bignumbertable {
        background-color:transparent
        background-opacity:
        border-style: solid;
        border-color: slategrey;
        }`)

    webix.html.addStyle(`.bignumbertable.webix_selected {
        background-color:white
        border-style: solid;
        border-width: 3px;
        border-color: orange;
        }`)

    webix.html.addStyle(`.bignumbertable-title {
        background-color:transparent;
        text-align: center;
        text-decoration: none;
        font-size: 24px;
        color: royalblue;
        margin-top: 10px;
        padding-top: 0px;
        }`)

    webix.html.addStyle(`.bignumbertable-subtitle {
        background-color:transparent;
        text-align: center;
        text-decoration: none;
		font-size: 14px;
        color: darkgrey;
        paddding-bottom: 10px;
        }`)

    webix.html.addStyle(`.bignumbertable-value {
        background-color:transparent;
        text-align: center;
        font-size: 44px;
        color: darkgrey;
        padding-top: 0px;
        }`)

    webix.html.addStyle(`.bignumbertable-comparison {
        background-color:transparent;
        text-align: center;
        font-size: 24px;
        color: royalblue;
        negative-color: red;
        padding-top: 0px;
        }`)

webix.protoUI(api, webix.ui.layout)
}