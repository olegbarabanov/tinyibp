/* eslint-disable node/no-unpublished-import */
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import OverlayFilter from '../overlay-filter.vue';

describe('overlay-filter.vue', () => {
  test('emits the correct event with different props', async () => {
    const i18n = createI18n({});
    const wrapper = mount(OverlayFilter, {
      global: {
        plugins: [i18n],
      },
    });
    const inputLevel = wrapper.find('input[name="image"]');
    expect(inputLevel.exists()).toBe(true);

    const inputPosition = wrapper.find('input[name="position"]');
    expect(inputPosition.exists()).toBe(true);

    const inputMargin = wrapper.find('input[name="margin"]');
    expect(inputMargin.exists()).toBe(true);

    wrapper.unmount();
  });
});
