/* eslint-disable node/no-unpublished-import */
import {createLocalVue, mount} from '@vue/test-utils';
import CropFilter from '@/components/CropFilter.vue';
import BootstrapVue, {BFormInput, BFormSelect} from 'bootstrap-vue';
import {supportModes, supportPositions} from '@/filters/CropFilter';

global.console.warn = global.console.error = (message: Error) => {
  throw message;
};

describe('CropFilter.vue', () => {
  test('emits the correct event "update:mode" with different values', async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(CropFilter, {
      localVue,
      mocks: {
        $t: (msg: string) => msg,
        $tc: (msg: string) => msg,
      },
    });
    const inputMode = wrapper.find('[name="mode"]');
    expect(inputMode.exists()).toBe(true);
    let i = 0;
    for (const mode of Object.values(supportModes)) {
      inputMode.setValue(mode);
      await inputMode.vm.$nextTick();
      const ev = wrapper.emitted()['update:mode']?.[i++];
      expect(ev).toBeTruthy();
      expect(ev).toEqual([mode]);
    }

    wrapper.destroy();
  });

  test('emits the correct event "update:position" with different values', async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(CropFilter, {
      localVue,
      mocks: {
        $t: (msg: string) => msg,
        $tc: (msg: string) => msg,
      },
    });
    const inputPosition = wrapper.find('[name="position"]');
    expect(inputPosition.exists()).toBe(true);
    let i = 0;
    for (const mode of Object.values(supportPositions)) {
      inputPosition.setValue(mode);
      await inputPosition.vm.$nextTick();
      const ev = wrapper.emitted()['update:position']?.[i++];
      expect(ev).toBeTruthy();
      expect(ev).toEqual([mode]);
    }

    wrapper.destroy();
  });
});
