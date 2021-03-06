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
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var animation_1 = require('../../animations/animation');
var transition_1 = require('../../transitions/transition');
var config_1 = require('../../config/config');
var util_1 = require('../../util/util');
var nav_params_1 = require('../nav/nav-params');
var view_controller_1 = require('../nav/view-controller');
/**
 * @name Alert
 * @description
 * An Alert is a dialog that presents users with information or collects
 * information from the user using inputs. An alert appears on top
 * of the app's content, and must be manually dismissed by the user before
 * they can resume interaction with the app. It can also optionally have a
 * `title`, `subTitle` and `message`.
 *
 * You can pass all of the alert's options in the first argument of
 * the create method: `Alert.create(opts)`. Otherwise the alert's instance
 * has methods to add options, such as `setTitle()` or `addButton()`.
 *
 *
 * ### Alert Buttons
 *
 * In the array of `buttons`, each button includes properties for its `text`,
 * and optionally a `handler`. If a handler returns `false` then the alert
 * will not automatically be dismissed when the button is clicked. All
 * buttons will show  up in the order they have been added to the `buttons`
 * array, from left to right. Note: The right most button (the last one in
 * the array) is the main button.
 *
 * Optionally, a `role` property can be added to a button, such as `cancel`.
 * If a `cancel` role is on one of the buttons, then if the alert is
 * dismissed by tapping the backdrop, then it will fire the handler from
 * the button with a cancel role.
 *
 *
 * ### Alert Inputs
 *
 * Alerts can also include several different inputs whose data can be passed
 * back to the app. Inputs can be used as a simple way to prompt users for
 * information. Radios, checkboxes and text inputs are all accepted, but they
 * cannot be mixed. For example, an alert could have all radio button inputs,
 * or all checkbox inputs, but the same alert cannot mix radio and checkbox
 * inputs. Do note however, different types of "text"" inputs can be mixed,
 * such as `url`, `email`, `text`, etc. If you require a complex form UI
 * which doesn't fit within the guidelines of an alert then we recommend
 * building the form within a modal instead.
 *
 *
 * @usage
 * ```ts
 * constructor(nav: NavController) {
 *   this.nav = nav;
 * }
 *
 * presentAlert() {
 *   let alert = Alert.create({
 *     title: 'Low battery',
 *     subTitle: '10% of battery remaining',
 *     buttons: ['Dismiss']
 *   });
 *   this.nav.present(alert);
 * }
 *
 * presentConfirm() {
 *   let alert = Alert.create({
 *     title: 'Confirm purchase',
 *     message: 'Do you want to buy this book?',
 *     buttons: [
 *       {
 *         text: 'Cancel',
 *         role: 'cancel',
 *         handler: () => {
 *           console.log('Cancel clicked');
 *         }
 *       },
 *       {
 *         text: 'Buy',
 *         handler: () => {
 *           console.log('Buy clicked');
 *         }
 *       }
 *     ]
 *   });
 *   this.nav.present(alert);
 * }
 *
 * presentPrompt() {
 *   let alert = Alert.create({
 *     title: 'Login',
 *     inputs: [
 *       {
 *         name: 'username',
 *         placeholder: 'Username'
 *       },
 *       {
 *         name: 'password',
 *         placeholder: 'Password',
 *         type: 'password'
 *       }
 *     ],
 *     buttons: [
 *       {
 *         text: 'Cancel',
 *         role: 'cancel',
 *         handler: data => {
 *           console.log('Cancel clicked');
 *         }
 *       },
 *       {
 *         text: 'Login',
 *         handler: data => {
 *           if (User.isValid(data.username, data.password)) {
 *             // logged in!
 *           } else {
 *             // invalid login
 *             return false;
 *           }
 *         }
 *       }
 *     ]
 *   });
 *   this.nav.present(alert);
 * }
 * ```
 *
 * @demo /docs/v2/demos/alert/
 */
