<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          v-model.lazy="level"
          type="range"
          min="0"
          max="100"
          step="0.1"
          class="form-range"
        /><small tabindex="-1" class="form-text text-muted"
          >{{ t('opacityfilter.form.level.description') }}:{{ level }}%</small
        >
      </div>
    </div>
  </form>
</template>

<script lang="ts">
// type MappedType<T> = {
//   [K in keyof T]: T[K];
// };

import {computed, defineComponent, PropType} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
import OpacityFilter from '@/image-processor/filters/opacity-filter';
export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<Omit<OpacityFilter, 'name'>>,
      default: () => {
        return {level: 0};
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const level = computed({
      get: () => props.modelValue.level,
      set: value => {
        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
          emit('update:modelValue', {...props.modelValue, level: value});
        }
      },
    });
    return {t, componentID, level};
  },
});

/*
import Vue from 'vue';
import SequenceId from '@/utils/sequence-id';

export default Vue.extend({
  props: {
    level: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      componentID: SequenceId.getNew(),
    };
  },
  methods: {
    updateLevel: function(value: string) {
      this.$emit('update:level', Number(value));
    },
  },
}); */
</script>
