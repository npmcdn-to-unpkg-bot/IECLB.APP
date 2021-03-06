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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var config_1 = require('../../config/config');
var content_1 = require('../content/content');
var platform_1 = require('../../platform/platform');
var view_controller_1 = require('../nav/view-controller');
var virtual_item_1 = require('./virtual-item');
var virtual_util_1 = require('./virtual-util');
var util_1 = require('../../util/util');
var dom_1 = require('../../util/dom');
var img_1 = require('../img/img');
/**
 * @name VirtualScroll
 * @description
 * Virtual Scroll displays a virtual, "infinite" list. An array of records
 * is passed to the virtual scroll containing the data to create templates
 * for. The template created for each record, referred to as a cell, can
 * consist of items, headers, and footers.
 *
 * For performance reasons, not every record in the list is rendered at once;
 * instead a small subset of records (enough to fill the viewport) are rendered
 * and reused as the user scrolls.
 *
 * ### The Basics
 *
 * The array of records should be passed to the `virtualScroll` property.
 * The data given to the `virtualScroll` property must be an array. An item
 * template with the `*virtualItem` property is required in the `virtualScroll`.
 * The `virtualScroll` and `*virtualItem` properties can be added to any element.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="#item">
 *     {{ item }}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Section Headers and Footers
 *
 * Section headers and footers are optional. They can be dynamically created
 * from developer-defined functions. For example, a large list of contacts
 * usually has a divider for each letter in the alphabet. Developers provide
 * their own custom function to be called on each record. The logic in the
 * custom function should determine whether to create the section template
 * and what data to provide to the template. The custom function should
 * return `null` if a template shouldn't be created.
 *
 * ```html
 * <ion-list [virtualScroll]="items" [headerFn]="myHeaderFn">
 *
 *   <ion-item-divider *virtualHeader="#header">
 *     Header: {{ header }}
 *   </ion-item>
 *
 *   <ion-item *virtualItem="#item">
 *     Item: {{ item }}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * Below is an example of a custom function called on every record. It
 * gets passed the individual record, the record's index number,
 * and the entire array of records. In this example, after every 20
 * records a header will be inserted. So between the 19th and 20th records,
 * between the 39th and 40th, and so on, a `<ion-item-divider>` will
 * be created and the template's data will come from the function's
 * returned data.
 *
 * ```ts
 * myHeaderFn(record, recordIndex, records) {
 *   if (recordIndex % 20 === 0) {
 *     return 'Header ' + recordIndex;
 *   }
 *   return null;
 * }
 * ```
 *
 *
 * ### Approximate Widths and Heights
 *
 * The approximate width and height of each template is used to help
 * determine how many cells should be created, and to help calculate
 * the height of the scrollable area. Note that the actual rendered size
 * of each cell comes from the app's CSS, whereas this approximation
 * is only used to help calculate initial dimensions.
 *
 * It's also important to know that Ionic's default item sizes have
 * slightly different heights between platforms, which is perfectly fine.
 * An exact pixel-perfect size is not necessary, but a good estimation
 * is important. Basically if each item is roughly 500px tall, rather than
 * the default of 40px tall, it's extremely important to know for virtual
 * scroll to calculate a good height.
 *
 *
 * ### Images Within Virtual Scroll
 *
 * Ionic provides `<ion-img>` to manage HTTP requests and image rendering.
 * Additionally, it includes a customizable placeholder element which shows
 * before the image has finished loading. While scrolling through items
 * quickly, `<ion-img>` knows not to make any image requests, and only loads
 * the images that are viewable after scrolling. It's also important for app
 * developers to ensure image sizes are locked in, and after images have fully
 * loaded they do not change size and affect any other element sizes.
 *
 * We recommend using our `<ion-img>` element over the native `<img>` element
 * because when an `<img>` element is added to the DOM, it immediately
 * makes a HTTP request for the image file. HTTP requests, image
 * decoding, and image rendering can cause issues while scrolling. For virtual
 * scrolling, the natural effects of the `<img>` are not desirable features.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="#item">
 *     <ion-avatar item-left>
 *       <ion-img [src]="item.avatarUrl"></ion-img>
 *     </ion-avatar>
 *     {{ item.firstName }} {{ item.lastName }}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Performance Tips
 *
 * - Use `<ion-img>` rather than `<img>` so images are lazy loaded
 *   while scrolling.
 * - Image sizes should be locked in, meaning the size of any element
 *   should not change after the image has loaded.
 * - Provide an approximate width and height so the virtual scroll can
 *   best calculate the cell height.
 * - Changing the dataset requires the entire virtual scroll to be
 *   reset, which is an expensive operation and should be avoided
 *   if possible.
 * - Do not perform any DOM manipulation within section header and
 *   footer functions. These functions are called for every record in the
 *   dataset, so please make sure they're performant.
 *
 */
