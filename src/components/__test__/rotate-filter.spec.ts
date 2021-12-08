/* eslint-disable node/no-unpublished-import */
import {mount} from '@vue/test-utils';
import RotateFilter from '@/components/rotate-filter.vue';
import {createI18n} from 'vue-i18n';

describe('rotate-filter.vue', () => {
  test('emits the correct event with a numeric value when different "angle" types are set.', async () => {
    const i18n = createI18n({});
    const wrapper = mount(RotateFilter, {
      global: {
        plugins: [i18n],
      },
    });

    const inputAngle = wrapper.find('input[name="angle"]');
    expect(inputAngle.exists()).toBe(true);

    for (let i = 0; i <= 64; i++) {
      const assignExpression = (i - 32) * 25.5;
      await inputAngle.setValue(assignExpression);
      expect(wrapper.emitted()['update:modelValue']?.[i]).toBeTruthy();
      expect(wrapper.emitted()['update:modelValue']?.[i]).toEqual([
        {angle: assignExpression},
      ]);
    }

    wrapper.unmount();
  });
});
