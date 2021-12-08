<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group">
      <label class="d-block">{{ t('overlayfilter.form.image.label') }}</label>
      <input
        type="file"
        name="image"
        :accept="acceptImageTypeList"
        class="form-control form-control-sm"
        @input="updateImage(($event.target as HTMLInputElement).files?.[0])"
      />
    </div>
    <div class="form-group">
      <label class="d-block">{{
        t('overlayfilter.form.position.label')
      }}</label>
      <div>
        <select
          v-model="position"
          name="position"
          class="form-select form-select-sm"
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
      <label class="d-block">{{ t('overlayfilter.form.margin.label') }}</label>
      <div>
        <input
          v-model="margin"
          name="margin"
          type="number"
          step="1"
          class="form-control"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
import OverlayFilter, {
  supportPositions,
} from '@/image-processor/filters/overlay-filter';
import {supportTypes} from '@/image-processor';
import AbstractFilter from '@/image-processor/filters/abstract-filter';

type OverlayFilterProps = Omit<OverlayFilter, keyof AbstractFilter>;

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<OverlayFilterProps>,
      default: (): OverlayFilterProps => {
        return {
          position: supportPositions.MIDDLE_CENTER,
          margin: 0,
        };
      },
    },
  },
  emits: {'update:modelValue': (data: OverlayFilterProps) => !!data},
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const margin = computed({
      get: () => props.modelValue.margin,
      set: value =>
        emit('update:modelValue', {...props.modelValue, margin: value}),
    });
    const position = computed({
      get: () => props.modelValue.position,
      set: value =>
        emit('update:modelValue', {...props.modelValue, position: value}),
    });

    const updateImage = (image?: File) => {
      emit('update:modelValue', {...props.modelValue, image});
    };

    const positionList = computed(() =>
      Object.entries(supportPositions)
        .filter(([position]) => isNaN(Number(position)))
        .map(([position, index]) => {
          return {text: position, value: index};
        })
    );

    const acceptImageTypeList = computed(() =>
      Array.from(supportTypes, type => type[0]).join(',')
    );

    return {
      t,
      componentID,
      margin,
      position,
      positionList,
      acceptImageTypeList,
      updateImage,
    };
  },
});
</script>
