/* eslint-disable node/no-unpublished-import */
/* eslint-disable no-undef */
// eslint-disable-next-line node/no-extraneous-import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {createApp} from 'vue';
import {store, key} from './store';
import i18n from './i18n';
import VueScreen from 'vue-screen';
import App from './App.vue';
// import * as pack from '../package.json';
// console.log(pack.version);

createApp(App)
  .use(store, key)
  .use(VueScreen, 'bootstrap')
  .use(i18n)
  .mount('#app');
