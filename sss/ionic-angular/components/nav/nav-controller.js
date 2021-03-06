"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('angular2/core');
var instrumentation_1 = require('angular2/instrumentation');
var ion_1 = require('../ion');
var nav_params_1 = require('./nav-params');
var util_1 = require('../../util/util');
var swipe_back_1 = require('./swipe-back');
var transition_1 = require('../../transitions/transition');
var view_controller_1 = require('./view-controller');
/**
 * @name NavController
 * @description
 * _For examples on the basic usage of NavController, check out the
 * [Navigation section](../../../../components/#navigation) of the Component
 * docs._
 *
 * NavController is the base class for navigation controller components like
 * [`Nav`](../Nav/) and [`Tab`](../../Tabs/Tab/). You use navigation controllers
 * to navigate to [pages](#creating_pages) in your app. At a basic level, a
 * navigation controller is an array of pages representing a particular history
 * (of a Tab for example). This array can be manipulated to navigate throughout
 * an app by pushing and popping pages or inserting and removing them at
 * arbitrary locations in history.
 *
 * The current page is the last one in the array, or the top of the stack if we
 * think of it that way.  [Pushing](#push) a new page onto the top of the
 * navigation stack causes the new page to be animated in, while [popping](#pop)
 * the current page will navigate to the previous page in the stack.
 *
 * Unless you are using a directive like [NavPush](../NavPush/), or need a
 * specific NavController, most times you will inject and use a reference to the
 * nearest NavController to manipulate the navigation stack.
 *
 * <h3 id="injecting_nav_controller">Injecting NavController</h3>
 * Injecting NavController will always get you an instance of the nearest
 * NavController, regardless of whether it is a Tab or a Nav.
 *
 * Behind the scenes, when Ionic instantiates a new NavController, it creates an
 * injector with NavController bound to that instance (usually either a Nav or
 * Tab) and adds the injector to its own providers.  For more information on
 * providers and dependency injection, see [Providers and DI]().
 *
 * Instead, you can inject NavController and know that it is the correct
 * navigation controller for most situations (for more advanced situations, see
 * [Menu](../../Menu/Menu/) and [Tab](../../Tab/Tab/)).
 *
 * ```ts
 *  class MyComponent {
 *    constructor(nav: NavController) {
 *      this.nav = nav;
 *    }
 *  }
 * ```
 *
 * <h2 id="creating_pages">Page creation</h2>
 * _For more information on the `@Page` decorator see the [@Page API
 * reference](../../../decorators/Page/)._
 *
 * Pages are created when they are added to the navigation stack.  For methods
 * like [push()](#push), the NavController takes any component class that is
 * decorated with `@Page` as its first argument.  The NavController then
 * compiles that component, adds it to the app and animates it into view.
 *
 * By default, pages are cached and left in the DOM if they are navigated away
 * from but still in the navigation stack (the exiting page on a `push()` for
 * example).  They are destroyed when removed from the navigation stack (on
 * [pop()](#pop) or [setRoot()](#setRoot)).
 *
 *
 * <h2 id="Lifecycle">Lifecycle events</h2>
 * Lifecycle events are fired during various stages of navigation.  They can be
 * defined in any `@Page` decorated component class.
 *
 * ```ts
 * @Page({
 *   template: 'Hello World'
 * })
 * class HelloWorld {
 *   onPageLoaded() {
 *     console.log("I'm alive!");
 *   }
 *   onPageWillLeave() {
 *     console.log("Looks like I'm about to leave :(");
 *   }
 * }
 * ```
 *
 *
 *
 * - `onPageLoaded` - Runs when the page has loaded. This event only happens once per page being created and added to the DOM. If a page leaves but is cached, then this event will not fire again on a subsequent viewing. The `onPageLoaded` event is good place to put your setup code for the page.
 * - `onPageWillEnter` - Runs when the page is about to enter and become the active page.
 * - `onPageDidEnter` - Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.
 * - `onPageWillLeave` - Runs when the page is about to leave and no longer be the active page.
 * - `onPageDidLeave` - Runs when the page has finished leaving and is no longer the active page.
 * - `onPageWillUnload` - Runs when the page is about to be destroyed and have its elements removed.
 * - `onPageDidUnload` - Runs after the page has been destroyed and its elements have been removed.
 *
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 */
var NavController = (function (_super) {
    __extends(NavController, _super);
    function NavController(parent, _app, config, _keyboard, elementRef, _anchorName, _compiler, _viewManager, _zone, _renderer) {
        _super.call(this, elementRef);
        this._app = _app;
        this._keyboard = _keyboard;
        this._anchorName = _anchorName;
        this._compiler = _compiler;
        this._viewManager = _viewManager;
        this._zone = _zone;
        this._renderer = _renderer;
        this._transIds = 0;
        this._init = false;
        this._ids = -1;
        this._trnsTime = 0;
        this._views = [];
        /**
         * @private
         */
        this.routers = [];
        /**
         * @private
         */
        this.isPortal = false;
        this.parent = parent;
        this.config = config;
        this._trnsDelay = config.get('pageTransitionDelay');
        this._sbEnabled = config.getBoolean('swipeBackEnabled') || false;
        this._sbThreshold = config.get('swipeBackThreshold') || 40;
        this.id = (++ctrlIds).toString();
        // build a new injector for child ViewControllers to use
        this.providers = core_1.Injector.resolve([
            core_1.provide(NavController, { useValue: this })
        ]);
    }
    NavController.prototype.setPortal = function (val) {
        this._portal = val;
    };
    /**
     * Set the root for the current navigation stack
     * @param {Type} page  The name of the component you want to push on the navigation stack
     * @param {object} [params={}] Any nav-params you want to pass along to the next view
     * @param {object} [opts={}] Any options you want to use pass to transtion
     * @returns {Promise} Returns a promise when done
     */
    NavController.prototype.setRoot = function (page, params, opts) {
        return this.setPages([{ page: page, params: params }], opts);
    };
    /**
     * You can set the views of the current navigation stack and navigate to the last view past
     *
     *
     *```typescript
     * import {Page, NavController} from 'ionic-angular'
     * import {Detail} from '../detail/detail'
     * import {Info} from '../info/info'
     *
     *  export class Home {
     *    constructor(nav: NavController) {
     *      this.nav = nav;
     *    }
     *    setPages() {
     *      this.nav.setPages([ {page: List}, {page: Detail}, {page:Info} ]);
     *    }
     *  }
     *```
     *
     *
     *In this example, we're giving the current nav stack an array of pages. Then the navigation stack will navigate to the last view in the array and remove the orignal view you came from.
     *
     * By default, animations are disabled, but they can be enabled by passing options to the navigation controller
     *
     *
     *```typescript
     * import {Page, NavController} from 'ionic-angular'
     * import {Detail} from '../detail/detail'
     *
     *  export class Home {
     *    constructor(nav: NavController) {
     *      this.nav = nav;
     *    }
     *    setPages() {
     *      this.nav.setPages([ {page: List}, {page: Detail} ], {
     *        animate: true
     *      });
     *    }
     *  }
     *```
     *
     *
     *You can also pass any navigation params to the individual pages in the array.
     *
     *
     *```typescript
     * import {Page, NavController} from 'ionic-angular';
     * import {Info} from '../info/info';
     * import {List} from '../list/list';
     * import {Detail} from '../detail/detail';
     *
     *  export class Home {
     *    constructor(nav: NavController) {
     *      this.nav = nav;
     *    }
     *    setPages() {
     *      this.nav.setPages([{
     *        page: Info
     *      }, {
     *        page: List,
     *        params: {tags: 'css'}
     *      }, {
     *        page: Detail,
     *        params: {id: 325}
     *      }]);
     *    }
     *  }
     *```
     *
     * @param {array<Type>} pages  An arry of page components and their params to load in the stack
     * @param {object} [opts={}] Any options you want to use pass
     * @returns {Promise} Returns a promise when the pages are set
     */
    NavController.prototype.setPages = function (pages, opts) {
        if (!pages || !pages.length) {
            return Promise.resolve(false);
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        // deprecated warning
        pages.forEach(function (pg) {
            if (pg['componentType']) {
                pg.page = pg['componentType'];
                void 0;
            }
            else if (!pg['page']) {
                void 0;
            }
        });
        // remove existing views
        var leavingView = this._remove(0, this._views.length);
        // create view controllers out of the pages and insert the new views
        var views = pages.map(function (p) { return new view_controller_1.ViewController(p.page, p.params); });
        var enteringView = this._insert(0, views);
        // if animation wasn't set to true then default it to NOT animate
        if (opts.animate !== true) {
            opts.animate = false;
        }
        // set the nav direction to "back" if it wasn't set
        opts.direction = opts.direction || 'back';
        var resolve;
        var promise = new Promise(function (res) { resolve = res; });
        // start the transition, fire resolve when done...
        this._transition(enteringView, leavingView, opts, function (hasCompleted) {
            // transition has completed!!
            resolve(hasCompleted);
        });
        return promise;
    };
    /**
     * @private
     */
    NavController.prototype.setViews = function (components, opts) {
        void 0;
        return this.setPages(components, opts);
    };
    /**
     * Push is how we can pass components and navigate to them. We push the component we want to navigate to on to the navigation stack.
     *
     * ```typescript
     * class MyClass{
     *    constructor(nav:NavController){
     *      this.nav = nav;
     *    }
     *
     *    pushPage(){
     *      this.nav.push(SecondView);
     *    }
     * }
     * ```
     *
     * We can also pass along parameters to the next view, such as data that we have on the current view. This is a similar concept to to V1 apps with `$stateParams`.
     *
     * ```typescript
     * class MyClass{
     *    constructor(nav:NavController){
     *      this.nav = nav;
     *    }
     *
     *    pushPage(user){
     *      this.nav.push(SecondView,{
     *       // user is an object we have in our view
     *       // typically this comes from an ngFor or some array
     *       // here we can create an object with a property of
     *       // paramUser, and set it's value to the user object we passed in
     *       paramUser: user
     *      });
     *    }
     * }
     * ```
     *
     * We'll look at how we can access that data in the `SecondView` in the navParam docs
     *
     * We can also pass any options to the transtion from that same method
     *
     * ```typescript
     * class MyClass{
     *    constructor(nav: NavController){
     *      this.nav = nav;
     *    }
     *
     *    pushPage(user){
     *      this.nav.push(SecondView,{
     *       // user is an object we have in our view
     *       // typically this comes from an ngFor or some array
     *       // here we can create an object with a property of
     *       // paramUser, and set it's value to the user object we passed in
     *       paramUser: user
     *      },{
     *       // here we can configure things like the animations direction or
     *       // or if the view should animate at all.
     *       direction: 'back'
     *      });
     *    }
     * }
     * ```
     * @param {Type} page  The page component class you want to push on to the navigation stack
     * @param {object} [params={}] Any nav-params you want to pass along to the next view
     * @param {object} [opts={}] Any options you want to use pass to transtion
     * @returns {Promise} Returns a promise, which resolves when the transition has completed
     */
    NavController.prototype.push = function (page, params, opts) {
        return this.insertPages(-1, [{ page: page, params: params }], opts);
    };
    /**
     * Present is how we display overlays on top of the content, from within the
     * root level `NavController`. The `present` method is used by overlays, such
     * as `ActionSheet`, `Alert`, and `Modal`. The main difference between `push`
     * and `present`, is that `present` takes a `ViewController` instance, whereas
     * `push` takes a `Page` component class. Additionally, `present` will place
     * the overlay in the root NavController's stack.
     *
     * ```typescript
     * class MyClass{
     *    constructor(nav: NavController) {
     *      this.nav = nav;
     *    }
     *
     *    presentModal() {
     *      let modal = Modal.create(ProfilePage);
     *      this.nav.present(modal);
     *    }
     * }
     * ```
     *
     * @param {ViewController} enteringView The name of the component you want to push on the navigation stack
     * @param {object} [opts={}] Any options you want to use pass to transtion
     * @returns {Promise} Returns a promise, which resolves when the transition has completed
     */
    NavController.prototype.present = function (enteringView, opts) {
        var rootNav = this.rootNav;
        if (rootNav['_tabs']) {
            // TODO: must have until this goes in
            // https://github.com/angular/angular/issues/5481
            void 0;
            return;
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        if (enteringView.usePortal && this._portal) {
            return this._portal.present(enteringView, opts);
        }
        enteringView.setNav(rootNav);
        opts.keyboardClose = false;
        opts.direction = 'forward';
        if (!opts.animation) {
            opts.animation = enteringView.getTransitionName('forward');
        }
        enteringView.setLeavingOpts({
            keyboardClose: false,
            direction: 'back',
            animation: enteringView.getTransitionName('back')
        });
        // start the transition
        return rootNav._insertViews(-1, [enteringView], opts);
    };
    /**
     * Inserts a view into the nav stack at the specified index.
     * This is useful if you need to add a view at any point in your navigation stack
     *
     * ```typescript
     * export class Detail {
     *    constructor(nav: NavController) {
     *      this.nav = nav;
     *    }
     *    insertPage(){
     *      this.nav.insert(1, Info);
     *    }
     *  }
     * ```
     *
     * This will insert the `Info` page into the second slot of our navigation stack
     *
     * @param {number} insertIndex  The index where you want to insert the page
     * @param {Type} page  The name of the component you want to insert into the nav stack
     * @param {object} [params={}] Any nav-params you want to pass along to the next page
     * @param {object} [opts={}] Any options you want to use pass to transtion
     * @returns {Promise} Returns a promise when the page has been inserted into the navigation stack
     */
    NavController.prototype.insert = function (insertIndex, page, params, opts) {
        return this.insertPages(insertIndex, [{ page: page, params: params }], opts);
    };
    /**
     * Inserts multiple pages into the nav stack at the specified index.
     *
     * ```typescript
     * export class Detail {
     *    constructor(nav: NavController) {
     *      this.nav = nav;
     *    }
     *    insertPages(){
     *      let pages = [
     *        { page: Info },
     *        { page: ProfileList },
     *        { page: ProfileDetail, params: {userId:5} }
     *      ];
     *      this.nav.insertPages(2, pages);
     *    }
     *  }
     * ```
     *
     * This will insert each of the pages in the array, starting at the third slot
     * (second index) of the nav stack. The last page in the array will animate
     * in and become the active page.
     *
     * @param {number} insertIndex  The index where you want to insert the page
     * @param {array<{page: Type, params=: any}>} insertPages  An array of objects, each with a `page` and optionally `params` property
     * @param {object} [opts={}] Any options you want to use pass to transtion
     * @returns {Promise} Returns a promise when the pages have been inserted into the navigation stack
     */
    NavController.prototype.insertPages = function (insertIndex, insertPages, opts) {
        var views = insertPages.map(function (p) { return new view_controller_1.ViewController(p.page, p.params); });
        return this._insertViews(insertIndex, views, opts);
    };
    NavController.prototype._insertViews = function (insertIndex, insertViews, opts) {
        if (!insertViews || !insertViews.length) {
            return Promise.reject('invalid pages');
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        // insert the new page into the stack
        // returns the newly created entering view
        var enteringView = this._insert(insertIndex, insertViews);
        // set the nav direction to "forward" if it wasn't set
        opts.direction = opts.direction || 'forward';
        // set which animation it should use if it wasn't set yet
        if (!opts.animation) {
            opts.animation = enteringView.getTransitionName(opts.direction);
        }
        var resolve;
        var promise = new Promise(function (res) { resolve = res; });
        // it's possible that the newly added view doesn't need to
        // transition in, but was simply inserted somewhere in the stack
        // go backwards through the stack and find the first active view
        // which could be active or one ready to enter
        for (var i = this._views.length - 1; i >= 0; i--) {
            if (this._views[i].state === STATE_ACTIVE || this._views[i].state === STATE_INIT_ENTER) {
                // found the view at the end of the stack that's either
                // already active or it is about to enter
                if (this._views[i] === enteringView) {
                    // cool, so the last valid view is also our entering view!!
                    // this means we should animate that bad boy in so it's the active view
                    // return a promise and resolve when the transition has completed
                    // get the leaving view which the _insert() already set
                    var leavingView = this.getByState(STATE_INIT_LEAVE);
                    // start the transition, fire resolve when done...
                    this._transition(enteringView, leavingView, opts, function (hasCompleted) {
                        // transition has completed!!
                        resolve(hasCompleted);
                    });
                    return promise;
                }
                break;
            }
        }
        // the page was not pushed onto the end of the stack
        // but rather inserted somewhere in the middle or beginning
        // Since there are views after this new one, don't transition in
        // auto resolve cuz there was is no need for an animation
        return Promise.resolve(enteringView);
    };
    /**
     * @private
     */
    NavController.prototype._insert = function (insertIndex, insertViews) {
        // when this is done, there should only be at most
        // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
        // there should not be any that are STATE_ACTIVE after this is done
        var _this = this;
        // allow -1 to be passed in to auto push it on the end
        // and clean up the index if it's larger then the size of the stack
        if (insertIndex < 0 || insertIndex > this._views.length) {
            insertIndex = this._views.length;
        }
        // first see if there's an active view
        var view = this.getActive();
        if (view) {
            // there's an active view, set that it's initialized to leave
            view.state = STATE_INIT_LEAVE;
        }
        else if (view = this.getByState(STATE_INIT_ENTER)) {
            // oh no, there's already a transition initalized ready to enter!
            // but it actually hasn't entered yet at all so lets
            // just keep it in the array, but not render or animate it in
            view.state = STATE_INACTIVE;
        }
        // insert each of the views in the pages array
        var insertView = null;
        insertViews.forEach(function (view, i) {
            insertView = view;
            // create the new entering view
            view.setNav(_this);
            view.state = STATE_INACTIVE;
            // give this inserted view an ID
            _this._incId(view);
            // insert the entering view into the correct index in the stack
            _this._views.splice(insertIndex + i, 0, view);
        });
        if (insertView) {
            insertView.state = STATE_INIT_ENTER;
        }
        return insertView;
    };
    /**
     * If you wanted to navigate back from a current view, you can use the back-button or programatically call `pop()`
     * Similar to `push()`, you can pass animation options.
     *
     * ```typescript
     * class SecondView{
     *    constructor(nav:NavController){
     *      this.nav = nav;
     *    }
     *    goBack(){
     *      this.nav.pop();
     *    }
     * }
     * ```
     *
     * @param {object} [opts={}] Any options you want to use pass to transtion
     * @returns {Promise} Returns a promise when the transition is completed
     */
    NavController.prototype.pop = function (opts) {
        // get the index of the active view
        // which will become the view to be leaving
        var activeView = this.getByState(STATE_TRANS_ENTER) ||
            this.getByState(STATE_INIT_ENTER) ||
            this.getActive();
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        // if not set, by default climb up the nav controllers if
        // there isn't a previous view in this nav controller
        if (util_1.isBlank(opts.climbNav)) {
            opts.climbNav = true;
        }
        return this.remove(this.indexOf(activeView), 1, opts);
    };
    /**
     * Similar to `pop()`, this method let's you navigate back to the root of the stack, no matter how many views that is
     * @param {object} [opts={}] Any options you want to use pass to transtion
     */
    NavController.prototype.popToRoot = function (opts) {
        return this.popTo(this.first(), opts);
    };
    /**
     * Pop to a specific view in the history stack
     * @param {ViewController} view  to pop to
     * @param {object} [opts={}]  Any options you want to use pass to transtion
     */
    NavController.prototype.popTo = function (view, opts) {
        var startIndex = this.indexOf(view);
        var activeView = this.getByState(STATE_TRANS_ENTER) ||
            this.getByState(STATE_INIT_ENTER) ||
            this.getActive();
        var removeCount = this.indexOf(activeView) - startIndex;
        return this.remove(startIndex + 1, removeCount, opts);
    };
    /**
     * Removes a view from the nav stack at the specified index.
     *
     * ```typescript
     * export class Detail {
     *    constructor(nav: NavController) {
     *      this.nav = nav;
     *    }
     *    removeView(){
     *      this.nav.remove(1);
     *    }
     *  }
     * ```
     *
     * @param {number} [startIndex]  The starting index to remove pages from the stack. Default is the index of the last page.
     * @param {number} [removeCount]  The number of pages to remove, defaults to remove `1`.
     * @param {object} [opts={}] Any options you want to use pass to transtion.
     * @returns {Promise} Returns a promise when the page has been removed.
     */
    NavController.prototype.remove = function (startIndex, removeCount, opts) {
        if (startIndex === void 0) { startIndex = -1; }
        if (removeCount === void 0) { removeCount = 1; }
        if (startIndex === -1) {
            startIndex = this._views.length - 1;
        }
        else if (startIndex < 0 || startIndex >= this._views.length) {
            return Promise.reject('remove index out of range');
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        // default the direction to "back"
        opts.direction = opts.direction || 'back';
        // figure out the states of each view in the stack
        var leavingView = this._remove(startIndex, removeCount);
        if (!leavingView) {
            var forcedActive = this.getByState(STATE_FORCE_ACTIVE);
            if (forcedActive) {
                // this scenario happens when a remove is going on
                // during a transition
                if (this._trans) {
                    this._trans.stop();
                    this._trans.destroy();
                    this._trans = null;
                    this._cleanup();
                }
                return Promise.resolve(false);
            }
        }
        if (leavingView) {
            // there is a view ready to leave, meaning that a transition needs
            // to happen and the previously active view is going to animate out
            // get the view thats ready to enter
            var enteringView = this.getByState(STATE_INIT_ENTER);
            if (!enteringView && !this.isPortal) {
                // oh nos! no entering view to go to!
                // if there is no previous view that would enter in this nav stack
                // and the option is set to climb up the nav parent looking
                // for the next nav we could transition to instead
                if (opts.climbNav) {
                    var parentNav = this.parent;
                    while (parentNav) {
                        if (!parentNav['_tabs']) {
                            // Tabs can be a parent, but it is not a collection of views
                            // only we're looking for an actual NavController w/ stack of views
                            leavingView.willLeave();
                            return parentNav.pop(opts).then(function (rtnVal) {
                                leavingView.didLeave();
                                return rtnVal;
                            });
                        }
                        parentNav = parentNav.parent;
                    }
                }
                // there's no previous view and there's no valid parent nav
                // to climb to so this shouldn't actually remove the leaving
                // view because there's nothing that would enter, eww
                leavingView.state = STATE_ACTIVE;
                return Promise.resolve(false);
            }
            var resolve_1;
            var promise = new Promise(function (res) { resolve_1 = res; });
            if (!opts.animation) {
                opts.animation = leavingView.getTransitionName(opts.direction);
            }
            // start the transition, fire resolve when done...
            this._transition(enteringView, leavingView, opts, function (hasCompleted) {
                // transition has completed!!
                resolve_1(hasCompleted);
            });
            return promise;
        }
        // no need to transition when the active view isn't being removed
        // there's still an active view after _remove() figured out states
        // so this means views that were only removed before the active
        // view, so auto-resolve since no transition needs to happen
        return Promise.resolve(false);
    };
    /**
     * @private
     */
    NavController.prototype._remove = function (startIndex, removeCount) {
        var _this = this;
        // when this is done, there should only be at most
        // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
        // there should not be any that are STATE_ACTIVE after this is done
        var view = null;
        // loop through each view that is set to be removed
        for (var i = startIndex, ii = removeCount + startIndex; i < ii; i++) {
            view = this.getByIndex(i);
            if (!view)
                break;
            if (view.state === STATE_TRANS_ENTER || view.state === STATE_TRANS_LEAVE) {
                // oh no!!! this view should be removed, but it's
                // actively transitioning in at the moment!!
                // since it's viewable right now, let's just set that
                // it should be removed after the transition
                view.state = STATE_REMOVE_AFTER_TRANS;
            }
            else {
                // if this view is already leaving then no need to immediately
                // remove it, otherwise set the remove state
                // this is useful if the view being removed isn't going to
                // animate out, but just removed from the stack, no transition
                view.state = STATE_REMOVE;
            }
        }
        if (view = this.getByState(STATE_INIT_LEAVE)) {
            // looks like there's already an active leaving view
            // reassign previous entering view to just be inactive
            var enteringView = this.getByState(STATE_INIT_ENTER);
            if (enteringView) {
                enteringView.state = STATE_INACTIVE;
            }
            // from the index of the leaving view, go backwards and
            // find the first view that is inactive
            for (var i = this.indexOf(view) - 1; i >= 0; i--) {
                if (this._views[i].state === STATE_INACTIVE) {
                    this._views[i].state = STATE_INIT_ENTER;
                    break;
                }
            }
        }
        else if (view = this.getByState(STATE_TRANS_LEAVE)) {
            // an active transition is happening, but a new transition
            // still needs to happen force this view to be the active one
            view.state = STATE_FORCE_ACTIVE;
        }
        else if (view = this.getByState(STATE_REMOVE)) {
            // there is no active transition about to happen
            // find the first view that is supposed to be removed and
            // set that it is the init leaving view
            // the first view to be removed, it should init leave
            view.state = STATE_INIT_LEAVE;
            view.willUnload();
            // from the index of the leaving view, go backwards and
            // find the first view that is inactive so it can be the entering
            for (var i = this.indexOf(view) - 1; i >= 0; i--) {
                if (this._views[i].state === STATE_INACTIVE) {
                    this._views[i].state = STATE_INIT_ENTER;
                    break;
                }
            }
        }
        // if there is still an active view, then it wasn't one that was
        // set to be removed, so there actually won't be a transition at all
        view = this.getActive();
        if (view) {
            // the active view remains untouched, so all the removes
            // must have happened before it, so really no need for transition
            view = this.getByState(STATE_INIT_ENTER);
            if (view) {
                // if it was going to enter, then just make inactive
                view.state = STATE_INACTIVE;
            }
            view = this.getByState(STATE_INIT_LEAVE);
            if (view) {
                // this was going to leave, so just remove it completely
                view.state = STATE_REMOVE;
            }
        }
        // remove views that have been set to be removed, but not
        // apart of any transitions that will eventually happen
        this._views.filter(function (v) { return v.state === STATE_REMOVE; }).forEach(function (view) {
            view.willLeave();
            view.didLeave();
            _this._views.splice(_this.indexOf(view), 1);
            view.destroy();
        });
        return this.getByState(STATE_INIT_LEAVE);
    };
    /**
     * @private
     */
    NavController.prototype._transition = function (enteringView, leavingView, opts, done) {
        var _this = this;
        var transId = ++this._transIds;
        if (enteringView === leavingView) {
            // if the entering view and leaving view are the same thing don't continue
            this._transFinish(transId, enteringView, leavingView, null, false);
            return done(false);
        }
        // lets time this sucker, ready go
        var wtfScope = instrumentation_1.wtfStartTimeRange('NavController#_transition', (enteringView && enteringView.name));
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        this._setAnimate(opts);
        if (!leavingView) {
            // if no leaving view then create a bogus one
            leavingView = new view_controller_1.ViewController();
        }
        if (!enteringView) {
            // if no entering view then create a bogus one
            enteringView = new view_controller_1.ViewController();
            enteringView.loaded();
        }
        /* Async steps to complete a transition
          1. _render: compile the view and render it in the DOM. Load page if it hasn't loaded already. When done call postRender
          2. _postRender: Run willEnter/willLeave, then wait a frame (change detection happens), then call beginTransition
          3. _beforeTrans: Create the transition's animation, play the animation, wait for it to end
          4. _afterTrans: Run didEnter/didLeave, call _transComplete()
          5. _transComplete: Cleanup, remove cache views, then call the final callback
        */
        // begin the multiple async process of transitioning to the entering view
        this._render(transId, enteringView, leavingView, opts, function (hasCompleted) {
            _this._transFinish(transId, enteringView, leavingView, opts.direction, hasCompleted);
            instrumentation_1.wtfEndTimeRange(wtfScope);
            done(hasCompleted);
        });
    };
    NavController.prototype._setAnimate = function (opts) {
        if ((this._views.length === 1 && !this._init && !this.isPortal) || this.config.get('animate') === false) {
            opts.animate = false;
        }
    };
    /**
     * @private
     */
    NavController.prototype._render = function (transId, enteringView, leavingView, opts, done) {
        // compile/load the view into the DOM
        var _this = this;
        if (enteringView.state === STATE_INACTIVE) {
            // this entering view is already set to inactive, so this
            // transition must be canceled, so don't continue
            return done();
        }
        enteringView.state = STATE_INIT_ENTER;
        leavingView.state = STATE_INIT_LEAVE;
        // remember if this nav is already transitioning or not
        var isAlreadyTransitioning = this.isTransitioning();
        if (enteringView.isLoaded()) {
            // already compiled this view, do not load again and continue
            this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
        }
        else {
            // view has not been compiled/loaded yet
            // continue once the view has finished compiling
            // DOM WRITE
            this.setTransitioning(true, 500);
            this.loadPage(enteringView, null, opts, function () {
                if (enteringView.onReady) {
                    // this entering view needs to wait for it to be ready
                    // this is used by Tabs to wait for the first page of
                    // the first selected tab to be loaded
                    enteringView.onReady(function () {
                        enteringView.loaded();
                        _this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
                    });
                }
                else {
                    enteringView.loaded();
                    _this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
                }
            });
        }
    };
    /**
     * @private
     */
    NavController.prototype._postRender = function (transId, enteringView, leavingView, isAlreadyTransitioning, opts, done) {
        // called after _render has completed and the view is compiled/loaded
        if (enteringView.state === STATE_INACTIVE) {
            // this entering view is already set to inactive, so this
            // transition must be canceled, so don't continue
            return done();
        }
        if (!opts.preload) {
            // the enteringView will become the active view, and is not being preloaded
            // set the correct zIndex for the entering and leaving views
            // if there's already another trans_enter happening then
            // the zIndex for the entering view should go off of that one
            // DOM WRITE
            var lastestLeavingView = this.getByState(STATE_TRANS_ENTER) || leavingView;
            this._setZIndex(enteringView, lastestLeavingView, opts.direction);
            // make sure the entering and leaving views are showing
            // DOM WRITE
            if (isAlreadyTransitioning) {
                // the previous transition was still going when this one started
                // so to be safe, only update showing the entering/leaving
                // don't hide the others when they could still be transitioning
                enteringView.domShow(true, this._renderer);
                leavingView.domShow(true, this._renderer);
            }
            else {
                // there are no other transitions happening but this one
                // only entering/leaving should show, all others hidden
                // also if a view is an overlay or the previous view is an
                // overlay then always show the overlay and the view before it
                var view;
                var shouldShow;
                for (var i = 0, ii = this._views.length; i < ii; i++) {
                    view = this._views[i];
                    shouldShow = (view === enteringView) ||
                        (view === leavingView) ||
                        view.isOverlay ||
                        (i < ii - 1 ? this._views[i + 1].isOverlay : false);
                    view.domShow(shouldShow, this._renderer);
                }
            }
            // call each view's lifecycle events
            if (leavingView.fireOtherLifecycles) {
                // only fire entering lifecycle if the leaving
                // view hasn't explicitly set not to
                enteringView.willEnter();
            }
            if (enteringView.fireOtherLifecycles) {
                // only fire leaving lifecycle if the entering
                // view hasn't explicitly set not to
                leavingView.willLeave();
            }
        }
        else {
            // this view is being preloaded, don't call lifecycle events
            // transition does not need to animate
            opts.animate = false;
        }
        this._beforeTrans(enteringView, leavingView, opts, done);
    };
    /**
     * @private
     */
    NavController.prototype._beforeTrans = function (enteringView, leavingView, opts, done) {
        // called after one raf from postRender()
        // create the transitions animation, play the animation
        // when the transition ends call wait for it to end
        var _this = this;
        if (enteringView.state === STATE_INACTIVE) {
            // this entering view is already set to inactive, so this
            // transition must be canceled, so don't continue
            return done();
        }
        enteringView.state = STATE_TRANS_ENTER;
        leavingView.state = STATE_TRANS_LEAVE;
        // everything during the transition should runOutsideAngular
        this._zone.runOutsideAngular(function () {
            // init the transition animation
            var transitionOpts = {
                animation: opts.animation,
                direction: opts.direction,
                duration: opts.duration,
                easing: opts.easing,
                renderDelay: opts.transitionDelay || _this._trnsDelay,
                isRTL: _this.config.platform.isRTL()
            };
            var transAnimation = transition_1.Transition.createTransition(enteringView, leavingView, transitionOpts);
            _this._trans && _this._trans.destroy();
            _this._trans = transAnimation;
            if (opts.animate === false) {
                // force it to not animate the elements, just apply the "to" styles
                transAnimation.duration(0);
            }
            var duration = transAnimation.getDuration();
            var enableApp = (duration < 64);
            // block any clicks during the transition and provide a
            // fallback to remove the clickblock if something goes wrong
            _this._app.setEnabled(enableApp, duration);
            _this.setTransitioning(!enableApp, duration);
            if (enteringView.viewType) {
                transAnimation.before.addClass(enteringView.viewType);
            }
            // create a callback for when the animation is done
            transAnimation.onFinish(function (trans) {
                // transition animation has ended
                // destroy the animation and it's element references
                trans.destroy();
                _this._afterTrans(enteringView, leavingView, opts, trans.hasCompleted, done);
            });
            // cool, let's do this, start the transition
            if (opts.progressAnimation) {
                // this is a swipe to go back, just get the transition progress ready
                // kick off the swipe animation start
                transAnimation.progressStart();
            }
            else {
                // this is a normal animation
                // kick it off and let it play through
                transAnimation.play();
            }
        });
    };
    /**
     * @private
     */
    NavController.prototype._afterTrans = function (enteringView, leavingView, opts, hasCompleted, done) {
        // transition has completed, update each view's state
        // place back into the zone, run didEnter/didLeave
        // call the final callback when done
        var _this = this;
        // run inside of the zone again
        this._zone.run(function () {
            if (!opts.preload && hasCompleted) {
                if (leavingView.fireOtherLifecycles) {
                    // only fire entering lifecycle if the leaving
                    // view hasn't explicitly set not to
                    enteringView.didEnter();
                }
                if (enteringView.fireOtherLifecycles) {
                    // only fire leaving lifecycle if the entering
                    // view hasn't explicitly set not to
                    leavingView.didLeave();
                }
            }
            if (enteringView.state === STATE_INACTIVE) {
                // this entering view is already set to inactive, so this
                // transition must be canceled, so don't continue
                return done(hasCompleted);
            }
            if (opts.keyboardClose !== false && _this._keyboard.isOpen()) {
                // the keyboard is still open!
                // no problem, let's just close for them
                _this._keyboard.close();
                _this._keyboard.onClose(function () {
                    // keyboard has finished closing, transition complete
                    done(hasCompleted);
                }, 32);
            }
            else {
                // all good, transition complete
                done(hasCompleted);
            }
        });
    };
    /**
     * @private
     */
    NavController.prototype._transFinish = function (transId, enteringView, leavingView, direction, hasCompleted) {
        // a transition has completed, but not sure if it's the last one or not
        // check if this transition is the most recent one or not
        var _this = this;
        if (transId === this._transIds) {
            // ok, good news, there were no other transitions that kicked
            // off during the time this transition started and ended
            if (hasCompleted) {
                // this transition has completed as normal
                // so the entering one is now the active view
                // and the leaving view is now just inactive
                if (enteringView.state !== STATE_REMOVE_AFTER_TRANS) {
                    enteringView.state = STATE_ACTIVE;
                }
                if (leavingView.state !== STATE_REMOVE_AFTER_TRANS) {
                    leavingView.state = STATE_INACTIVE;
                }
                // only need to do all this clean up if the transition
                // completed, otherwise nothing actually changed
                // destroy all of the views that come after the active view
                this._cleanup();
                // make sure only this entering view and PREVIOUS view are the
                // only two views that are not display:none
                // do not make any changes to the stack's current visibility
                // if there is an overlay somewhere in the stack
                leavingView = this.getPrevious(enteringView);
                if (this.hasOverlay()) {
                    // ensure the entering view is showing
                    enteringView.domShow(true, this._renderer);
                }
                else {
                    // only possibly hide a view if there are no overlays in the stack
                    this._views.forEach(function (view) {
                        var shouldShow = (view === enteringView) || (view === leavingView);
                        view.domShow(shouldShow, _this._renderer);
                    });
                }
                // this check only needs to happen once, which will add the css
                // class to the nav when it's finished its first transition
                if (!this._init) {
                    this._init = true;
                    this._renderer.setElementClass(this.elementRef.nativeElement, 'has-views', true);
                }
            }
            else {
                // this transition has not completed, meaning the
                // entering view did not end up as the active view
                // this would happen when swipe to go back started
                // but the user did not complete the swipe and the
                // what was the active view stayed as the active view
                leavingView.state = STATE_ACTIVE;
                enteringView.state = STATE_INACTIVE;
            }
            // allow clicks and enable the app again
            this._app && this._app.setEnabled(true);
            this.setTransitioning(false);
            if (direction !== null && hasCompleted && !this.isPortal) {
                // notify router of the state change if a direction was provided
                // multiple routers can exist and each should be notified
                this.routers.forEach(function (router) {
                    router.stateChange(direction, enteringView);
                });
            }
            // see if we should add the swipe back gesture listeners or not
            this._sbCheck();
            if (this._portal) {
                this._portal._views.forEach(function (view) {
                    if (view.data && view.data.dismissOnPageChange) {
                        view.dismiss();
                    }
                });
            }
        }
        else {
            // darn, so this wasn't the most recent transition
            // so while this one did end, there's another more recent one
            // still going on. Because a new transition is happening,
            // then this entering view isn't actually going to be the active
            // one, so only update the state to active/inactive if the state
            // wasn't already updated somewhere else during its transition
            if (enteringView.state === STATE_TRANS_ENTER) {
                enteringView.state = STATE_INACTIVE;
            }
            if (leavingView.state === STATE_TRANS_LEAVE) {
                leavingView.state = STATE_INACTIVE;
            }
        }
    };
    NavController.prototype._cleanup = function () {
        var _this = this;
        // ok, cleanup time!! Destroy all of the views that are
        // INACTIVE and come after the active view
        var activeViewIndex = this.indexOf(this.getActive());
        var destroys = this._views.filter(function (v) { return v.state === STATE_REMOVE_AFTER_TRANS; });
        for (var i = activeViewIndex + 1; i < this._views.length; i++) {
            if (this._views[i].state === STATE_INACTIVE) {
                destroys.push(this._views[i]);
            }
        }
        // all pages being destroyed should be removed from the list of
        // pages and completely removed from the dom
        destroys.forEach(function (view) {
            _this._views.splice(_this.indexOf(view), 1);
            view.destroy();
        });
        // if any z-index goes under 0, then reset them all
        var shouldResetZIndex = this._views.some(function (v) { return v.zIndex < 0; });
        if (shouldResetZIndex) {
            this._views.forEach(function (view) {
                view.setZIndex(view.zIndex + INIT_ZINDEX + 1, _this._renderer);
            });
        }
    };
    /**
     * @private
     */
    NavController.prototype.ngOnDestroy = function () {
        for (var i = this._views.length - 1; i >= 0; i--) {
            this._views[i].destroy();
        }
        this._views = [];
    };
    /**
     * @private
     */
    NavController.prototype.loadPage = function (view, navbarContainerRef, opts, done) {
        var _this = this;
        var wtfTimeRangeScope = instrumentation_1.wtfStartTimeRange('NavController#loadPage', view.name);
        // guts of DynamicComponentLoader#loadIntoLocation
        this._compiler && this._compiler.compileInHost(view.componentType).then(function (hostProtoViewRef) {
            var wtfScope = instrumentation_1.wtfCreateScope('NavController#loadPage_After_Compile')();
            var providers = _this.providers.concat(core_1.Injector.resolve([
                core_1.provide(view_controller_1.ViewController, { useValue: view }),
                core_1.provide(nav_params_1.NavParams, { useValue: view.getNavParams() })
            ]));
            var location = _this.elementRef;
            if (_this._anchorName) {
                location = _this._viewManager.getNamedElementInComponentView(location, _this._anchorName);
            }
            var viewContainer = _this._viewManager.getViewContainer(location);
            var hostViewRef = viewContainer.createHostView(hostProtoViewRef, viewContainer.length, providers);
            var pageElementRef = _this._viewManager.getHostElement(hostViewRef);
            var component = _this._viewManager.getComponent(pageElementRef);
            // auto-add page css className created from component JS class name
            var cssClassName = util_1.pascalCaseToDashCase(view.componentType['name']);
            _this._renderer.setElementClass(pageElementRef.nativeElement, cssClassName, true);
            view.addDestroy(function () {
                // ensure the element is cleaned up for when the view pool reuses this element
                _this._renderer.setElementAttribute(pageElementRef.nativeElement, 'class', null);
                _this._renderer.setElementAttribute(pageElementRef.nativeElement, 'style', null);
                // remove the page from its container
                var index = viewContainer.indexOf(hostViewRef);
                if (!hostViewRef.destroyed && index !== -1) {
                    viewContainer.remove(index);
                }
                view.setInstance(null);
            });
            // a new ComponentRef has been created
            // set the ComponentRef's instance to this ViewController
            view.setInstance(component);
            // remember the ElementRef to the ion-page elementRef that was just created
            view.setPageRef(pageElementRef);
            if (!navbarContainerRef) {
                navbarContainerRef = view.getNavbarViewRef();
            }
            var navbarTemplateRef = view.getNavbarTemplateRef();
            if (navbarContainerRef && navbarTemplateRef) {
                var navbarViewRef_1 = navbarContainerRef.createEmbeddedView(navbarTemplateRef);
                view.addDestroy(function () {
                    var index = navbarContainerRef.indexOf(navbarViewRef_1);
                    if (!navbarViewRef_1.destroyed && index > -1) {
                        navbarContainerRef.remove(index);
                    }
                });
            }
            opts.postLoad && opts.postLoad(view);
            instrumentation_1.wtfEndTimeRange(wtfTimeRangeScope);
            instrumentation_1.wtfLeave(wtfScope);
            done(view);
        });
    };
    /**
     * @private
     */
    NavController.prototype.swipeBackStart = function () {
        // default the direction to "back"
        var opts = {
            direction: 'back',
            progressAnimation: true
        };
        // figure out the states of each view in the stack
        var leavingView = this._remove(this._views.length - 1, 1);
        if (leavingView) {
            opts.animation = leavingView.getTransitionName(opts.direction);
            // get the view thats ready to enter
            var enteringView = this.getByState(STATE_INIT_ENTER);
            // start the transition, fire callback when done...
            this._transition(enteringView, leavingView, opts, function (hasCompleted) {
                // swipe back has finished!!
                void 0;
            });
        }
    };
    /**
     * @private
     */
    NavController.prototype.swipeBackProgress = function (stepValue) {
        if (this._trans && this._sbGesture) {
            // continue to disable the app while actively dragging
            this._app.setEnabled(false, 4000);
            this.setTransitioning(true, 4000);
            // set the transition animation's progress
            this._trans.progressStep(stepValue);
        }
    };
    /**
     * @private
     */
    NavController.prototype.swipeBackEnd = function (shouldComplete, currentStepValue) {
        if (this._trans && this._sbGesture) {
            // the swipe back gesture has ended
            this._trans.progressEnd(shouldComplete, currentStepValue);
        }
    };
    /**
     * @private
     */
    NavController.prototype._sbCheck = function () {
        var _this = this;
        if (this._sbEnabled) {
            // this nav controller can have swipe to go back
            if (!this._sbGesture) {
                // create the swipe back gesture if we haven't already
                var opts = {
                    edge: 'left',
                    threshold: this._sbThreshold
                };
                this._sbGesture = new swipe_back_1.SwipeBackGesture(this.getNativeElement(), opts, this);
            }
            if (this.canSwipeBack()) {
                // it is be possible to swipe back
                if (!this._sbGesture.isListening) {
                    this._zone.runOutsideAngular(function () {
                        // start listening if it's not already
                        void 0;
                        _this._sbGesture.listen();
                    });
                }
            }
            else if (this._sbGesture.isListening) {
                // it should not be possible to swipe back
                // but the gesture is still listening
                void 0;
                this._sbGesture.unlisten();
            }
        }
    };
    /**
     * If it's possible to use swipe back or not. If it's not possible
     * to go back, or swipe back is not enable then this will return false.
     * If it is possible to go back, and swipe back is enabled, then this
     * will return true.
     * @returns {boolean} Whether you can swipe to go back
     */
    NavController.prototype.canSwipeBack = function () {
        return (this._sbEnabled && !this.isTransitioning() && this._app.isEnabled() && this.canGoBack());
    };
    /**
     * Returns `true` if there's a valid previous page that we can pop back to.
     * Otherwise returns false.
     * @returns {boolean} Whether there is a page to go back to
     */
    NavController.prototype.canGoBack = function () {
        var activeView = this.getActive();
        if (activeView) {
            return activeView.enableBack();
        }
        return false;
    };
    /**
     * Boolean if the nav controller is actively transitioning or not.
     * @private
     * @return {boolean}
     */
    NavController.prototype.isTransitioning = function () {
        return (this._trnsTime > Date.now());
    };
    /**
     * @private
     * @return {boolean}
     */
    NavController.prototype.setTransitioning = function (isTransitioning, fallback) {
        if (fallback === void 0) { fallback = 700; }
        this._trnsTime = (isTransitioning ? Date.now() + fallback : 0);
    };
    /**
     * @private
     * @returns {boolean}
     */
    NavController.prototype.hasOverlay = function () {
        for (var i = this._views.length - 1; i >= 0; i--) {
            if (this._views[i].isOverlay) {
                return true;
            }
        }
        return false;
    };
    /**
     * @private
     * @returns {ViewController}
     */
    NavController.prototype.getByState = function (state) {
        for (var i = this._views.length - 1; i >= 0; i--) {
            if (this._views[i].state === state) {
                return this._views[i];
            }
        }
        return null;
    };
    /**
     * @param {number} index  The index of the page you want to get
     * @returns {ViewController} Returns the component that matches the index given
     */
    NavController.prototype.getByIndex = function (index) {
        return (index < this._views.length && index > -1 ? this._views[index] : null);
    };
    /**
     * @returns {ViewController} Returns the active page's view controller.
     */
    NavController.prototype.getActive = function () {
        return this.getByState(STATE_ACTIVE);
    };
    /**
     * @param {ViewController} view
     * @returns {boolean}
     */
    NavController.prototype.isActive = function (view) {
        return !!(view && view.state === STATE_ACTIVE);
    };
    /**
     * @param {ViewController} view  The ViewController to get the previous view to
     * @returns {viewController}
     */
    NavController.prototype.getPrevious = function (view) {
        return this.getByIndex(this.indexOf(view) - 1);
    };
    /**
     * First page in this nav controller's stack.
     * @returns {ViewController} Returns the first component page in the current stack
     */
    NavController.prototype.first = function () {
        return (this._views.length ? this._views[0] : null);
    };
    /**
     * Last page in this nav controller's stack. This would not return a page which is about to be destroyed.
     * @returns {ViewController} Returns the last component page in the current stack
     */
    NavController.prototype.last = function () {
        return (this._views.length ? this._views[this._views.length - 1] : null);
    };
    /**
     * @param {ViewController} view
     * @returns {number} Returns the index number of the view
     */
    NavController.prototype.indexOf = function (view) {
        return this._views.indexOf(view);
    };
    /**
     * Number of sibling views in the nav controller.
     * @returns {number} The number of views in stack, including the current view
     */
    NavController.prototype.length = function () {
        return this._views.length;
    };
    Object.defineProperty(NavController.prototype, "rootNav", {
        /**
         * Returns the root NavController.
         * @returns {NavController}
         */
        get: function () {
            var nav = this;
            while (nav.parent) {
                nav = nav.parent;
            }
            return nav;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    NavController.prototype.registerRouter = function (router) {
        this.routers.push(router);
    };
    /**
     * @private
     */
    NavController.prototype._incId = function (view) {
        view.id = this.id + '-' + (++this._ids);
    };
    /**
     * @private
     */
    NavController.prototype._setZIndex = function (enteringView, leavingView, direction) {
        if (enteringView) {
            // get the leaving view, which could be in various states
            if (!leavingView || !leavingView.isLoaded()) {
                // the leavingView is a mocked view, either we're
                // actively transitioning or it's the initial load
                var previousView = this.getPrevious(enteringView);
                if (previousView && previousView.isLoaded()) {
                    // we found a better previous view to reference
                    // use this one instead
                    enteringView.setZIndex(previousView.zIndex + 1, this._renderer);
                }
                else {
                    // this is the initial view
                    enteringView.setZIndex(this.isPortal ? PORTAL_ZINDEX : INIT_ZINDEX, this._renderer);
                }
            }
            else if (direction === 'back') {
                // moving back
                enteringView.setZIndex(leavingView.zIndex - 1, this._renderer);
            }
            else {
                // moving forward
                enteringView.setZIndex(leavingView.zIndex + 1, this._renderer);
            }
        }
    };
    return NavController;
}(ion_1.Ion));
exports.NavController = NavController;
var STATE_ACTIVE = 'active';
var STATE_INACTIVE = 'inactive';
var STATE_INIT_ENTER = 'init_enter';
var STATE_INIT_LEAVE = 'init_leave';
var STATE_TRANS_ENTER = 'trans_enter';
var STATE_TRANS_LEAVE = 'trans_leave';
var STATE_REMOVE = 'remove';
var STATE_REMOVE_AFTER_TRANS = 'remove_after_trans';
var STATE_FORCE_ACTIVE = 'force_active';
var INIT_ZINDEX = 100;
var PORTAL_ZINDEX = 9999;
var ctrlIds = -1;
