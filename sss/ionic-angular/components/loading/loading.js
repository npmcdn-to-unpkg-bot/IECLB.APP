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
var spinner_1 = require('../spinner/spinner');
var util_1 = require('../../util/util');
var nav_params_1 = require('../nav/nav-params');
var view_controller_1 = require('../nav/view-controller');
/**
 * @name Loading
 * @description
 * An overlay that can be used to indicate activity while blocking user
 * interaction. The loading indicator appears on top of the app's content,
 * and can be dismissed by the app to resume user interaction with
 * the app. It includes an optional backdrop, which can be disabled
 * by setting `showBackdrop: false` upon creation.
 *
 * ### Creating
 * You can pass all of the loading options in the first argument of
 * the create method: `Loading.create(opts)`. The spinner name should be
 * passed in the `spinner` property, and any optional HTML can be passed
 * in the `content` property. If you do not pass a value to `spinner`
 * the loading indicator will use the spinner specified by the mode. To
 * set the spinner name across the app, set the value of `loadingSpinner`
 * in your app's config. To hide the spinner, set `loadingSpinner: 'hide'`
 * in the apps' config or pass `spinner: 'hide'` in the loading
 * options. See the create method below for all available options.
 *
 * ### Dismissing
 * The loading indicator can be dismissed automatically after a specific
 * amount of time by passing the number of milliseconds to display it in
 * the `duration` of the loading options. By default the loading indicator
 * will show even during page changes, but this can be disabled by setting
 * `dismissOnPageChange` to `true`. To dismiss the loading indicator after
 * creation, call the `dismiss()` method on the Loading instance.
 *
 * ### Limitations
 * The element is styled to appear on top of other content by setting its
 * `z-index` property. You must ensure no element has a stacking context with
 * a higher `z-index` than this element.
 *
 * @usage
 * ```ts
 * constructor(nav: NavController) {
 *   this.nav = nav;
 * }
 *
 * presentLoadingDefault() {
 *   let loading = Loading.create({
 *     content: 'Please wait...'
 *   });
 *
 *   this.nav.present(loading);
 *
 *   setTimeout(() => {
 *     loading.dismiss();
 *   }, 5000);
 * }
 *
 * presentLoadingCustom() {
 *   let loading = Loading.create({
 *     spinner: 'hide',
 *     content: `
 *       <div class="custom-spinner-container">
 *         <div class="custom-spinner-box"></div>
 *       </div>`,
 *     duration: 5000
 *   });
 *
 *   this.nav.present(loading);
 * }
 *
 * presentLoadingText() {
 *   let loading = Loading.create({
 *     spinner: 'hide',
 *     content: 'Loading Please Wait...'
 *   });
 *
 *   this.nav.present(loading);
 *
 *   setTimeout(() => {
 *     this.nav.push(Page2);
 *   }, 1000);
 *
 *   setTimeout(() => {
 *     loading.dismiss();
 *   }, 5000);
 * }
 * ```
 *
 * @demo /docs/v2/demos/loading/
 * @see {@link /docs/v2/api/components/spinner/Spinner Spinner API Docs}
 */
