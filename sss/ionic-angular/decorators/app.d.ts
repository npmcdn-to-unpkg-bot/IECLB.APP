import { ChangeDetectionStrategy, ViewEncapsulation, Type } from 'angular2/core';
export interface AppMetadata {
    prodMode?: boolean;
    selector?: string;
    inputs?: string[];
    outputs?: string[];
    properties?: string[];
    events?: string[];
    host?: {
        [key: string]: string;
    };
    providers?: any[];
    directives?: Array<Type | any[]>;
    pipes?: Array<Type | any[]>;
    exportAs?: string;
    queries?: {
        [key: string]: any;
    };
    template?: string;
    templateUrl?: string;
    moduleId?: string;
    styleUrls?: string[];
    styles?: string[];
    changeDetection?: ChangeDetectionStrategy;
    encapsulation?: ViewEncapsulation;
    config?: any;
}
/**
* @name App
* @description
* App is an Ionic decorator that bootstraps an application. It can be passed a
* number of arguments that act as global config variables for the app.
* `@App` is similar to Angular's `@Component` in which it can accept a `template`
* property that has an inline template, or a `templateUrl` property that points
* to an external html template.
*
* @usage
* ```ts
* import {App} from 'ionic-angular';
*
* @App({
*   templateUrl: 'app/app.html',
*   providers: [DataService]
* })
*
* export class MyApp{
*   // Anything we would want to do at the root of our app
* }
* ```
*
* @property {object} [config] - the app's {@link /docs/v2/api/config/Config/ Config} object.
* @property {boolean} [prodMode] - Enable Angular's production mode, which turns off assertions and other checks within the framework. Additionally, this config sets the return value of `isProd()` which is on the `IonicApp` instance. Defaults to `false`.
* @property {array}  [pipes] - any pipes for your app.
* @property {array}  [providers] - any providers for your app.
* @property {string} [template] - the template to use for the app root.
* @property {string} [templateUrl] - a relative URL pointing to the template to use for the app root.
*/
export declare function App(args?: AppMetadata): (cls: any) => any;
