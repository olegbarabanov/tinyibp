/* eslint-disable node/no-unpublished-import */
import {createLocalVue, mount} from '@vue/test-utils';
import BlurFilter from '@/components/BlurFilter.vue';
import BootstrapVue from 'bootstrap-vue';

describe('BlurFilter.vue', () => {
  test('Передает пустые значения в настройках', () => {
    // create an extended `Vue` constructor
    const localVue = createLocalVue();
    // install plugins as normal
    localVue.use(BootstrapVue);
    const wrapper = mount(BlurFilter, {
      localVue,
    });

    const input = wrapper.find('b-form-input');
    expect(input.vm.$data.value).toBe('100');
  });
});