var Loading = (function (_super) {
    __extends(Loading, _super);
    function Loading(opts) {
        if (opts === void 0) { opts = {}; }
        opts.showBackdrop = util_1.isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.dismissOnPageChange = util_1.isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
        _super.call(this, LoadingCmp, opts);
        this.viewType = 'loading';
        this.isOverlay = true;
        this.usePortal = true;
        // by default, loading indicators should not fire lifecycle events of other views
        // for example, when an loading indicators enters, the current active view should
        // not fire its lifecycle events because it's not conceptually leaving
        this.fireOtherLifecycles = false;
    }
    /**
    * @private
    */
    Loading.prototype.getTransitionName = function (direction) {
        var key = (direction === 'back' ? 'loadingLeave' : 'loadingEnter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * Create a loading indicator with the following options
     *
     * | Option                | Type       | Description                                                                                                      |
     * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
     * | spinner               |`string`    | The name of the SVG spinner for the loading indicator.                                                                           |
     * | content               |`string`    | The html content for the loading indicator.                                                                      |
     * | cssClass              |`string`    | An additional class for custom styles.                                                                           |
     * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
     * | dismissOnPageChange   |`boolean`   | Whether to dismiss the indicator when navigating to a new page. Default false.                                   |
     * | duration              |`number`    | How many milliseconds to wait before hiding the indicator. By default, it will show until `hide()` is called.    |
     *
     *
     * @param {object} opts Loading options
     */
    Loading.create = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new Loading(opts);
    };
    return Loading;
}(view_controller_1.ViewController));
exports.Loading = Loading;
/**
* @private
*/
var LoadingCmp = (function () {
    function LoadingCmp(_viewCtrl, _config, _elementRef, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._config = _config;
        this._elementRef = _elementRef;
        this.d = params.data;
        this.created = Date.now();
        if (this.d.cssClass) {
            renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
        }
        this.id = (++loadingIds);
    }
    LoadingCmp.prototype.ngOnInit = function () {
        // If no spinner was passed in loading options we need to fall back
        // to the loadingSpinner in the app's config, then the mode spinner
        if (util_1.isUndefined(this.d.spinner)) {
            this.d.spinner = this._config.get('loadingSpinner', this._config.get('spinner', 'ios'));
        }
        // If the user passed hide to the spinner we don't want to show it
        this.showSpinner = util_1.isDefined(this.d.spinner) && this.d.spinner !== 'hide';
    };
    LoadingCmp.prototype.onPageDidEnter = function () {
        var _this = this;
        var activeElement = document.activeElement;
        if (document.activeElement) {
            activeElement.blur();
        }
        // If there is a duration, dismiss after that amount of time
        this.d.duration ? setTimeout(function () { return _this.dismiss('backdrop'); }, this.d.duration) : null;
    };
    LoadingCmp.prototype.dismiss = function (role) {
        return this._viewCtrl.dismiss(null, role);
    };
    LoadingCmp.prototype.isEnabled = function () {
        var tm = this._config.getNumber('overlayCreatedDiff', 750);
        return (this.created + tm < Date.now());
    };
    LoadingCmp = __decorate([
        core_1.Component({
            selector: 'ion-loading',
            template: '<div disable-activated class="backdrop" [class.hide-backdrop]="!d.showBackdrop" role="presentation"></div>' +
                '<div class="loading-wrapper">' +
                '<div *ngIf="showSpinner" class="loading-spinner">' +
                '<ion-spinner [name]="d.spinner"></ion-spinner>' +
                '</div>' +
                '<div *ngIf="d.content" [innerHTML]="d.content" class="loading-content"></div>' +
                '</div>',
            host: {
                'role': 'dialog'
            },
            directives: [common_1.NgIf, spinner_1.Spinner]
        }), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, config_1.Config, core_1.ElementRef, nav_params_1.NavParams, core_1.Renderer])
    ], LoadingCmp);
    return LoadingCmp;
}());
/**
 * Animations for loading
 */
var LoadingPopIn = (function (_super) {
    __extends(LoadingPopIn, _super);
    function LoadingPopIn(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
        backdrop.fromTo('opacity', '0.01', '0.3');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingPopIn;
}(transition_1.Transition));
transition_1.Transition.register('loading-pop-in', LoadingPopIn);
var LoadingPopOut = (function (_super) {
    __extends(LoadingPopOut, _super);
    function LoadingPopOut(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
        backdrop.fromTo('opacity', '0.3', '0');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingPopOut;
}(transition_1.Transition));
transition_1.Transition.register('loading-pop-out', LoadingPopOut);
var LoadingMdPopIn = (function (_super) {
    __extends(LoadingMdPopIn, _super);
    function LoadingMdPopIn(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
        backdrop.fromTo('opacity', '0.01', '0.50');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingMdPopIn;
}(transition_1.Transition));
transition_1.Transition.register('loading-md-pop-in', LoadingMdPopIn);
var LoadingMdPopOut = (function (_super) {
    __extends(LoadingMdPopOut, _super);
    function LoadingMdPopOut(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
        backdrop.fromTo('opacity', '0.50', '0');
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingMdPopOut;
}(transition_1.Transition));
transition_1.Transition.register('loading-md-pop-out', LoadingMdPopOut);
var LoadingWpPopIn = (function (_super) {
    __extends(LoadingWpPopIn, _super);
    function LoadingWpPopIn(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
        backdrop.fromTo('opacity', '0.01', '0.16');
        this
            .easing('cubic-bezier(0,0 0.05,1)')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingWpPopIn;
}(transition_1.Transition));
transition_1.Transition.register('loading-wp-pop-in', LoadingWpPopIn);
var LoadingWpPopOut = (function (_super) {
    __extends(LoadingWpPopOut, _super);
    function LoadingWpPopOut(enteringView, leavingView, opts) {
        _super.call(this, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('.backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
        backdrop.fromTo('opacity', '0.16', '0');
        this
            .easing('ease-out')
            .duration(150)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingWpPopOut;
}(transition_1.Transition));
transition_1.Transition.register('loading-wp-pop-out', LoadingWpPopOut);
var loadingIds = -1;
