/* eslint-disable node/no-unpublished-import */
import BlurFilter from '@/components/blur-filter.vue';
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
// import {useI18n} from 'vue-i18n';

// config.global.stubs = {
//   BlurFilter,
// };

// const MyComponent = defineComponent({
//   template: '<div>My component<input></div>',
// });
// , {
//   global: {
//     plugins: [useI18n],
//   },
//   mocks: {
//     t: (msg: string) => msg,
//     tc: (msg: string) => msg,
//   },
// }

describe('blur-filter.vue', () => {
  test('emits the correct event with a numeric value when different "level" types are set.', async () => {
    const i18n = createI18n({
      // vue-i18n options here ...
    });
    const wrapper = mount(BlurFilter, {
      mocks: {
        t: (msg: string) => msg,
        tc: (msg: string) => msg,
      },
      global: {
        plugins: [i18n],
      },
    });
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    input.setValue(0);
    expect(wrapper.emitted()['update:modelValue']?.[0]).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual([{level: 0}]);
    // input.setValue('50');
    // expect(wrapper.emitted()['update:level']?.[1]).toBeTruthy();
    // expect(wrapper.emitted()['update:level']?.[1]).toEqual([50]);
    // input.setValue('just a string');
    // expect(wrapper.emitted()['update:level']?.[2]).toEqual([0]);

    wrapper.unmount();
  });
});
