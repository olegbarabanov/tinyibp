import {InjectionKey} from 'vue';

import {createStore, useStore as baseUseStore, Store} from 'vuex';
import i18n from './i18n';
import {FilterMap, SupportMimesTypes} from './image-processor';
import {DEFAULT_LANG, filterProcessor} from './init';

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
  mutations: {
    setLang(_state, lang = DEFAULT_LANG) {
      i18n.global.locale.value = lang;
    },
    setFile(state, file: File) {
      state.fileList.push(file);
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
