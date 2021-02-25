/* eslint-disable node/no-unpublished-import */
import {createLocalVue, mount, shallowMount} from '@vue/test-utils';
import PreviewCanvas from '@/components/PreviewCanvas.vue';
import BootstrapVue from 'bootstrap-vue';

global.console.warn = global.console.error = (message: Error) => {
  throw message;
};

describe('PreviewCanvas.vue', () => {
  /*
    EMPTY TEST !
    MUST BE CREATED FOR RELEASE !
  */
  test('empty test', async () => {});
});
