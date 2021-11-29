<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          v-model.lazy="level"
          type="number"
          name="level"
          min="0"
          step="0.1"
          class="form-control"
        /><small tabindex="-1" class="form-text text-muted">{{
          t('contrastfilter.form.level.description')
        }}</small>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
import AbstractFilter from '@/image-processor/filters/abstract-filter';
import ContrastFilter from '@/image-processor/filters/contrast-filter';

type ContrastFilterProps = Omit<ContrastFilter, keyof AbstractFilter>;

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<ContrastFilterProps>,
      default: (): ContrastFilterProps => {
        return {level: 100};
      },
    },
  },
  emits: {'update:modelValue': (data: ContrastFilterProps) => !!data},
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
