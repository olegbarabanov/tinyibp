import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import App from "./App.vue";
import VueI18n from "vue-i18n";
import FilterProcessor from "./filters/FilterProcessor";
import SUPPORT_FILTERS from "./filters/index";
import ResizeFilter from "./components/ResizeFilter.vue"
import ContrastFilter from "./components/ContrastFilter.vue"
import ConvertFilter from "./components/ConvertFilter.vue"
import GrayscaleFilter from "./components/GrayscaleFilter.vue"
import OpacityFilter from "./components/OpacityFilter.vue";
import SaturateFilter from "./components/SaturateFilter.vue";
import BlurFilter from "./components/BlurFilter.vue";
import OverlayFilter from "./components/OverlayFilter.vue";
import JSZip from "jszip";
import FileSaver from "file-saver";


Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.component("ResizeFilter", ResizeFilter);
Vue.component("ContrastFilter", ContrastFilter);
Vue.component("ConvertFilter", ConvertFilter);
Vue.component("GrayscaleFilter", GrayscaleFilter);
Vue.component("OpacityFilter", OpacityFilter);
Vue.component("SaturateFilter", SaturateFilter);
Vue.component("BlurFilter", BlurFilter);
Vue.component("OverlayFilter", OverlayFilter);

const filterProcessor = new FilterProcessor();
SUPPORT_FILTERS.map((filter) => {filterProcessor.registerFilter(filter)});

const i18n = new VueI18n({
  locale: navigator.language.substr(0, 2).toLowerCase(), // set locale
});

const store = new Vuex.Store({
  state() {
    return {
      user: {
        lang: String, // see ISO 639-1
      },
      registeredFilters: filterProcessor.getAllFilters().map(filter => filter.name),
      filterList: [],
      fileList: [],
      showFileIndex: null
    };
  },
  mutations: {
    setlang(state: any, lang = "en") {
      state.user.lang = lang;
      i18n.locale = lang;
    },
    removeFilter(state, index) {
      state.filterList.splice(index, 1);
    },
    setFilter(state, filter) {
      state.filterList.push(filter);
    },
    setFile(state, file) {
      file.symbolIndex = Symbol("symbolIndex");
      state.fileList.push(file);
    },
    deleteFile(state, indexSymbol) {
      const index = state.fileList.findIndex((file: any) => file.symbolIndex === indexSymbol);
      if (index !== false) state.fileList.splice(index, 1);
      if (state.showFileIndex === indexSymbol) state.showFileIndex = null;
    },
    showFile(state, indexSymbol) {
      state.showFileIndex = indexSymbol;
    }
  },
  actions: {
    initFilter(store, name) {
      const filter = filterProcessor.findFilter(name);
      if (!filter) return false;
      store.commit("setFilter", new filter);
    },
    runFilterProcessor(store) {
      return filterProcessor.run(store.getters.fileList, store.getters.filterList);
    },
    async runFilterProcessorForOne (store, {symbolIndex, ignoreFilter = false}) {
      const newFileList = store.getters.fileList.filter((file: any) => file.symbolIndex === symbolIndex);
      const result = await filterProcessor.run(newFileList, ignoreFilter ? [] : store.getters.filterList);
      return result.shift();
    },
    async downloadImages (store, method = "common") {
      //var zip = new JSZip();
      if (method === "common") {
        await Promise.all(store.getters.fileList.map(async (file: any) => {
          const result = await filterProcessor.run([file], store.getters.filterList);
          const blob = await (result[0] as any).convertToBlob({
            type: "image/jpeg",
            quality: 0.95
          });

          FileSaver.saveAs(blob, "file.jpg");
        }));
        return true;
      }
    }
  },
  getters: {
    filterList: state => {
      return state.filterList;
    },
    fileList: state => {
      return state.fileList;
    }
  }

});

new Vue({
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");

// ---- INIT ---

console.log(store);

store.commit("setlang", navigator.language.substr(0, 2).toLowerCase());
