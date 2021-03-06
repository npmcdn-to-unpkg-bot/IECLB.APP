import { ElementRef, NgZone } from 'angular2/core';
import { Ion } from '../ion';
import { IonicApp } from '../app/app';
import { Config } from '../../config/config';
import { ViewController } from '../nav/view-controller';
/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area with some useful
 * methods to control the scrollable area.
 *
 * The content area can also implement pull-to-refresh with the
 * [Refresher](../../scroll/Refresher) component.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Add your content here!
 * </ion-content>
 * ```
 *
 */
export declare class Content extends Ion {
    private _elementRef;
    private _config;
    private _app;
    private _zone;
    private _padding;
    private _scroll;
    private _scLsn;
    /**
     * @private
     */
    scrollElement: HTMLElement;
    constructor(_elementRef: ElementRef, _config: Config, _app: IonicApp, _zone: NgZone, viewCtrl: ViewController);
    /**
     * @private
     */
    ngOnInit(): void;
    /**
     * @private
     */
    ngOnDestroy(): void;
    /**
     * @private
     * Adds the specified scroll handler to the content' scroll element.
     *
     * ```ts
     * @Page({
     *   template: `<ion-content id="my-content"></ion-content>`
     * )}
     * export class MyPage{
     *    constructor(app: IonicApp){
     *        this.app = app;
     *    }
     *   // Need to wait until the component has been initialized
     *   ngAfterViewInit() {
     *     // Here 'my-content' is the ID of my ion-content
     *     this.content = this.app.getComponent('my-content');
     *     this.content.addScrollListener(this.myScroll);
     *   }
     *     myScroll() {
     *      console.info('They see me scrolling...');
     *    }
     * }
     * ```
     * @param {Function} handler  The method you want perform when scrolling
     * @returns {Function} A function that removes the scroll handler.
     */
    addScrollListener(handler: any): Function;
    /**
     * @private
     */
    addTouchStartListener(handler: any): Function;
    /**
     * @private
     */
    addTouchMoveListener(handler: any): Function;
    /**
     * @private
     */
    addTouchEndListener(handler: any): Function;
    /**
     * @private
     */
    addMouseDownListener(handler: any): Function;
    /**
     * @private
     */
    addMouseUpListener(handler: any): Function;
    /**
     * @private
     */
    addMouseMoveListener(handler: any): Function;
    private _addListener(type, handler);
    /**
     * @private
     * Call a method when scrolling has stopped
     * @param {Function} callback The method you want perform when scrolling has ended
     */
    onScrollEnd(callback: Function): void;
    onScrollElementTransitionEnd(callback: Function): void;
    /**
     * Scroll to the specified position.
     *
     * ```ts
     * @Page({
     *   template: `<ion-content id="my-content">
     *      <button (click)="scrollTo()"> Down 500px</button>
     *   </ion-content>`
     * )}
     * export class MyPage{
     *    constructor(app: IonicApp){
     *        this.app = app;
     *    }
     *   // Need to wait until the component has been initialized
     *   ngAfterViewInit() {
     *     // Here 'my-content' is the ID of my ion-content
     *     this.content = this.app.getComponent('my-content');
     *   }
     *    scrollTo() {
     *      this.content.scrollTo(0, 500, 200);
     *    }
     * }
     * ```
     * @param {number} x  The x-value to scroll to.
     * @param {number} y  The y-value to scroll to.
     * @param {number} duration  Duration of the scroll animation in ms.
     * @returns {Promise} Returns a promise when done
     */
    scrollTo(x: number, y: number, duration: number): Promise<any>;
    /**
     * Scroll to the top of the content component.
     *
     * ```ts
     * @Page({
     *   template: `<ion-content id="my-content">
     *      <button (click)="scrollTop()"> Down 500px</button>
     *   </ion-content>`
     * )}
     * export class MyPage{
     *    constructor(app: IonicApp){
     *        this.app = app;
     *    }
     *   // Need to wait until the component has been initialized
     *   ngAfterViewInit() {
     *     // Here 'my-content' is the ID of my ion-content
     *     this.content = this.app.getComponent('my-content');
     *   }
     *    scrollTop() {
     *      this.content.scrollToTop();
     *    }
     * }
     * ```
     * @returns {Promise} Returns a promise when done
     */
    scrollToTop(duration?: number): Promise<any>;
    /**
     * @private
     */
    jsScroll(onScrollCallback: Function): Function;
    /**
     * @private
     */
    getScrollTop(): number;
    /**
     * @private
     */
    setScrollTop(top: number): void;
    /**
     * @private
     */
    addCssClass(className: string): void;
    /**
     * @private
     */
    removeCssClass(className: string): void;
    /**
     * @private
     */
    setScrollElementStyle(prop: string, val: any): void;
    /**
     * Returns the content and scroll elements' dimensions.
     * @returns {object} dimensions  The content and scroll elements' dimensions
     * {number} dimensions.contentHeight  content offsetHeight
     * {number} dimensions.contentTop  content offsetTop
     * {number} dimensions.contentBottom  content offsetTop+offsetHeight
     * {number} dimensions.contentWidth  content offsetWidth
     * {number} dimensions.contentLeft  content offsetLeft
     * {number} dimensions.contentRight  content offsetLeft + offsetWidth
     * {number} dimensions.scrollHeight  scroll scrollHeight
     * {number} dimensions.scrollTop  scroll scrollTop
     * {number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
     * {number} dimensions.scrollWidth  scroll scrollWidth
     * {number} dimensions.scrollLeft  scroll scrollLeft
     * {number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
     */
    getContentDimensions(): {
        contentHeight: number;
        contentTop: number;
        contentBottom: number;
        contentWidth: number;
        contentLeft: number;
        contentRight: number;
        scrollHeight: number;
        scrollTop: number;
        scrollBottom: number;
        scrollWidth: number;
        scrollLeft: number;
        scrollRight: number;
    };
    /**
     * @private
     * Adds padding to the bottom of the scroll element when the keyboard is open
     * so content below the keyboard can be scrolled into view.
     */
    addScrollPadding(newPadding: any): void;
}
