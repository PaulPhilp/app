"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var webix_jet_1 = require("webix-jet");
var AmityApp = /** @class */ (function (_super) {
    __extends(AmityApp, _super);
    function AmityApp(config) {
        var _this = _super.call(this, config) || this;
        _this.name = config.name;
        return _this;
    }
    AmityApp.prototype.start = function () { };
    AmityApp.prototype.launchWidget = function () { };
    AmityApp.prototype.destructor = function () { };
    return AmityApp;
}(webix_jet_1.JetApp));
