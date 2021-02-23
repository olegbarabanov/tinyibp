/* eslint-disable node/no-unpublished-import */
import {createLocalVue, mount, shallowMount} from '@vue/test-utils';
import BlurFilter from '@/components/BlurFilter.vue';
import BootstrapVue, {BFormInput} from 'bootstrap-vue';

describe('BlurFilter.vue', () => {
  test('Передает пустые значения в настройках', async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(BlurFilter, {
      localVue,
    });
    const input = wrapper.findComponent(BFormInput);
    input.setValue('50');
    expect(wrapper.emitted()['update:level']).toBeTruthy();
    expect(wrapper.emitted()['update:level']?.[0]).toEqual([50]);
    input.setValue(0);
    expect(wrapper.emitted()['update:level']).toBeTruthy();
    expect(wrapper.emitted()['update:level']?.[1]).toEqual([0]);

    wrapper.setProps({level: 100});
    await wrapper.vm.$nextTick();
    console.log('value=>', input.vm.$props.value);
    expect(input.vm.$props.value).toEqual(100);

    wrapper.destroy();
  });
});
