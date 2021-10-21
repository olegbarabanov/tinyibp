/* eslint-disable no-undef */
// eslint-disable-next-line node/no-extraneous-import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
//import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import App from './App.vue';
import VueI18n from 'vue-i18n';
import ResizeFilter from './components/resize-filter.vue';
import ContrastFilter from './components/contrast-filter.vue';
import GrayscaleFilter from './components/grayscale-filter.vue';
import OpacityFilter from './components/opacity-filter.vue';
import SaturateFilter from './components/saturate-filter.vue';
import BlurFilter from './components/blur-filter.vue';
import OverlayFilter from './components/overlay-filter.vue';
// import JSZip from 'jszip';
// import FileSaver from 'file-saver';
import CropFilter from './components/crop-filter.vue';
import RotateFilter from './components/rotate-filter.vue';
import ColorReplacementFilter from './components/color-replacement-filter.vue';
import VueScreen from 'vue-screen';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import {
  FilterMap,
  FilterProcessor,
  SupportMimesTypes,
  SUPPORT_FILTERS,
} from './image-processor';
import ImageBuilderWorkerManager from './image-processor/image-builder-worker-manager';
import {ImageBuilderWorkerProxy} from './image-processor/image-builder-worker-proxy';

Vue.config.productionTip = false;
Vue.use(VueScreen, 'bootstrap');
Vue.use(VueI18n);
Vue.use(Vuex);
//Vue.use(BootstrapVue);
//Vue.use(BootstrapVueIcons);

Vue.component('ResizeFilter', ResizeFilter);
Vue.component('ContrastFilter', ContrastFilter);
Vue.component('GrayscaleFilter', GrayscaleFilter);
Vue.component('OpacityFilter', OpacityFilter);
Vue.component('SaturateFilter', SaturateFilter);
Vue.component('BlurFilter', BlurFilter);
Vue.component('OverlayFilter', OverlayFilter);
Vue.component('CropFilter', CropFilter);
Vue.component('RotateFilter', RotateFilter);
Vue.component('ColorReplacementFilter', ColorReplacementFilter);

const filterProcessor = new FilterProcessor();
const DEFAULT_LANG = 'en';
console.log(SUPPORT_FILTERS);
SUPPORT_FILTERS.forEach(filter => {
  filterProcessor.getFilterFactory().registerFilter(filter);
});

ImageBuilderWorkerManager.getInstance().setMaxWorker(2);

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
  type?: SupportMimesTypes;
  nameTransformPattern: string;
}

const initStore: StoreOptions<RootState> = {
  state() {
    // console.log(filterProcessor.getFilterFactory().getFilterCollection());
    return {
      lang: DEFAULT_LANG as string, // see ISO 639-1
      registeredFilters: filterProcessor
        .getFilterFactory()
        .getFilterCollection()
        .map(filter => new filter().name),
      filterMaps: [],
      fileList: [],
      showFileIndex: null,
      quality: 90,
      type: undefined,
      nameTransformPattern: '@file',
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
      } else if (index === store.state.showFileIndex) {
        this.commit('showFile', null);
        setTimeout(() => this.commit('showFile', index)); //force update
      }
    },
    async downloadAll(store, method = 'common') {
      const fileList = store.getters.fileList;
      let fileIndexNotProcessed = 0;

      const buildFile = async (file: File) => {
        const imageBuilder = new ImageBuilderWorkerProxy(file);
        imageBuilder.setQuality(store.state.quality);
        if (store.state.type) imageBuilder.setType(store.state.type);
        imageBuilder.setNameTransformPattern(store.state.nameTransformPattern);
        imageBuilder.setFilterMap(store.getters.filterMaps);
        return await imageBuilder.buildFile();
      };

      const runner = async (fileHandler: (file: File) => void) => {
        while (fileIndexNotProcessed < fileList.length) {
          const index = fileIndexNotProcessed++;
          const file = fileList[index];
          const resultFile = await buildFile(file);
          fileHandler(resultFile);
        }
      };

      const process = async (fileHandler: (file: File) => void) => {
        const maxRunners = ImageBuilderWorkerManager.getInstance().getMaxWorker();
        const runnerList = [];
        for (let i = 0; i < maxRunners; i++)
          runnerList.push(runner(fileHandler));
        await Promise.all(runnerList);
      };
      if (method === 'common') {
        await process((file: File) => FileSaver.saveAs(file, file.name));
        return true;
      } else if (method === 'zip') {
        const zip = new JSZip();
        const listUsingFilenames = new Set();
        await process((file: File) => {
          let name = file.name;
          if (listUsingFilenames.has(name)) {
            for (let i = 1; listUsingFilenames.has(name); i++) {
              name = name.replace(/(.*)\.(.*)/, `$1 (${i}).$2`);
            }
          }
          listUsingFilenames.add(name);
          zip.file(name, file);
        });
        const zipFile = await zip.generateAsync({type: 'blob'});
        FileSaver.saveAs(zipFile, 'TinyIBP-' + Date.now());
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
