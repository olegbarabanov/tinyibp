/* eslint-disable node/no-unpublished-import */
import BlurFilter from '@/components/blur-filter.vue';
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';

describe('blur-filter.vue', () => {
  test('emits the correct event with a numeric value when different "level" types are set.', async () => {
    const i18n = createI18n({});
    const wrapper = mount(BlurFilter, {
      global: {
        plugins: [i18n],
      },
    });
    const inputLevel = wrapper.find('input[name="level"]');
    expect(inputLevel.exists()).toBe(true);

    if (inputLevel.exists()) {
      await inputLevel.setValue(0);
      expect(wrapper.emitted()['update:modelValue']?.[0]).toBeTruthy();
      expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([{level: 0}]);
      await inputLevel.setValue('50');
      expect(wrapper.emitted()['update:modelValue']?.[1]).toBeTruthy();
      expect(wrapper.emitted()['update:modelValue']?.[1]).toEqual([
        {level: 50},
      ]);

      await wrapper.setProps({modelValue: {level: 75}});
      expect(Number((inputLevel.element as HTMLInputElement).value)).toEqual(
        75
      );
    }
    wrapper.unmount();
  });
});
