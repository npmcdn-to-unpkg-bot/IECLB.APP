"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var app_1 = require('../app/app');
var config_1 = require('../../config/config');
var keyboard_1 = require('../../util/keyboard');
var nav_controller_1 = require('./nav-controller');
var view_controller_1 = require('./view-controller');
/**
 * @private
 */
var Portal = (function (_super) {
    __extends(Portal, _super);
    function Portal(hostNavCtrl, viewCtrl, app, config, keyboard, elementRef, compiler, viewManager, zone, renderer) {
        _super.call(this, hostNavCtrl, app, config, keyboard, elementRef, null, compiler, viewManager, zone, renderer);
        this.isPortal = true;
    }
    Portal = __decorate([
        core_1.Directive({
            selector: '[portal]'
        }),
        __param(0, core_1.Optional()),
        __param(1, core_1.Optional()), 
        __metadata('design:paramtypes', [nav_controller_1.NavController, view_controller_1.ViewController, app_1.IonicApp, config_1.Config, keyboard_1.Keyboard, core_1.ElementRef, core_1.Compiler, core_1.AppViewManager, core_1.NgZone, core_1.Renderer])
    ], Portal);
    return Portal;
}(nav_controller_1.NavController));
exports.Portal = Portal;
