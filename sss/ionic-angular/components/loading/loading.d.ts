import { ViewController } from '../nav/view-controller';
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
export declare class Loading extends ViewController {
    constructor(opts?: LoadingOptions);
    /**
    * @private
    */
    getTransitionName(direction: string): any;
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
    static create(opts?: LoadingOptions): Loading;
}
export interface LoadingOptions {
    spinner?: string;
    content?: string;
    showBackdrop?: boolean;
    dismissOnPageChange?: boolean;
    delay?: number;
    duration?: number;
}
