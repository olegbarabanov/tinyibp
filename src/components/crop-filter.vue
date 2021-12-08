<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group">
      <label class="d-block">{{ t('cropfilter.form.mode.label') }}</label>
      <div>
        <select
          v-model="mode"
          name="mode"
          class="mt-3 form-select form-select-sm"
        >
          <option
            v-for="modeItem in modeList"
            :key="modeItem.value"
            :value="modeItem.value"
          >
            {{ modeItem.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="d-block">{{ t('cropfilter.form.position.label') }}</label>
      <div>
        <select
          v-model="position"
          name="position"
          class="mt-3 form-select form-select-sm"
        >
          <option
            v-for="positionItem in positionList"
            :key="positionItem.value"
            :value="positionItem.value"
          >
            {{ positionItem.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="d-block">{{ t('cropfilter.form.sizes.label') }}</label>
      <div>
        <div role="group" class="input-group">
          <div class="input-group-text">
            X:
          </div>
          <input
            type="number"
            name="width"
            placeholder="auto"
            min="0"
            step="1"
            class="form-control"
            :value="inputSizeFormatter(width)"
            @input="width = Number(($event.target as HTMLInputElement).value)"
          />
          <div class="input-group-text">
            Y:
          </div>
          <input
            type="number"
            name="height"
            placeholder="auto"
            min="0"
            step="1"
            class="form-control"
            :value="inputSizeFormatter(height)"
            @input="height = Number(($event.target as HTMLInputElement).value)"
          />
        </div>
        <small tabindex="-1" class="form-text text-muted">{{
          t('cropfilter.form.sizes.description')
        }}</small>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import CropFilter, {
  supportPositions,
  supportModes,
} from '@/image-processor/filters/crop-filter';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
import AbstractFilter from '@/image-processor/filters/abstract-filter';

type CropFilterProps = Omit<CropFilter, keyof AbstractFilter>;

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<CropFilterProps>,
      default: (): CropFilterProps => {
        return {
          mode: supportModes.RATIO,
          position: supportPositions.CENTER_MIDDLE,
          width: 1,
          height: 1,
        };
      },
    },
  },
  emits: {'update:modelValue': (data: CropFilterProps) => !!data},
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const mode = computed({
      get: () => props.modelValue.mode,
      set: value =>
        emit('update:modelValue', {...props.modelValue, mode: value}),
    });

    const position = computed({
      get: () => props.modelValue.position,
      set: value =>
        emit('update:modelValue', {...props.modelValue, position: value}),
    });

    const width = computed({
      get: () => Number(props.modelValue.width),
      set: value =>
        emit('update:modelValue', {...props.modelValue, width: value}),
    });

    const height = computed({
      get: () => Number(props.modelValue.height),
      set: value =>
        emit('update:modelValue', {...props.modelValue, height: value}),
    });

    const inputSizeFormatter = (value: string | number): string => {
      return Number(value) === 0 ? '' : String(value);
    };

    const positionList = computed(() => {
      return Object.values(supportPositions).map(position => {
        return {
          text: t(`cropfilter.form.position.value.${position}`),
          value: position,
        };
      });
    });

    const modeList = computed(() => {
      return Object.values(supportModes).map(mode => {
        return {
          text: t(`cropfilter.form.mode.value.${mode}`),
          value: mode,
        };
      });
    });

    return {
      t,
      componentID,
      mode,
      position,
      width,
      height,
      positionList,
      modeList,
      inputSizeFormatter,
    };
  },
});
</script>
