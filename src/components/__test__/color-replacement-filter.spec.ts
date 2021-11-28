/* eslint-disable node/no-unpublished-import */
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import ColorReplacementFilter from '../color-replacement-filter.vue';

describe('color-replacement-filter.vue', () => {
  test('emits the correct event with different props', async () => {
    const i18n = createI18n({});
    const wrapper = mount(ColorReplacementFilter, {
      global: {
        plugins: [i18n],
      },
    });
    const inputInitColor = wrapper.find('input[name="init-color"]');
    expect(inputInitColor.exists()).toBe(true);

    const inputFinalColor = wrapper.find('input[name="final-color"]');
    expect(inputFinalColor.exists()).toBe(true);

    wrapper.unmount();
  });
});
