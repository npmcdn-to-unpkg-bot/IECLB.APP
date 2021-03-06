import { NgZone } from 'angular2/core';
import { Config } from '../../config/config';
import { ClickBlock } from '../../util/click-block';
/**
 * App utility service.  Allows you to look up components that have been
 * registered using the [Id directive](../Id/).
 */
export declare class IonicApp {
    private _config;
    private _clickBlock;
    private _zone;
    private _cmps;
    private _disTime;
    private _scrollTime;
    private _title;
    private _titleSrv;
    private _isProd;
    constructor(_config: Config, _clickBlock: ClickBlock, _zone: NgZone);
    /**
     * Sets the document title.
     * @param {string} val  Value to set the document title to.
     */
    setTitle(val: string): void;
    /**
     * Returns if the app has been set to be in be in production mode or not.
     * Production mode can only be set within the config of `@App`. Defaults
     * to `false`.
     * @return {boolean}
     */
    isProd(): boolean;
    /**
     * @private
     */
    setProd(val: boolean): void;
    /**
     * @private
     * Sets if the app is currently enabled or not, meaning if it's
     * available to accept new user commands. For example, this is set to `false`
     * while views transition, a modal slides up, an action-sheet
     * slides up, etc. After the transition completes it is set back to `true`.
     * @param {boolean} isEnabled
     * @param {boolean} fallback  When `isEnabled` is set to `false`, this argument
     * is used to set the maximum number of milliseconds that app will wait until
     * it will automatically enable the app again. It's basically a fallback incase
     * something goes wrong during a transition and the app wasn't re-enabled correctly.
     */
    setEnabled(isEnabled: boolean, duration?: number): void;
    /**
     * @private
     * Boolean if the app is actively enabled or not.
     * @return {boolean}
     */
    isEnabled(): boolean;
    /**
     * @private
     */
    setScrolling(): void;
    /**
     * Boolean if the app is actively scrolling or not.
     * @return {boolean}
     */
    isScrolling(): boolean;
    /**
     * @private
     * Register a known component with a key, for easy lookups later.
     * @param {string} id  The id to use to register the component
     * @param {object} component  The component to register
     */
    register(id: string, component: any): void;
    /**
     * @private
     * Unregister a known component with a key.
     * @param {string} id  The id to use to unregister
     */
    unregister(id: string): void;
    /**
     * @private
     * Get a registered component with the given type (returns the first)
     * @param {object} cls the type to search for
     * @return {object} the matching component, or undefined if none was found
     */
    getRegisteredComponent(cls: any): any;
    /**
     * Get the component for the given key.
     */
    getComponent(id: string): any;
}
