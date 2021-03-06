"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var config_1 = require('../../config/config');
var icon_1 = require('../icon/icon');
var refresher_1 = require('./refresher');
var spinner_1 = require('../spinner/spinner');
/**
 * @private
 */
var RefresherContent = (function () {
    function RefresherContent(r, _config) {
        this.r = r;
        this._config = _config;
    }
    /**
     * @private
     */
    RefresherContent.prototype.ngOnInit = function () {
        if (!this.pullingIcon) {
            this.pullingIcon = this._config.get('refresherPullingIcon', 'arrow-down');
        }
        if (!this.refreshingSpinner) {
            this.refreshingSpinner = this._config.get('refresherRefreshingSpinner', this._config.get('spinner', 'ios'));
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RefresherContent.prototype, "pullingIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RefresherContent.prototype, "pullingText", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RefresherContent.prototype, "refreshingSpinner", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RefresherContent.prototype, "refreshingText", void 0);
    RefresherContent = __decorate([
        core_1.Component({
            selector: 'ion-refresher-content',
            template: '<div class="refresher-pulling">' +
                '<div class="refresher-pulling-icon" *ngIf="pullingIcon">' +
                '<ion-icon [name]="pullingIcon"></ion-icon>' +
                '</div>' +
                '<div class="refresher-pulling-text" [innerHTML]="pullingText" *ngIf="pullingText"></div>' +
                '</div>' +
                '<div class="refresher-refreshing">' +
                '<div class="refresher-refreshing-icon">' +
                '<ion-spinner [name]="refreshingSpinner"></ion-spinner>' +
                '</div>' +
                '<div class="refresher-refreshing-text" [innerHTML]="refreshingText" *ngIf="refreshingText"></div>' +
                '</div>',
            directives: [common_1.NgIf, icon_1.Icon, spinner_1.Spinner],
            host: {
                '[attr.state]': 'r.state'
            }
        }), 
        __metadata('design:paramtypes', [refresher_1.Refresher, config_1.Config])
    ], RefresherContent);
    return RefresherContent;
}());
exports.RefresherContent = RefresherContent;
