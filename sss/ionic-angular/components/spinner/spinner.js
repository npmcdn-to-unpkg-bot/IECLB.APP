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
/**
 * @name Spinner
 * @description
 * The `ion-spinner` component provides a variety of animated SVG spinners.
 * Spinners enables you to give users feedback that the app is actively
 * processing/thinking/waiting/chillin’ out, or whatever you’d like it to indicate.
 * By default, the `ion-refresher` feature uses this spinner component while it's
 * the refresher is in the `refreshing` state.
 *
 * Ionic offers a handful of spinners out of the box, and by default, it will use
 * the appropriate spinner for the platform on which it’s running.
 *
 * <table class="table spinner-table">
 *  <tr>
 *    <th>
 *      <code>ios</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="ios"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>ios-small</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="ios-small"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>bubbles</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="bubbles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>circles</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="circles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>crescent</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="crescent"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>dots</code>
 *    </th>
 *    <td>
 *      <ion-spinner name="dots"></ion-spinner>
 *    </td>
 *  </tr>
 * </table>
 *
 * @usage
 * The following code would use the default spinner for the platform it's
 * running from. If it's neither iOS or Android, it'll default to use `ios`.
 *
 * ```html
 * <ion-spinner></ion-spinner>
 * ```
 *
 * By setting the `name` property, you can specify which predefined spinner to
 * use, no matter what the platform is.
 *
 * ```html
 * <ion-spinner name="bubbles"></ion-spinner>
 * ```
 *
 * ## Styling SVG with CSS
 * One cool thing about SVG is its ability to be styled with CSS! One thing to note
 * is that some of the CSS properties on an SVG element have different names. For
 * example, SVG uses the term `stroke` instead of `border`, and `fill` instead
 * of `background-color`.
 *
 * ```css
 * ion-spinner svg {
 *   width: 28px;
 *   height: 28px;
 *   stroke: #444;
 *   fill: #222;
 * }
 * ```
 */
var Spinner = (function () {
    function Spinner(_config) {
        this._config = _config;
        this._dur = null;
        /**
         * @input {string} If the animation is paused or not. Defaults to `false`.
         */
        this.paused = false;
    }
    Object.defineProperty(Spinner.prototype, "name", {
        /**
         * @input {string} SVG spinner name.
         */
        get: function () {
            return this._name;
        },
        set: function (val) {
            this._name = val;
            this.load();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinner.prototype, "duration", {
        /**
         * @input {string} How long it takes it to do one loop.
         */
        get: function () {
            return this._dur;
        },
        set: function (val) {
            this._dur = val;
            this.load();
        },
        enumerable: true,
        configurable: true
    });
    Spinner.prototype.ngOnInit = function () {
        this._init = true;
        this.load();
    };
    Spinner.prototype.load = function () {
        if (this._init) {
            this._l = [];
            this._c = [];
            var name = this._name || this._config.get('spinner', 'ios');
            var spinner = SPINNERS[name];
            if (spinner) {
                this._applied = 'spinner-' + name;
                if (spinner.lines) {
                    for (var i = 0, l = spinner.lines; i < l; i++) {
                        this._l.push(this._loadEle(spinner, i, l));
                    }
                }
                else if (spinner.circles) {
                    for (var i = 0, l = spinner.circles; i < l; i++) {
                        this._c.push(this._loadEle(spinner, i, l));
                    }
                }
            }
        }
    };
    Spinner.prototype._loadEle = function (spinner, index, total) {
        var duration = this._dur || spinner.dur;
        var data = spinner.fn(duration, index, total);
        data.style.animationDuration = duration + 'ms';
        return data;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Spinner.prototype, "name", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Spinner.prototype, "duration", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Spinner.prototype, "paused", void 0);
    Spinner = __decorate([
        core_1.Component({
            selector: 'ion-spinner',
            template: '<svg viewBox="0 0 64 64" *ngFor="#i of _c" [ngStyle]="i.style">' +
                '<circle [attr.r]="i.r" transform="translate(32,32)"></circle>' +
                '</svg>' +
                '<svg viewBox="0 0 64 64" *ngFor="#i of _l" [ngStyle]="i.style">' +
                '<line [attr.y1]="i.y1" [attr.y2]="i.y2" transform="translate(32,32)"></line>' +
                '</svg>',
            directives: [common_1.NgStyle],
            host: {
                '[class]': '_applied',
                '[class.spinner-paused]': 'paused'
            }
        }), 
        __metadata('design:paramtypes', [config_1.Config])
    ], Spinner);
    return Spinner;
}());
exports.Spinner = Spinner;
var SPINNERS = {
    ios: {
        dur: 1000,
        lines: 12,
        fn: function (dur, index, total) {
            return {
                y1: 17,
                y2: 29,
                style: {
                    transform: 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)',
                    animationDelay: -(dur - ((dur / total) * index)) + 'ms'
                }
            };
        }
    },
    'ios-small': {
        dur: 1000,
        lines: 12,
        fn: function (dur, index, total) {
            return {
                y1: 12,
                y2: 20,
                style: {
                    transform: 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)',
                    animationDelay: -(dur - ((dur / total) * index)) + 'ms'
                }
            };
        }
    },
    bubbles: {
        dur: 1000,
        circles: 9,
        fn: function (dur, index, total) {
            return {
                r: 5,
                style: {
                    top: 9 * Math.sin(2 * Math.PI * index / total),
                    left: 9 * Math.cos(2 * Math.PI * index / total),
                    animationDelay: -(dur - ((dur / total) * index)) + 'ms'
                }
            };
        }
    },
    circles: {
        dur: 1000,
        circles: 8,
        fn: function (dur, index, total) {
            return {
                r: 5,
                style: {
                    top: 9 * Math.sin(2 * Math.PI * index / total),
                    left: 9 * Math.cos(2 * Math.PI * index / total),
                    animationDelay: -(dur - ((dur / total) * index)) + 'ms'
                }
            };
        }
    },
    crescent: {
        dur: 750,
        circles: 1,
        fn: function (dur) {
            return {
                r: 26,
                style: {}
            };
        }
    },
    dots: {
        dur: 750,
        circles: 3,
        fn: function (dur, index, total) {
            return {
                r: 6,
                style: {
                    left: (9 - (9 * index)),
                    animationDelay: -(110 * index) + 'ms'
                }
            };
        }
    }
};
