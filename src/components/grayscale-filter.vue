<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          v-model.lazy="level"
          name="level"
          type="range"
          min="0"
          max="100"
          step="0.1"
          class="form-range"
        /><small tabindex="-1" class="form-text text-muted"
          >{{ t('grayscalefilter.form.level.description') }}:
          {{ level }}%</small
        >
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
import AbstractFilter from '@/image-processor/filters/abstract-filter';
import GrayscaleFilter from '@/image-processor/filters/grayscale-filter';

type GrayscaleFilterProps = Omit<GrayscaleFilter, keyof AbstractFilter>;

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<GrayscaleFilterProps>,
      default: (): GrayscaleFilterProps => {
        return {level: 0};
      },
    },
  },
  emits: {'update:modelValue': (data: GrayscaleFilterProps) => !!data},
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
</script>
