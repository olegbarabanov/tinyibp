/* eslint-disable no-undef */
// eslint-disable-next-line node/no-extraneous-import
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
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
import ImageProcessor, {SupportMimesTypes} from './filters/ImageProcessor';

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

interface RootState {
  lang: string;
  registeredFilters: Array<string>;
  filterMaps: Array<FilterMap>;
  fileList: Array<File>;
  showFileIndex: number | null;
  quality: number;
  type: SupportMimesTypes | null;
  nameTransformPattern: string;
}

const initStore: StoreOptions<RootState> = {
  state() {
    const imageProcessor = new ImageProcessor(filterProcessor);
    return {
      lang: DEFAULT_LANG as string, // see ISO 639-1
      registeredFilters: filterProcessor
        .getFilterFactory()
        .getFilterCollection()
        .map(filter => new filter().name),
      filterMaps: [],
      fileList: [],
      showFileIndex: null,
      quality: imageProcessor.getQuality(),
      type: imageProcessor.getType(),
      nameTransformPattern: imageProcessor.getNameTransformPattern(),
    };
  },
  mutations: {
    setLang(state, lang: string = DEFAULT_LANG) {
      state.lang = lang;
      i18n.locale = lang;
    },
    removeFilter(state, index: number) {
      state.filterMaps.splice(index, 1);
    },
    setFilter(state, filter: FilterMap) {
      state.filterMaps.push(filter);
    },
    setFile(state, file: File) {
      state.fileList.push(file);
    },
    commitDeleteFile(state, index: number) {
      state.fileList.splice(index, 1);
      return true;
    },
    commitSetType(state, type: SupportMimesTypes) {
      state.type = type;
    },
    commitSetQuality(state, quality: number) {
      state.quality = quality;
    },
    commitSetNameTransformPattern(state, pattern: string) {
      state.nameTransformPattern = pattern;
    },
    showFile(state, index: number | null) {
      state.showFileIndex = index;
    },
  },
  actions: {
    async setType(store, type: SupportMimesTypes) {
      store.commit('commitSetType', type);
    },
    async setQuality(store, quality: number) {
      store.commit('commitSetQuality', quality);
    },
    async setNameTransformPattern(store, pattern: string) {
      store.commit('commitSetNameTransformPattern', pattern);
    },
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
    async deleteFile(store, index: number) {
      if (store.state.fileList[index] === undefined) return false;
      store.commit('commitDeleteFile', index);
      if (store.state.fileList.length === 0) {
        this.commit('showFile', null);
      } else if (index >= store.state.fileList.length) {
        this.commit('showFile', index - 1);
      }
    },
    async runFilterProcessorForOne(store, index) {
      const file = store.getters.fileList[index];
      if (!file) return null;
      const imageProcessor = new ImageProcessor(filterProcessor);
      imageProcessor.setQuality(store.state.quality);
      imageProcessor.setType(store.state.type);
      imageProcessor.setNameTransformPattern(store.state.nameTransformPattern);
      imageProcessor.setFilterMaps(store.getters.filterMaps);
      return await imageProcessor.run(file);
    },
    async downloadImages(store, method = 'common') {
      //var zip = new JSZip();
      const imageProcessor = new ImageProcessor(filterProcessor);
      imageProcessor.setQuality(store.state.quality);
      imageProcessor.setType(store.state.type);
      imageProcessor.setNameTransformPattern(store.state.nameTransformPattern);
      imageProcessor.setFilterMaps(store.getters.filterMaps);

      if (method === 'common') {
        await Promise.all(
          store.getters.fileList.map(async (file: File) => {
            const blob = await imageProcessor.run(file);
            FileSaver.saveAs(blob, blob.name);
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
};

const store = new Vuex.Store(initStore);

new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');

// ---- INIT ---
store.commit('setLang', navigator.language.substr(0, 2).toLowerCase());