var Alert = (function (_super) {
    __extends(Alert, _super);
    function Alert(opts) {
        if (opts === void 0) { opts = {}; }
        opts.inputs = opts.inputs || [];
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        _super.call(this, AlertCmp, opts);
        this.viewType = 'alert';
        this.isOverlay = true;
        // by default, alerts should not fire lifecycle events of other views
        // for example, when an alert enters, the current active view should
        // not fire its lifecycle events because it's not conceptually leaving
        this.fireOtherLifecycles = false;
    }
    /**
    * @private
    */
    Alert.prototype.getTransitionName = function (direction) {
        var key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * @param {string} title Alert title
     */
    Alert.prototype.setTitle = function (title) {
        this.data.title = title;
    };
    /**
     * @param {string} subTitle Alert subtitle
     */
    Alert.prototype.setSubTitle = function (subTitle) {
        this.data.subTitle = subTitle;
    };
    /**
     * @private
     */
    Alert.prototype.setBody = function (message) {
        // deprecated warning
        void 0;
        this.setMessage(message);
    };
    /**
     * @param {string} message  Alert message content
     */
    Alert.prototype.setMessage = function (message) {
        this.data.message = message;
    };
    /**
     * @param {object} input Alert input
     */
    Alert.prototype.addInput = function (input) {
        this.data.inputs.push(input);
    };
    /**
     * @param {any} button Alert button
     */
    Alert.prototype.addButton = function (button) {
        this.data.buttons.push(button);
    };
    /**
     * @param {string} cssClass CSS class name to add to the alert's outer wrapper
     */
    Alert.prototype.setCssClass = function (cssClass) {
        this.data.cssClass = cssClass;
    };
    /**
     *
     *  Alert options
     *
     *  | Property              | Type      | Description                                                               |
     *  |-----------------------|-----------|---------------------------------------------------------------------------|
     *  | title                 | `string`  | The string for the alert (optional)                                       |
     *  | subTitle              | `string`  | The subtitle for the alert (optional)                                     |
     *  | message               | `string`  | The message for the alert (optional)                                      |
     *  | cssClass              | `string`  | Any additional class for the alert (optional)                             |
     *  | inputs                | `array`   | An array of inputs for the alert. See input options. (optional)           |
     *  | buttons               | `array`   | An array of buttons for the alert. See buttons options. (optional)        |
     *  | enableBackdropDismiss | `boolean` | Wheather the alert should be dismissed by tapping the backdrop (optional) |
     *
     *
     *  Input options
     *
     *  | Property    | Type      | Description                                                     |
     *  |-------------|-----------|-----------------------------------------------------------------|
     *  | type        | `string`  | The type the input should be, text, tel, number, etc (optional) |
     *  | name        | `string`  | The name for the input (optional)                               |
     *  | placeHolder | `string`  | The input's placeholder (optional)                              |
     *  | value       | `string`  | The input's value (optional)                                    |
     *  | label       | `string`  | The input's label (optional)                                    |
     *  | checked     | `boolean` | Whether or not the input is checked or not (optional)           |
     *  | id          | `string`  | The input's id (optional)                                       |
     *
     *  Button options
     *
     *  | Property | Type     | Description                                                    |
     *  |----------|----------|----------------------------------------------------------------|
     *  | text     | `string` | The buttons displayed text                                     |
     *  | handler  | `any`    | Expression that should be evaluated when the button is pressed |
     *  | cssClass | `string` | An additional CSS class for the button                         |
     *  | role     | `string` | The buttons role, null or `cancel`                             |
     *
     * @param {object} opts Alert. See the tabel above
     */
    Alert.create = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new Alert(opts);
    };
    return Alert;
}(view_controller_1.ViewController));
exports.Alert = Alert;
/**
 * @private
 */
