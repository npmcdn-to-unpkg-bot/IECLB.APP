import { Type, TemplateRef, ViewContainerRef, ElementRef, Renderer } from 'angular2/core';
import { Navbar } from '../navbar/navbar';
import { NavController, NavOptions } from './nav-controller';
import { NavParams } from './nav-params';
/**
 * @name ViewController
 * @description
 * Access various features and information about the current view
 * @usage
 *  ```ts
 *  import {Page, ViewController} from 'ionic-angular';
 *  @Page....
 *  export class MyPage{
 *   constructor(viewCtrl: ViewController){
 *     this.viewCtrl = viewCtrl;
 *   }
 *  }
 *  ```
 */
export declare class ViewController {
    componentType: Type;
    private _cntDir;
    private _cntRef;
    private _destroys;
    private _hdAttr;
    private _leavingOpts;
    private _loaded;
    private _nbDir;
    private _nbTmpRef;
    private _nbVwRef;
    private _onDismiss;
    private _pgRef;
    protected _nav: NavController;
    /**
     * @private
     */
    data: any;
    /**
     * @private
     */
    id: string;
    /**
     * @private
     */
    instance: any;
    /**
     * @private
     */
    state: string;
    /**
     * @private
     */
    viewType: string;
    /**
     * @private
     */
    onReady: Function;
    /**
     * @private
     * If this is currently the active view, then set to false
     * if it does not want the other views to fire their own lifecycles.
     */
    fireOtherLifecycles: boolean;
    /**
     * @private
     */
    isOverlay: boolean;
    /**
     * @private
     */
    usePortal: boolean;
    /**
     * @private
     */
    zIndex: number;
    /**
     * @private
     */
    private _emitter;
    constructor(componentType?: Type, data?: any);
    subscribe(generatorOrNext?: any): any;
    /**
     * @private
     */
    emit(data?: any): void;
    onDismiss(callback: Function): void;
    dismiss(data?: any, role?: any): Promise<any>;
    /**
     * @private
     */
    setNav(navCtrl: NavController): void;
    /**
     * @private
     */
    getTransitionName(direction: string): string;
    /**
     * @private
     */
    getNavParams(): NavParams;
    /**
     * @private
     */
    setLeavingOpts(opts: NavOptions): void;
    /**
     * Check to see if you can go back in the navigation stack
     * @param {boolean} Check whether or not you can go back from this page
     * @returns {boolean} Returns if it's possible to go back from this Page.
     */
    enableBack(): boolean;
    /**
     * @private
     */
    setInstance(instance: any): void;
    /**
     * @private
     */
    name: string;
    /**
     * You can find out the index of the current view is in the current navigation stack
     *
     * ```typescript
     *  export class Page1 {
     *    constructor(view: ViewController){
     *      this.view = view;
     *      // Just log out the index
     *      console.log(this.view.index);
     *    }
     *  }
     * ```
     *
     * @returns {number} Returns the index of this page within its NavController.
     */
    index: number;
    /**
     * @private
     */
    private isRoot();
    /**
     * @returns {boolean} Returns if this Page is the first in the stack of pages within its NavController.
     */
    isFirst(): boolean;
    /**
     * @returns {boolean} Returns if this Page is the last in the stack of pages within its NavController.
     */
    isLast(): boolean;
    /**
     * @private
     */
    domShow(shouldShow: boolean, renderer: Renderer): void;
    /**
     * @private
     */
    setZIndex(zIndex: number, renderer: Renderer): void;
    /**
     * @private
     */
    setNavbarTemplateRef(templateRef: TemplateRef): void;
    /**
     * @private
     */
    getNavbarTemplateRef(): TemplateRef;
    /**
     * @private
     */
    getNavbarViewRef(): ViewContainerRef;
    /**
     * @private
     */
    setNavbarViewRef(viewContainerRef: ViewContainerRef): void;
    /**
     * @private
     */
    setPageRef(elementRef: ElementRef): void;
    /**
     * @private
     * @returns {elementRef} Returns the Page's ElementRef
     */
    pageRef(): ElementRef;
    /**
     * @private
     */
    setContentRef(elementRef: ElementRef): void;
    /**
     * @private
     * @returns {elementRef} Returns the Page's Content ElementRef
     */
    contentRef(): ElementRef;
    /**
     * @private
     */
    setContent(directive: any): void;
    /**
     * @private
     * @returns {component} Returns the Page's Content component reference.
     */
    getContent(): any;
    /**
     * @private
     */
    setNavbar(directive: Navbar): void;
    /**
     * @private
     */
    getNavbar(): Navbar;
    /**
     * You can find out of the current view has a Navbar or not. Be sure to wrap this in an `onPageWillEnter` method in order to make sure the view has rendered fully.
     *
     * ```typescript
     * export class Page1 {
     *  constructor(view: ViewController) {
     *    this.view = view
     *  }
     *  onPageWillEnter(){
     *    console.log('Do we have a Navbar?', this.view.hasNavbar());
     *  }
     *}
     * ```
     *
     * @returns {boolean} Returns a boolean if this Page has a navbar or not.
     */
    hasNavbar(): boolean;
    /**
     * @private
     */
    navbarRef(): ElementRef;
    /**
     * @private
     */
    titleRef(): ElementRef;
    /**
     * @private
     */
    navbarItemRefs(): Array<ElementRef>;
    /**
     * @private
     */
    backBtnRef(): ElementRef;
    /**
     * @private
     */
    backBtnTextRef(): ElementRef;
    /**
     * @private
     */
    navbarBgRef(): ElementRef;
    /**
     * You can change the text of the back button on a view-by-view basis.
     *
     * ```ts
     * export class MyClass{
     *  constructor(viewCtrl: ViewController){
     *    this.viewCtrl = viewCtrl
     *  }
     *  onPageWillEnter() {
     *    this.viewCtrl.setBackButtonText('Previous');
     *  }
     * }
     * ```
     * Make sure you use the view events when calling this method, otherwise the back-button will not have been created
     *
     * @param {string} backButtonText Set the back button text.
     */
    setBackButtonText(val: string): void;
    /**
     * Set if the back button for the current view is visible or not. Be sure to wrap this in `onPageWillEnter` to make sure the has been compleltly rendered.
     * @param {boolean} Set if this Page's back button should show or not.
     */
    showBackButton(shouldShow: boolean): void;
    /**
     * @private
     */
    isLoaded(): boolean;
    /**
     * @private
     * The view has loaded. This event only happens once per view being
     * created. If a view leaves but is cached, then this will not
     * fire again on a subsequent viewing. This method is a good place
     * to put your setup code for the view; however, it is not the
     * recommended method to use when a view becomes active.
     */
    loaded(): void;
    /**
     * @private
     * The view is about to enter and become the active view.
     */
    willEnter(): void;
    /**
     * @private
     * The view has fully entered and is now the active view. This
     * will fire, whether it was the first load or loaded from the cache.
     */
    didEnter(): void;
    /**
     * @private
     * The view has is about to leave and no longer be the active view.
     */
    willLeave(): void;
    /**
     * @private
     * The view has finished leaving and is no longer the active view. This
     * will fire, whether it is cached or unloaded.
     */
    didLeave(): void;
    /**
     * @private
     * The view is about to be destroyed and have its elements removed.
     */
    willUnload(): void;
    /**
     * @private
     */
    addDestroy(destroyFn: Function): void;
    /**
     * @private
     */
    destroy(): void;
}
