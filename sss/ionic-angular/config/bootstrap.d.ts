import { Provider } from 'angular2/core';
import { Form } from '../util/form';
import { IonicApp } from '../components/app/app';
import { Keyboard } from '../util/keyboard';
import { MenuController } from '../components/menu/menu-controller';
import { TapClick } from '../components/tap-click/tap-click';
import { Translate } from '../translation/translate';
/**
 * @private
 */
export declare function ionicProviders(args?: any): (typeof IonicApp | Provider | typeof TapClick | typeof Form | typeof Keyboard | typeof MenuController | typeof Translate | any[])[];
