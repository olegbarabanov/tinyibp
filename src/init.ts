import i18n from './i18n';
import {FilterProcessor, SUPPORT_FILTERS} from './image-processor';

export const filterProcessor = new FilterProcessor();

SUPPORT_FILTERS.forEach(filter => {
  filterProcessor.getFilterFactory().registerFilter(filter);
});

export const DEFAULT_LANG = 'en';
i18n.global.locale.value = navigator.language.substr(0, 2).toLowerCase();

export const APP_VERSION = __APP_VERSION__;
