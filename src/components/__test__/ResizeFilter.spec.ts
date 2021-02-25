/* eslint-disable node/no-unpublished-import */
import {createLocalVue, mount, shallowMount} from '@vue/test-utils';
import ResizeFilter from '@/components/ResizeFilter.vue';
import BootstrapVue from 'bootstrap-vue';

global.console.warn = global.console.error = (message: Error) => {
  throw message;
};

describe('ResizeFilter.vue', () => {
  /*
    EMPTY TEST !
    MUST BE CREATED FOR RELEASE !
  */
  test('empty test', async () => {});
});
