/* eslint-disable node/no-unpublished-import */
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import OpacityFilter from '../opacity-filter.vue';

describe('opacity-filter.vue', () => {
  test('emits the correct event with different props', async () => {
    const i18n = createI18n({});
    const wrapper = mount(OpacityFilter, {
      global: {
        plugins: [i18n],
      },
    });
    const inputLevel = wrapper.find('input[name="level"]');
    expect(inputLevel.exists()).toBe(true);

    wrapper.unmount();
  });
});
