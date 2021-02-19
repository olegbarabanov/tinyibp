/* eslint-disable no-undef */
// eslint-disable-next-line node/no-extraneous-import
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import Vuex from 'vuex';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import App from './App.vue';
import VueI18n from 'vue-i18n';
import FilterProcessor from './filters/FilterProcessor';
import SUPPORT_FILTERS from './filters/index';
import ResizeFilter from './components/ResizeFilter.vue';
import ContrastFilter from './components/ContrastFilter.vue';
import GrayscaleFilter from './components/GrayscaleFilter.vue';
import OpacityFilter from './components/OpacityFilter.vue';
import SaturateFilter from './components/SaturateFilter.vue';
import BlurFilter from './components/BlurFilter.vue';
import OverlayFilter from './components/OverlayFilter.vue';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import {FilterMap} from './filters/FilterInterface';
import CropFilter from './components/CropFilter.vue';
import ImageProcessor from './filters/ImageProcessor';

const tttt = 1;
console.log(tttt);

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.component('ResizeFilter', ResizeFilter);
Vue.component('ContrastFilter', ContrastFilter);
Vue.component('GrayscaleFilter', GrayscaleFilter);
Vue.component('OpacityFilter', OpacityFilter);
Vue.component('SaturateFilter', SaturateFilter);
Vue.component('BlurFilter', BlurFilter);
Vue.component('OverlayFilter', OverlayFilter);
Vue.component('CropFilter', CropFilter);

const filterProcessor = new FilterProcessor();
const DEFAULT_LANG = 'en';

SUPPORT_FILTERS.forEach(filter => {
  filterProcessor.getFilterFactory().registerFilter(filter);
});

const imageProcessor = new ImageProcessor(filterProcessor);

const i18n = new VueI18n({
  locale: navigator.language.substr(0, 2).toLowerCase(), // set locale
});

const store = new Vuex.Store({
  state() {
    const imageProcessor = new ImageProcessor(filterProcessor);
    return {
      user: {
        lang: DEFAULT_LANG as string, // see ISO 639-1
      },
      registeredFilters: filterProcessor
        .getFilterFactory()
        .getFilterCollection()
        .map(filter => new filter().name),
      filterMaps: [] as Array<FilterMap>,
      fileList: [] as Array<File>,
      showFileIndex: null as null | number,
      quality: imageProcessor.getQuality(),
      type: imageProcessor.getType(),
      nameTrasfrotmPattern: imageProcessor.getNameTransformPattern(),
    };
  },
  mutations: {
    setlang(state: any, lang: string = DEFAULT_LANG) {
      state.user.lang = lang;
      i18n.locale = lang;
    },
    removeFilter(state, index: number) {
      state.filterMaps.splice(index, 1);
    },
    setFilter(state, filter: FilterMap) {
      state.filterMaps.push(filter);
    },
    // eslint-disable-next-line no-undef
    setFile(state, file: File) {
      state.fileList.push(file);
    },
    deleteFile(state, index: number) {
      if (state.fileList[index] === undefined) return false;
      state.fileList.splice(index, 1);
      if (state.fileList.length === 0) {
        this.commit('showFile', null);
      } else if (index >= state.fileList.length) {
        this.commit('showFile', index - 1);
      }
      return true;
    },
    showFile(state, index: number | null) {
      state.showFileIndex = index;
    },
  },
  actions: {
    initFilter(store, name: string) {
      const filter = filterProcessor.getFilterFactory().findFilter(name);
      if (!filter) return false;
      store.commit('setFilter', new filter().getPropertyMap());
    },
    runFilterProcessor(store) {
      return filterProcessor.run(
        store.getters.fileList,
        store.getters.filterMaps
      );
    },
    async runFilterProcessorForOne(store, {index, ignoreFilter = false}) {
      const file = store.getters.fileList[index];
      if (!file) return null;
      return await filterProcessor.run(
        file,
        ignoreFilter ? [] : store.getters.filterMaps
      );
    },
    async downloadImages(store, method = 'common') {
      //var zip = new JSZip();
      const imageProcessor = new ImageProcessor(filterProcessor);
      imageProcessor.setQuality(store.state.quality);
      imageProcessor.setType(store.state.type);
      imageProcessor.setNameTransformPattern(store.state.nameTrasfrotmPattern);
      imageProcessor.setFilterMaps(store.getters.filterMaps);

      if (method === 'common') {
        await Promise.all(
          store.getters.fileList.map(async (file: File) => {
            const result = await imageProcessor.run(file);
            const blob = await (result as any).convertToBlob({
              type: 'image/jpeg',
              quality: 0.95,
            });

            FileSaver.saveAs(blob, 'file.jpg');
          })
        );
        return true;
      }
    },
  },
  getters: {
    filterMaps: state => {
      return state.filterMaps;
    },
    fileList: state => {
      return state.fileList;
    },
  },
});

new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');

// ---- INIT ---
store.commit('setlang', navigator.language.substr(0, 2).toLowerCase());
