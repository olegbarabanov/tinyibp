/* eslint-disable node/no-unpublished-import */
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import CropFilter from '../contrast-filter.vue';

describe('crop-filter.vue', () => {
  test('emits the correct event with different props', async () => {
    const i18n = createI18n({});
    const wrapper = mount(CropFilter, {
      global: {
        plugins: [i18n],
      },
    });
    const selectMode = wrapper.find('select[name="mode"]');
    expect(selectMode.exists()).toBe(true);

    const selectPosition = wrapper.find('select[name="position"]');
    expect(selectPosition.exists()).toBe(true);

    const inputWidth = wrapper.find('input[name="width"]');
    expect(inputWidth.exists()).toBe(true);

    const inputHeight = wrapper.find('input[name="height"]');
    expect(inputHeight.exists()).toBe(true);

    wrapper.unmount();
  });
});
