import { ViewController } from '../nav/view-controller';
/**
 * @name ActionSheet
 * @description
 * An Action Sheet is a dialog that lets the user choose from a set of
 * options. It appears on top of the app's content, and must be manually
 * dismissed by the user before they can resume interaction with the app.
 * Dangerous (destructive) options are made obvious in `ios` mode. There are easy
 * ways to cancel out of the action sheet, such as tapping the backdrop or
 * hitting the escape key on desktop.
 *
 * An action sheet is created from an array of `buttons`, with each button
 * including properties for its `text`, and optionally a `handler` and `role`.
 * If a handler returns `false` then the action sheet will not be dismissed. An
 * action sheet can also optionally have a `title` and a `subTitle`.
 *
 * A button's `role` property can either be `destructive` or `cancel`. Buttons
 * without a role property will have the default look for the platform. Buttons
 * with the `cancel` role will always load as the bottom button, no matter where
 * they are in the array. All other buttons will be displayed in the order they
 * have been added to the `buttons` array. Note: We recommend that `destructive`
 * buttons are always the first button in the array, making them the top button.
 * Additionally, if the action sheet is dismissed by tapping the backdrop, then
 * it will fire the handler from the button with the cancel role.
 *
 * You can pass all of the action sheet's options in the first argument of
 * the create method: `ActionSheet.create(opts)`. Otherwise the action sheet's
 * instance has methods to add options, like `setTitle()` or `addButton()`.
 *
 * @usage
 * ```ts
 * constructor(nav: NavController) {
 *   this.nav = nav;
 * }
 *
 * presentActionSheet() {
 *   let actionSheet = ActionSheet.create({
 *     title: 'Modify your album',
 *     buttons: [
 *       {
 *         text: 'Destructive',
 *         role: 'destructive',
 *         handler: () => {
 *           console.log('Destructive clicked');
 *         }
 *       },
 *       {
 *         text: 'Archive',
 *         handler: () => {
 *           console.log('Archive clicked');
 *         }
 *       },
 *       {
 *         text: 'Cancel',
 *         role: 'cancel',
 *         handler: () => {
 *           console.log('Cancel clicked');
 *         }
 *       }
 *     ]
 *   });
 *
 *   this.nav.present(actionSheet);
 * }
 * ```
 *
 * @demo /docs/v2/demos/action-sheet/
 * @see {@link /docs/v2/components#action-sheets ActionSheet Component Docs}
 */
export declare class ActionSheet extends ViewController {
    constructor(opts?: ActionSheetOptions);
    /**
    * @private
    */
    getTransitionName(direction: string): any;
    /**
     * @param {string} title Action sheet title
     */
    setTitle(title: string): void;
    /**
     * @param {string} subTitle Action sheet subtitle
     */
    setSubTitle(subTitle: string): void;
    /**
     * @param {object} button Action sheet button
     */
    addButton(button: any): void;
    /**
     * Open an action sheet with the following options
     *
     * | Option                | Type       | Description                                                     |
     * |-----------------------|------------|-----------------------------------------------------------------|
     * | title                 |`string`    | The title for the actionsheet                                   |
     * | subTitle              |`string`    | The sub-title for the actionsheet                               |
     * | cssClass              |`string`    | An additional class for custom styles                           |
     * | enableBackdropDismiss |`boolean`   | If the actionsheet should close when the user taps the backdrop |
     * | buttons               |`array<any>`| An array of buttons to display                                  |
     *
     * For the buttons:
     *
     * | Option   | Type     | Description                                                                                                                                      |
     * |----------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
     * | text     | `string` | The buttons text                                                                                                                                 |
     * | icon     | `icon`   | The buttons icons                                                                                                                                |
     * | handler  | `any`    | An express the button should evaluate                                                                                                            |
     * | cssClass | `string` | An additional class for custom styles                                                                                                            |
     * | role     | `string` | How the button should be displayed, `destructive` or `cancel`. If not role is provided, it will display the button without any additional styles |
     *
     *
     *
     * @param {object} opts Action sheet options
     */
    static create(opts?: ActionSheetOptions): ActionSheet;
}
export interface ActionSheetOptions {
    title?: string;
    subTitle?: string;
    cssClass?: string;
    buttons?: Array<any>;
    enableBackdropDismiss?: boolean;
}
