<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          v-model.lazy="angle"
          name="angle"
          type="number"
          step="0.1"
          class="form-control"
        /><small tabindex="-1" class="form-text text-muted"
          >{{ t('rotatefilter.form.angle.description') }}: {{ angle }}%</small
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
import RotateFilter from '@/image-processor/filters/rotate-filter';

type RotateFilterProps = Omit<RotateFilter, keyof AbstractFilter>;

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<RotateFilterProps>,
      default: (): RotateFilterProps => {
        return {angle: 0};
      },
    },
  },
  emits: {'update:modelValue': (data: RotateFilterProps) => !!data},
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const angle = computed({
      get: () => props.modelValue.angle,
      set: value => {
        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
          emit('update:modelValue', {...props.modelValue, angle: value});
        }
      },
    });
    return {t, componentID, angle};
  },
});
</script>