var AlertCmp = (function () {
    function AlertCmp(_viewCtrl, _elementRef, _config, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._elementRef = _elementRef;
        this._config = _config;
        this.d = params.data;
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(function (cssClass) {
                renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++alertIds);
        this.descId = '';
        this.hdrId = 'alert-hdr-' + this.id;
        this.subHdrId = 'alert-subhdr-' + this.id;
        this.msgId = 'alert-msg-' + this.id;
        this.activeId = '';
        this.created = Date.now();
        this.lastClick = 0;
        if (this.d.message) {
            this.descId = this.msgId;
        }
        else if (this.d.subTitle) {
            this.descId = this.subHdrId;
        }
        if (!this.d.message) {
            this.d.message = '';
        }
    }
    AlertCmp.prototype.onPageLoaded = function () {
        var _this = this;
        // normalize the data
        var data = this.d;
        if (data['body']) {
            // deprecated warning
            void 0;
            data.message = data['body'];
        }
        data.buttons = data.buttons.map(function (button) {
            if (typeof button === 'string') {
                return { text: button };
            }
            return button;
        });
        data.inputs = data.inputs.map(function (input, index) {
            return {
                type: input.type || 'text',
                name: util_1.isPresent(input.name) ? input.name : index,
                placeholder: util_1.isPresent(input.placeholder) ? input.placeholder : '',
                value: util_1.isPresent(input.value) ? input.value : '',
                label: input.label,
                checked: !!input.checked,
                id: 'alert-input-' + _this.id + '-' + index
            };
        });
        // An alert can be created with several different inputs. Radios,
        // checkboxes and inputs are all accepted, but they cannot be mixed.
        var inputTypes = [];
        data.inputs.forEach(function (input) {
            if (inputTypes.indexOf(input.type) < 0) {
                inputTypes.push(input.type);
            }
        });
        if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
            void 0;
        }
        this.inputType = inputTypes.length ? inputTypes[0] : null;
        var checkedInput = this.d.inputs.find(function (input) { return input.checked; });
        if (checkedInput) {
            this.activeId = checkedInput.id;
        }
    };
    AlertCmp.prototype._keyUp = function (ev) {
        if (this.isEnabled() && this._viewCtrl.isLast()) {
            if (ev.keyCode === 13) {
                if (this.lastClick + 1000 < Date.now()) {
                    // do not fire this click if there recently was already a click
                    // this can happen when the button has focus and used the enter
                    // key to click the button. However, both the click handler and
                    // this keyup event will fire, so only allow one of them to go.
                    void 0;
                    var button = this.d.buttons[this.d.buttons.length - 1];
                    this.btnClick(button);
                }
            }
            else if (ev.keyCode === 27) {
                void 0;
                this.bdClick();
            }
        }
    };
    AlertCmp.prototype.onPageDidEnter = function () {
        var activeElement = document.activeElement;
        if (document.activeElement) {
            activeElement.blur();
        }
        var focusableEle = this._elementRef.nativeElement.querySelector('input,button');
        if (focusableEle) {
            focusableEle.focus();
        }
    };
    AlertCmp.prototype.btnClick = function (button, dismissDelay) {
        var _this = this;
        if (!this.isEnabled()) {
            return;
        }
        // keep the time of the most recent button click
        this.lastClick = Date.now();
        var shouldDismiss = true;
        if (button.handler) {
            // a handler has been provided, execute it
            // pass the handler the values from the inputs
            if (button.handler(this.getValues()) === false) {
                // if the return value of the handler is false then do not dismiss
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            setTimeout(function () {
                _this.dismiss(button.role);
            }, dismissDelay || this._config.get('pageTransitionDelay'));
        }
    };
    AlertCmp.prototype.rbClick = function (checkedInput) {
        if (this.isEnabled()) {
            this.d.inputs.forEach(function (input) {
                input.checked = (checkedInput === input);
            });
            this.activeId = checkedInput.id;
        }
    };
    AlertCmp.prototype.cbClick = function (checkedInput) {
        if (this.isEnabled()) {
            checkedInput.checked = !checkedInput.checked;
        }
    };
    AlertCmp.prototype.bdClick = function () {
        if (this.isEnabled() && this.d.enableBackdropDismiss) {
            var cancelBtn = this.d.buttons.find(function (b) { return b.role === 'cancel'; });
            if (cancelBtn) {
                this.btnClick(cancelBtn, 1);
            }
            else {
                this.dismiss('backdrop');
            }
        }
    };
    AlertCmp.prototype.dismiss = function (role) {
        return this._viewCtrl.dismiss(this.getValues(), role);
    };
    AlertCmp.prototype.getValues = function () {
        if (this.inputType === 'radio') {
            // this is an alert with radio buttons (single value select)
            // return the one value which is checked, otherwise undefined
            var checkedInput = this.d.inputs.find(function (i) { return i.checked; });
            return checkedInput ? checkedInput.value : undefined;
        }
        if (this.inputType === 'checkbox') {
            // this is an alert with checkboxes (multiple value select)
            // return an array of all the checked values
            return this.d.inputs.filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
        }
        // this is an alert with text inputs
        // return an object of all the values with the input name as the key
        var values = {};
        this.d.inputs.forEach(function (i) {
            values[i.name] = i.value;
        });
        return values;
    };
    AlertCmp.prototype.isEnabled = function () {
        var tm = this._config.getNumber('overlayCreatedDiff', 750);
        return (this.created + tm < Date.now());
    };
    __decorate([
        core_1.HostListener('body:keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], AlertCmp.prototype, "_keyUp", null);
    AlertCmp = __decorate([
        core_1.Component({
            selector: 'ion-alert',
            template: '<div (click)="bdClick()" tappable disable-activated class="backdrop" role="presentation"></div>' +
                '<div class="alert-wrapper">' +
                '<div class="alert-head">' +
                '<h2 id="{{hdrId}}" class="alert-title" *ngIf="d.title" [innerHTML]="d.title"></h2>' +
                '<h3 id="{{subHdrId}}" class="alert-sub-title" *ngIf="d.subTitle" [innerHTML]="d.subTitle"></h3>' +
                '</div>' +
                '<div id="{{msgId}}" class="alert-message" [innerHTML]="d.message"></div>' +
                '<div *ngIf="d.inputs.length" [ngSwitch]="inputType">' +
                '<template ngSwitchWhen="radio">' +
                '<div class="alert-radio-group" role="radiogroup" [attr.aria-labelledby]="hdrId" [attr.aria-activedescendant]="activeId">' +
                '<button *ngFor="#i of d.inputs" (click)="rbClick(i)" [attr.aria-checked]="i.checked" [attr.id]="i.id" class="alert-tappable alert-radio" role="radio">' +
                '<div class="alert-radio-icon"><div class="alert-radio-inner"></div></div>' +
                '<div class="alert-radio-label">' +
                '{{i.label}}' +
                '</div>' +
                '</button>' +
                '</div>' +
                '</template>' +
                '<template ngSwitchWhen="checkbox">' +
                '<div class="alert-checkbox-group">' +
                '<button *ngFor="#i of d.inputs" (click)="cbClick(i)" [attr.aria-checked]="i.checked" class="alert-tappable alert-checkbox" role="checkbox">' +
                '<div class="alert-checkbox-icon"><div class="alert-checkbox-inner"></div></div>' +
                '<div class="alert-checkbox-label">' +
                '{{i.label}}' +
                '</div>' +
                '</button>' +
                '</div>' +
                '</template>' +
                '<template ngSwitchDefault>' +
                '<div class="alert-input-group">' +
                '<div *ngFor="#i of d.inputs" class="alert-input-wrapper">' +
                '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" class="alert-input">' +
                '</div>' +
                '</div>' +
                '</template>' +
                '</div>' +
                '<div class="alert-button-group" [ngClass]="{vertical: d.buttons.length>2}">' +
                '<button *ngFor="#b of d.buttons" (click)="btnClick(b)" [ngClass]="b.cssClass" class="alert-button">' +
                '{{b.text}}' +
                '<ion-button-effect></ion-button-effect>' +
                '</button>' +
                '</div>' +
                '</div>',
            host: {
                'role': 'dialog',
                '[attr.aria-labelledby]': 'hdrId',
                '[attr.aria-describedby]': 'descId'
            },
            directives: [common_1.NgClass, common_1.NgSwitch, common_1.NgIf, common_1.NgFor]
        }), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, core_1.ElementRef, config_1.Config, nav_params_1.NavParams, core_1.Renderer])
    ], AlertCmp);
    return AlertCmp;
}());
/**
 * Animations for alerts
 */
var AlertPopIn = (function (_super) {
    __extends(AlertPopIn, _super);
    function AlertPopIn(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
        backdrop.fromTo('opacity', '0.01', '0.3');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertPopIn;
}(transition_1.Transition));
transition_1.Transition.register('alert-pop-in', AlertPopIn);
var AlertPopOut = (function (_super) {
    __extends(AlertPopOut, _super);
    function AlertPopOut(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
        backdrop.fromTo('opacity', '0.3', '0');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertPopOut;
}(transition_1.Transition));
transition_1.Transition.register('alert-pop-out', AlertPopOut);
var AlertMdPopIn = (function (_super) {
    __extends(AlertMdPopIn, _super);
    function AlertMdPopIn(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
        backdrop.fromTo('opacity', '0.01', '0.5');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertMdPopIn;
}(transition_1.Transition));
transition_1.Transition.register('alert-md-pop-in', AlertMdPopIn);
var AlertMdPopOut = (function (_super) {
    __extends(AlertMdPopOut, _super);
    function AlertMdPopOut(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
        backdrop.fromTo('opacity', '0.5', '0');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertMdPopOut;
}(transition_1.Transition));
transition_1.Transition.register('alert-md-pop-out', AlertMdPopOut);
var AlertWpPopIn = (function (_super) {
    __extends(AlertWpPopIn, _super);
    function AlertWpPopIn(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
        backdrop.fromTo('opacity', '0.01', '0.5');
        this
            .easing('cubic-bezier(0,0 0.05,1)')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertWpPopIn;
}(transition_1.Transition));
transition_1.Transition.register('alert-wp-pop-in', AlertWpPopIn);
var AlertWpPopOut = (function (_super) {
    __extends(AlertWpPopOut, _super);
    function AlertWpPopOut(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
        backdrop.fromTo('opacity', '0.5', '0');
        this
            .easing('ease-out')
            .duration(150)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertWpPopOut;
}(transition_1.Transition));
transition_1.Transition.register('alert-wp-pop-out', AlertWpPopOut);
var alertIds = -1;
