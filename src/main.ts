/* eslint-disable node/no-unpublished-import */
/* eslint-disable no-undef */
// eslint-disable-next-line node/no-extraneous-import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {computed, createApp} from 'vue';
import {store, key} from './store';
import i18n from './i18n';
import VueScreen from 'vue-screen';
import App from './App.vue';
createApp(App)
  .use(store(i18n), key)
  .use(VueScreen, 'bootstrap')
  .use(i18n)
  .mount('#app');

//store.commit('setLang', navigator.language.substr(0, 2).toLowerCase());
i18n.global.locale.value = navigator.language.substr(0, 2).toLowerCase();
console.log(i18n);