var VirtualScroll = (function () {
    function VirtualScroll(_iterableDiffers, _elementRef, _renderer, _zone, _cd, _content, _platform, _ctrl, config) {
        this._iterableDiffers = _iterableDiffers;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._zone = _zone;
        this._cd = _cd;
        this._content = _content;
        this._platform = _platform;
        this._ctrl = _ctrl;
        this._records = [];
        this._cells = [];
        this._nodes = [];
        this._vHeight = 0;
        this._lastCheck = 0;
        this._data = {
            scrollTop: 0,
        };
        this._queue = null;
        /**
         * @input {number} The buffer ratio is used to decide how many cells
         * should get created when initially rendered. The number is a
         * multiplier against the viewable area's height. For example, if it
         * takes `20` cells to fill up the height of the viewable area, then
         * with a buffer ratio of `2` it will create `40` cells that are
         * available for reuse while scrolling. For better performance, it's
         * better to have more cells than what are required to fill the
         * viewable area. Default is `2`.
         */
        this.bufferRatio = 2;
        /**
         * @input {string} The approximate width of each item template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This value can use either `px` or `%` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions. Default is `100%`.
         */
        this.approxItemWidth = '100%';
        /**
         * @input {string} The approximate height of each item template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This height value can only use `px` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions. Default is `40px`.
         */
        this.approxItemHeight = '40px';
        /**
         * @input {string} The approximate width of each header template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This value can use either `px` or `%` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions. Default is `100%`.
         */
        this.approxHeaderWidth = '100%';
        /**
         * @input {string} The approximate height of each header template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This height value can only use `px` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions. Default is `40px`.
         */
        this.approxHeaderHeight = '40px';
        /**
         * @input {string} The approximate width of each footer template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This value can use either `px` or `%` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions. Default is `100%`.
         */
        this.approxFooterWidth = '100%';
        /**
         * @input {string} The approximate height of each footer template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This height value can only use `px` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions. Default is `40px`.
         */
        this.approxFooterHeight = '40px';
        this._eventAssist = config.getBoolean('virtualScrollEventAssist');
    }
    Object.defineProperty(VirtualScroll.prototype, "virtualScroll", {
        /**
         * @input {array} The data that builds the templates within the virtual scroll.
         * This is the same data that you'd pass to `ngFor`. It's important to note
         * that when this data has changed, then the entire virtual scroll is reset,
         * which is an expensive operation and should be avoided if possible.
         */
        set: function (val) {
            this._records = val;
            if (util_1.isBlank(this._differ) && util_1.isPresent(val)) {
                this._differ = this._iterableDiffers.find(val).create(this._cd, this._trackBy);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScroll.prototype, "headerFn", {
        /**
         * @input {function} Section headers and the data used within its given
         * template can be dynamically created by passing a function to `headerFn`.
         * For example, a large list of contacts usually has dividers between each
         * letter in the alphabet. App's can provide their own custom `headerFn`
         * which is called with each record within the dataset. The logic within
         * the header function can decide if the header template should be used,
         * and what data to give to the header template. The function must return
         * `null` if a header cell shouldn't be created.
         */
        set: function (val) {
            if (util_1.isFunction(val)) {
                this._hdrFn = val.bind((this._ctrl && this._ctrl.instance) || this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScroll.prototype, "footerFn", {
        /**
         * @input {function} Section footers and the data used within its given
         * template can be dynamically created by passing a function to `footerFn`.
         * The logic within the footer function can decide if the footer template
         * should be used, and what data to give to the footer template. The function
         * must return `null` if a footer cell shouldn't be created.
         */
        set: function (val) {
            if (util_1.isFunction(val)) {
                this._ftrFn = val.bind((this._ctrl && this._ctrl.instance) || this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScroll.prototype, "virtualTrackBy", {
        /**
         * @input {function} Same as `ngForTrackBy` which can be used on `ngFor`.
         */
        set: function (val) {
            this._trackBy = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    VirtualScroll.prototype.ngDoCheck = function () {
        if (this._init) {
            this.update(true);
        }
    };
    /**
     * @private
     */
    VirtualScroll.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (!this._init) {
            if (!this._itmTmp) {
                throw 'virtualItem required within virtualScroll';
            }
            this.update(true);
            this._platform.onResize(function () {
                void 0;
                _this.update(false);
            });
        }
    };
    /**
     * @private
     * DOM READ THEN DOM WRITE
     */
    VirtualScroll.prototype.update = function (checkChanges) {
        var self = this;
        if (!self._records || !self._records.length)
            return;
        if (checkChanges) {
            if (util_1.isPresent(self._differ)) {
                var changes = self._differ.diff(self._records);
                if (!util_1.isPresent(changes))
                    return;
            }
        }
        void 0;
        // reset everything
        self._cells.length = 0;
        self._nodes.length = 0;
        self._itmTmp.viewContainer.clear();
        self._elementRef.nativeElement.parentElement.scrollTop = 0;
        var attempts = 0;
        function readDimensions(done /* cuz promises add unnecessary overhead here */) {
            if (self._data.valid) {
                // good to go, we already have good dimension data
                done();
            }
            else {
                // ******** DOM READ ****************
                virtual_util_1.calcDimensions(self._data, self._elementRef.nativeElement.parentElement, self.approxItemWidth, self.approxItemHeight, self.approxHeaderWidth, self.approxHeaderHeight, self.approxFooterWidth, self.approxFooterHeight, self.bufferRatio);
                if (self._data.valid) {
                    // sweet, we got some good dimension data!
                    done();
                }
                else if (attempts < 30) {
                    // oh no! the DOM doesn't have good data yet!
                    // let's try again in XXms, and give up eventually if we never get data
                    attempts++;
                    dom_1.raf(function () {
                        readDimensions(done);
                    });
                }
            }
        }
        // ******** DOM READ ****************
        readDimensions(function () {
            // we were able to read good DOM dimension data, let's do this!
            self._init = true;
            virtual_util_1.processRecords(self._data.renderHeight, self._records, self._cells, self._hdrFn, self._ftrFn, self._data);
            // ******** DOM WRITE ****************
            self.renderVirtual();
            // ******** DOM WRITE ****************
            self._renderer.setElementClass(self._elementRef.nativeElement, 'virtual-scroll', true);
            // list for scroll events
            self.addScrollListener();
        });
    };
    /**
     * @private
     * DOM WRITE
     */
    VirtualScroll.prototype.renderVirtual = function () {
        // initialize nodes with the correct cell data
        this._data.topCell = 0;
        this._data.bottomCell = (this._cells.length - 1);
        virtual_util_1.populateNodeData(0, this._data.bottomCell, this._data.viewWidth, true, this._cells, this._records, this._nodes, this._itmTmp.viewContainer, this._itmTmp.templateRef, this._hdrTmp && this._hdrTmp.templateRef, this._ftrTmp && this._ftrTmp.templateRef, true);
        // ******** DOM WRITE ****************
        this._cd.detectChanges();
        // wait a frame before trying to read and calculate the dimensions
        dom_1.raf(this.postRenderVirtual.bind(this));
    };
    /**
     * @private
     * DOM READ THEN DOM WRITE
     */
    VirtualScroll.prototype.postRenderVirtual = function () {
        // ******** DOM READ ****************
        virtual_util_1.calcDimensions(this._data, this._elementRef.nativeElement.parentElement, this.approxItemWidth, this.approxItemHeight, this.approxHeaderWidth, this.approxHeaderHeight, this.approxFooterWidth, this.approxFooterHeight, this.bufferRatio);
        // ******** DOM READ THEN DOM WRITE ****************
        virtual_util_1.initReadNodes(this._nodes, this._cells, this._data);
        // ******** DOM READS ABOVE / DOM WRITES BELOW ****************
        // ******** DOM WRITE ****************
        virtual_util_1.writeToNodes(this._nodes, this._cells, this._records.length);
        // ******** DOM WRITE ****************
        this.setVirtualHeight(virtual_util_1.estimateHeight(this._records.length, this._cells[this._cells.length - 1], this._vHeight, 0.25));
    };
    /**
     * @private
     */
    VirtualScroll.prototype.scrollUpdate = function () {
        dom_1.clearNativeTimeout(this._tmId);
        this._tmId = dom_1.nativeTimeout(this.onScrollEnd.bind(this), SCROLL_END_TIMEOUT_MS);
        var data = this._data;
        if (this._queue === QUEUE_CHANGE_DETECTION) {
            // ******** DOM WRITE ****************
            var node = void 0;
            for (var i = 0; i < this._nodes.length; i++) {
                node = this._nodes[i];
                if (node.hasChanges) {
                    node.view['changeDetectorRef'].detectChanges();
                    node.hasChanges = false;
                }
            }
            if (this._eventAssist) {
                // queue updating node positions in the next frame
                this._queue = QUEUE_WRITE_TO_NODES;
            }
            else {
                // update node positions right now
                // ******** DOM WRITE ****************
                virtual_util_1.writeToNodes(this._nodes, this._cells, this._records.length);
                this._queue = null;
            }
            // ******** DOM WRITE ****************
            this.setVirtualHeight(virtual_util_1.estimateHeight(this._records.length, this._cells[this._cells.length - 1], this._vHeight, 0.25));
        }
        else if (this._queue === QUEUE_WRITE_TO_NODES) {
            // ******** DOM WRITE ****************
            virtual_util_1.writeToNodes(this._nodes, this._cells, this._records.length);
            this._queue = null;
        }
        else {
            data.scrollDiff = (data.scrollTop - this._lastCheck);
            if (Math.abs(data.scrollDiff) > 10) {
                // don't bother updating if the scrollTop hasn't changed much
                this._lastCheck = data.scrollTop;
                if (data.scrollDiff > 0) {
                    // load data we may not have processed yet
                    var stopAtHeight = (data.scrollTop + data.renderHeight);
                    virtual_util_1.processRecords(stopAtHeight, this._records, this._cells, this._hdrFn, this._ftrFn, data);
                }
                // ******** DOM READ ****************
                virtual_util_1.updateDimensions(this._nodes, this._cells, data, false);
                virtual_util_1.adjustRendered(this._cells, data);
                var madeChanges = virtual_util_1.populateNodeData(data.topCell, data.bottomCell, data.viewWidth, data.scrollDiff > 0, this._cells, this._records, this._nodes, this._itmTmp.viewContainer, this._itmTmp.templateRef, this._hdrTmp && this._hdrTmp.templateRef, this._ftrTmp && this._ftrTmp.templateRef, false);
                if (madeChanges) {
                    // do not update images while scrolling
                    this._imgs.toArray().forEach(function (img) {
                        img.enable(false);
                    });
                    // queue making updates in the next frame
                    this._queue = QUEUE_CHANGE_DETECTION;
                }
                else {
                    this._queue = null;
                }
            }
        }
    };
    /**
     * @private
     * DOM WRITE
     */
    VirtualScroll.prototype.onScrollEnd = function () {
        // scrolling is done, allow images to be updated now
        this._imgs.toArray().forEach(function (img) {
            img.enable(true);
        });
        // ******** DOM READ ****************
        virtual_util_1.updateDimensions(this._nodes, this._cells, this._data, false);
        virtual_util_1.adjustRendered(this._cells, this._data);
        // ******** DOM WRITE ****************
        this._cd.detectChanges();
        // ******** DOM WRITE ****************
        this.setVirtualHeight(virtual_util_1.estimateHeight(this._records.length, this._cells[this._cells.length - 1], this._vHeight, 0.05));
    };
    /**
     * @private
     * DOM WRITE
     */
    VirtualScroll.prototype.setVirtualHeight = function (newVirtualHeight) {
        if (newVirtualHeight !== this._vHeight) {
            // ******** DOM WRITE ****************
            this._renderer.setElementStyle(this._elementRef.nativeElement, 'height', newVirtualHeight > 0 ? newVirtualHeight + 'px' : '');
            this._vHeight = newVirtualHeight;
            void 0;
        }
    };
    /**
     * @private
     * NO DOM
     */
    VirtualScroll.prototype.addScrollListener = function () {
        var self = this;
        if (!self._unreg) {
            self._zone.runOutsideAngular(function () {
                function onScroll() {
                    // ******** DOM READ ****************
                    self._data.scrollTop = self._content.getScrollTop();
                    // ******** DOM READ THEN DOM WRITE ****************
                    self.scrollUpdate();
                }
                if (self._eventAssist) {
                    // use JS scrolling for iOS UIWebView
                    // goal is to completely remove this when iOS
                    // fully supports scroll events
                    // listen to JS scroll events
                    self._unreg = self._content.jsScroll(onScroll);
                }
                else {
                    // listen to native scroll events
                    self._unreg = self._content.addScrollListener(onScroll);
                }
            });
        }
    };
    /**
     * @private
     * NO DOM
     */
    VirtualScroll.prototype.ngOnDestroy = function () {
        this._unreg && this._unreg();
        this._unreg = null;
    };
    __decorate([
        core_1.ContentChild(virtual_item_1.VirtualItem), 
        __metadata('design:type', virtual_item_1.VirtualItem)
    ], VirtualScroll.prototype, "_itmTmp", void 0);
    __decorate([
        core_1.ContentChild(virtual_item_1.VirtualHeader), 
        __metadata('design:type', virtual_item_1.VirtualHeader)
    ], VirtualScroll.prototype, "_hdrTmp", void 0);
    __decorate([
        core_1.ContentChild(virtual_item_1.VirtualFooter), 
        __metadata('design:type', virtual_item_1.VirtualFooter)
    ], VirtualScroll.prototype, "_ftrTmp", void 0);
    __decorate([
        core_1.ContentChildren(img_1.Img), 
        __metadata('design:type', core_1.QueryList)
    ], VirtualScroll.prototype, "_imgs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], VirtualScroll.prototype, "virtualScroll", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], VirtualScroll.prototype, "bufferRatio", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], VirtualScroll.prototype, "approxItemWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], VirtualScroll.prototype, "approxItemHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], VirtualScroll.prototype, "approxHeaderWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], VirtualScroll.prototype, "approxHeaderHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], VirtualScroll.prototype, "approxFooterWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], VirtualScroll.prototype, "approxFooterHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Function])
    ], VirtualScroll.prototype, "headerFn", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Function])
    ], VirtualScroll.prototype, "footerFn", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Function])
    ], VirtualScroll.prototype, "virtualTrackBy", null);
    VirtualScroll = __decorate([
        core_1.Directive({
            selector: '[virtualScroll]'
        }),
        __param(7, core_1.Optional()), 
        __metadata('design:paramtypes', [core_1.IterableDiffers, core_1.ElementRef, core_1.Renderer, core_1.NgZone, core_1.ChangeDetectorRef, content_1.Content, platform_1.Platform, view_controller_1.ViewController, config_1.Config])
    ], VirtualScroll);
    return VirtualScroll;
}());
exports.VirtualScroll = VirtualScroll;
var SCROLL_END_TIMEOUT_MS = 140;
var QUEUE_CHANGE_DETECTION = 0;
var QUEUE_WRITE_TO_NODES = 1;
