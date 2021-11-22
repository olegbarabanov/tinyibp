import {InjectionKey, toRaw} from 'vue';

import {createStore, useStore as baseUseStore, Store} from 'vuex';
import i18n from './i18n';
import {FilterMap, SupportMimesTypes} from './image-processor';
import ImageBuilderWorkerManager from './image-processor/image-builder-worker-manager';
import {DEFAULT_LANG, filterProcessor} from './init';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import {ImageBuilderWorkerProxy} from './image-processor/image-builder-worker-proxy';

export interface State {
  registeredFilters: Array<string>;
  filterMaps: Array<FilterMap>;
  fileList: Array<File>;
  showFileIndex: number | null;
  quality: number;
  type?: SupportMimesTypes;
  nameTransformPattern: string;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
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
  },
  actions: {
    initFilter(store, name: string) {
      const filter = filterProcessor.getFilterFactory().findFilter(name);
      if (!filter) return false;
      store.commit('setFilter', new filter().getPropertyMap());
    },
    async setType(store, type: SupportMimesTypes) {
      store.commit('commitSetType', type);
    },
    async setQuality(store, quality: number) {
      store.commit('commitSetQuality', quality);
    },
    async setNameTransformPattern(store, pattern: string) {
      store.commit('commitSetNameTransformPattern', pattern);
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
        imageBuilder.setFilterMap(toRaw(store.getters.filterMaps));
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
  mutations: {
    setLang(_state, lang = DEFAULT_LANG) {
      i18n.global.locale.value = lang;
    },
    removeFilter(state, index: number) {
      state.filterMaps.splice(index, 1);
    },
    setFilter(state, filter: FilterMap) {
      state.filterMaps.push(filter);
    },
    updateFilters(state, filters: FilterMap[]) {
      state.filterMaps.splice(0, state.filterMaps.length);
      state.filterMaps.push(...filters);
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
  getters: {
    filterMaps: state => {
      return state.filterMaps;
    },
    fileList: state => {
      return state.fileList;
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
