<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      label="Накладываемое изображение"
      :label-for="`input-image-${componentID}`"
    >
      <b-form-file
        :id="`input-image-${componentID}`"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        @input="updateImage"
      />
    </b-form-group>
    <b-form-group
      label="Позиционирование"
      :label-for="`input-position-${componentID}`"
    >
      <b-form-select
        :value="position"
        :options="supportPositions"
        :label-for="`input-position-${componentID}`"
        size="sm"
        @input="updatePosition"
      />
    </b-form-group>
    <b-form-group label="Отступ" :label-for="`input-margin-${componentID}`">
      <b-form-input
        :label-for="`input-margin-${componentID}`"
        :value="margin"
        type="number"
        step="1"
        @input="updateMargin"
      />
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {supportPositions} from '../filters/OverlayFilter';
import SequenceId from '@/utils/SequenceId';

export default Vue.extend({
  props: {
    position: {
      type: Object as PropType<supportPositions>,
      default: supportPositions.MIDDLE_CENTER,
    },
    margin: {
      type: Object as PropType<number>,
      default: 0,
    },
  },
  data() {
    return {
      componentID: SequenceId.getNew(),
      supportPositions: Object.entries(supportPositions)
        .filter(([position]) => isNaN(Number(position)))
        .map(([position, index]) => {
          return {text: position, value: index};
        }),
    };
  },
  methods: {
    updateImage: function(value: File): void {
      this.$emit('update:image', value);
    },
    updatePosition: function(value: string): void {
      this.$emit('update:position', value);
    },
    updateMargin: function(value: string): void {
      this.$emit('update:margin', Number(value));
    },
  },
});
</script>
