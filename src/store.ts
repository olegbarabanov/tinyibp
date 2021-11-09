import {InjectionKey} from 'vue';
import {I18n, LocaleMessages, VueMessageType} from 'vue-i18n';

import {createStore, useStore as baseUseStore, Store} from 'vuex';
// const {locale} = useI18n({useScope: 'global'});

export interface State {
  count: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = (
  i18n: I18n<LocaleMessages<VueMessageType>, unknown, unknown, false>
) =>
  createStore<State>({
    state: {
      count: 0,
    },
    mutations: {
      setLang(_state, lang = 'en') {
        i18n.global.locale.value = lang;
      },
    },
  });

export function useStore() {
  return baseUseStore(key);
}
