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
var ion_1 = require('../ion');
var config_1 = require('../../config/config');
var platform_1 = require('../../platform/platform');
var keyboard_1 = require('../../util/keyboard');
var menu_gestures_1 = require('./menu-gestures');
var menu_controller_1 = require('./menu-controller');
var util_1 = require('../../util/util');
/**
 * @private
 */
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu(_menuCtrl, _elementRef, _config, _platform, _renderer, _keyboard, _zone) {
        _super.call(this, _elementRef);
        this._menuCtrl = _menuCtrl;
        this._elementRef = _elementRef;
        this._config = _config;
        this._platform = _platform;
        this._renderer = _renderer;
        this._keyboard = _keyboard;
        this._zone = _zone;
        this._preventTime = 0;
        this._isEnabled = true;
        this._isSwipeEnabled = true;
        this._isPers = false;
        this._init = false;
        /**
         * @private
         */
        this.isOpen = false;
        /**
         * @private
         */
        this.opening = new core_1.EventEmitter();
    }
    Object.defineProperty(Menu.prototype, "enabled", {
        /**
         * @private
         */
        get: function () {
            return this._isEnabled;
        },
        set: function (val) {
            this._isEnabled = util_1.isTrueProperty(val);
            this._setListeners();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "swipeEnabled", {
        /**
         * @private
         */
        get: function () {
            return this._isSwipeEnabled;
        },
        set: function (val) {
            this._isSwipeEnabled = util_1.isTrueProperty(val);
            this._setListeners();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "persistent", {
        /**
         * @private
         */
        get: function () {
            return this._isPers;
        },
        set: function (val) {
            this._isPers = util_1.isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    Menu.prototype.ngOnInit = function () {
        var self = this;
        self._init = true;
        var content = self.content;
        self._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();
        // requires content element
        if (!self._cntEle) {
            return void 0;
        }
        // normalize the "side"
        if (self.side !== 'left' && self.side !== 'right') {
            self.side = 'left';
        }
        self._renderer.setElementAttribute(self._elementRef.nativeElement, 'side', self.side);
        // normalize the "type"
        if (!self.type) {
            self.type = self._config.get('menuType');
        }
        self._renderer.setElementAttribute(self._elementRef.nativeElement, 'type', self.type);
        // add the gestures
        self._cntGesture = new menu_gestures_1.MenuContentGesture(self, self.getContentElement());
        self._menuGesture = new menu_gestures_1.MenuTargetGesture(self, self.getNativeElement());
        // register listeners if this menu is enabled
        // check if more than one menu is on the same side
        var hasEnabledSameSideMenu = self._menuCtrl.getMenus().some(function (m) {
            return m.side === self.side && m.enabled;
        });
        if (hasEnabledSameSideMenu) {
            // auto-disable if another menu on the same side is already enabled
            self._isEnabled = false;
        }
        self._setListeners();
        // create a reusable click handler on this instance, but don't assign yet
        self.onContentClick = function (ev) {
            if (self._isEnabled) {
                ev.preventDefault();
                ev.stopPropagation();
                self.close();
            }
        };
        self._cntEle.classList.add('menu-content');
        self._cntEle.classList.add('menu-content-' + self.type);
        // register this menu with the app's menu controller
        self._menuCtrl.register(self);
    };
    /**
     * @private
     */
    Menu.prototype._setListeners = function () {
        var self = this;
        if (self._init) {
            // only listen/unlisten if the menu has initialized
            if (self._isEnabled && self._isSwipeEnabled && !self._cntGesture.isListening) {
                // should listen, but is not currently listening
                void 0;
                self._zone.runOutsideAngular(function () {
                    self._cntGesture.listen();
                    self._menuGesture.listen();
                });
            }
            else if (self._cntGesture.isListening && (!self._isEnabled || !self._isSwipeEnabled)) {
                // should not listen, but is currently listening
                void 0;
                self._cntGesture.unlisten();
                self._menuGesture.unlisten();
            }
        }
    };
    /**
     * @private
     */
    Menu.prototype._getType = function () {
        if (!this._type) {
            this._type = menu_controller_1.MenuController.create(this.type, this);
            if (this._config.get('animate') === false) {
                this._type.ani.duration(0);
            }
        }
        return this._type;
    };
    /**
     * Sets the state of the Menu to open or not.
     * @param {boolean} shouldOpen  If the Menu is open or not.
     * @return {Promise} returns a promise once set
     */
    Menu.prototype.setOpen = function (shouldOpen) {
        var _this = this;
        // _isPrevented is used to prevent unwanted opening/closing after swiping open/close
        // or swiping open the menu while pressing down on the menuToggle button
        if ((shouldOpen && this.isOpen) || this._isPrevented()) {
            return Promise.resolve(this.isOpen);
        }
        this._before();
        return new Promise(function (resolve) {
            _this._getType().setOpen(shouldOpen, function () {
                _this._after(shouldOpen);
                resolve(_this.isOpen);
            });
        });
    };
    /**
     * @private
     */
    Menu.prototype.swipeStart = function () {
        // user started swiping the menu open/close
        if (this._isPrevented() || !this._isEnabled || !this._isSwipeEnabled)
            return;
        this._before();
        this._getType().setProgressStart(this.isOpen);
    };
    /**
     * @private
     */
    Menu.prototype.swipeProgress = function (stepValue) {
        // user actively dragging the menu
        if (this._isEnabled && this._isSwipeEnabled) {
            this._prevent();
            this._getType().setProgessStep(stepValue);
            this.opening.next(stepValue);
        }
    };
    /**
     * @private
     */
    Menu.prototype.swipeEnd = function (shouldComplete, currentStepValue) {
        var _this = this;
        // user has finished dragging the menu
        if (this._isEnabled && this._isSwipeEnabled) {
            this._prevent();
            this._getType().setProgressEnd(shouldComplete, currentStepValue, function (isOpen) {
                void 0;
                _this._after(isOpen);
            });
        }
    };
    /**
     * @private
     */
    Menu.prototype._before = function () {
        // this places the menu into the correct location before it animates in
        // this css class doesn't actually kick off any animations
        if (this._isEnabled) {
            this.getNativeElement().classList.add('show-menu');
            this.getBackdropElement().classList.add('show-backdrop');
            this._prevent();
            this._keyboard.close();
        }
    };
    /**
     * @private
     */
    Menu.prototype._after = function (isOpen) {
        // keep opening/closing the menu disabled for a touch more yet
        // only add listeners/css if it's enabled and isOpen
        // and only remove listeners/css if it's not open
        if ((this._isEnabled && isOpen) || !isOpen) {
            this._prevent();
            this.isOpen = isOpen;
            this._cntEle.classList[isOpen ? 'add' : 'remove']('menu-content-open');
            this._cntEle.removeEventListener('click', this.onContentClick);
            if (isOpen) {
                this._cntEle.addEventListener('click', this.onContentClick);
            }
            else {
                this.getNativeElement().classList.remove('show-menu');
                this.getBackdropElement().classList.remove('show-backdrop');
            }
        }
    };
    /**
     * @private
     */
    Menu.prototype._prevent = function () {
        // used to prevent unwanted opening/closing after swiping open/close
        // or swiping open the menu while pressing down on the menuToggle
        this._preventTime = Date.now() + 20;
    };
    /**
     * @private
     */
    Menu.prototype._isPrevented = function () {
        return this._preventTime > Date.now();
    };
    /**
     * Progamatically open the Menu.
     * @return {Promise} returns a promise when the menu is fully opened.
     */
    Menu.prototype.open = function () {
        return this.setOpen(true);
    };
    /**
     * Progamatically close the Menu.
     * @return {Promise} returns a promise when the menu is fully closed.
     */
    Menu.prototype.close = function () {
        return this.setOpen(false);
    };
    /**
     * Toggle the menu. If it's closed, it will open, and if opened, it will close.
     * @return {Promise} returns a promise when the menu has been toggled.
     */
    Menu.prototype.toggle = function () {
        return this.setOpen(!this.isOpen);
    };
    /**
     * Used to enable or disable a menu. For example, there could be multiple
     * left menus, but only one of them should be able to be opened at the same
     * time. If there are multiple menus on the same side, then enabling one menu
     * will also automatically disable all the others that are on the same side.
     * @param {boolean} shouldEnable  True if it should be enabled, false if not.
     * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
     */
    Menu.prototype.enable = function (shouldEnable) {
        var _this = this;
        this.enabled = shouldEnable;
        if (!shouldEnable && this.isOpen) {
            // close if this menu is open, and should not be enabled
            this.close();
        }
        if (shouldEnable) {
            // if this menu should be enabled
            // then find all the other menus on this same side
            // and automatically disable other same side menus
            var sameSideMenus = this._menuCtrl
                .getMenus()
                .filter(function (m) { return m.side === _this.side && m !== _this; })
                .map(function (m) { return m.enabled = false; });
        }
        return this;
    };
    /**
     * Used to enable or disable the ability to swipe open the menu.
     * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
     * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
     */
    Menu.prototype.swipeEnable = function (shouldEnable) {
        this.swipeEnabled = shouldEnable;
        return this;
    };
    /**
     * @private
     */
    Menu.prototype.getMenuElement = function () {
        return this.getNativeElement();
    };
    /**
     * @private
     */
    Menu.prototype.getContentElement = function () {
        return this._cntEle;
    };
    /**
     * @private
     */
    Menu.prototype.getBackdropElement = function () {
        return this.backdrop.elementRef.nativeElement;
    };
    /**
     * @private
     */
    Menu.prototype.ngOnDestroy = function () {
        this._menuCtrl.unregister(this);
        this._cntGesture && this._cntGesture.destroy();
        this._menuGesture && this._menuGesture.destroy();
        this._type && this._type.destroy();
        this._resizeUnreg && this._resizeUnreg();
        this._cntEle = null;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Menu.prototype, "content", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Menu.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Menu.prototype, "side", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Menu.prototype, "type", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Menu.prototype, "enabled", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Menu.prototype, "swipeEnabled", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Menu.prototype, "persistent", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Menu.prototype, "maxEdgeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Menu.prototype, "opening", void 0);
    Menu = __decorate([
        core_1.Component({
            selector: 'ion-menu',
            host: {
                'role': 'navigation'
            },
            template: '<ng-content></ng-content>' +
                '<div tappable disable-activated class="backdrop"></div>',
            directives: [core_1.forwardRef(function () { return MenuBackdrop; })]
        }), 
        __metadata('design:paramtypes', [menu_controller_1.MenuController, core_1.ElementRef, config_1.Config, platform_1.Platform, core_1.Renderer, keyboard_1.Keyboard, core_1.NgZone])
    ], Menu);
    return Menu;
}(ion_1.Ion));
exports.Menu = Menu;
/**
 * @private
 */
var MenuBackdrop = (function () {
    function MenuBackdrop(_menuCtrl, elementRef) {
        this._menuCtrl = _menuCtrl;
        this.elementRef = elementRef;
        _menuCtrl.backdrop = this;
    }
    /**
     * @private
     */
    MenuBackdrop.prototype.clicked = function (ev) {
        void 0;
        ev.preventDefault();
        ev.stopPropagation();
        this._menuCtrl.close();
    };
    MenuBackdrop = __decorate([
        core_1.Directive({
            selector: '.backdrop',
            host: {
                '(click)': 'clicked($event)',
            }
        }),
        __param(0, core_1.Host()), 
        __metadata('design:paramtypes', [Menu, core_1.ElementRef])
    ], MenuBackdrop);
    return MenuBackdrop;
}());
exports.MenuBackdrop = MenuBackdrop;
