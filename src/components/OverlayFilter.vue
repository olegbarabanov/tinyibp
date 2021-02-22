<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      label="Накладываемое изображение"
      :label-for="`input-image-${componentID}`"
    >
      <b-form-file
        :id="`input-image-${componentID}`"
        v-on:input="updateImage"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
    </b-form-group>
    <b-form-group
      label="Позиционирование"
      :label-for="`input-position-${componentID}`"
    >
      <b-form-select
        :value="position"
        :options="supportPositions"
        :label-for="`input-position-${componentID}`"
        v-on:input="updatePosition"
        size="sm"
      ></b-form-select>
    </b-form-group>
    <b-form-group label="Отступ" :label-for="`input-margin-${componentID}`">
      <b-form-input
        :label-for="`input-margin-${componentID}`"
        :value="margin"
        v-on:input="updateMargin"
        type="number"
        step="1"
      ></b-form-input>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import {supportPositions} from '../filters/OverlayFilter';
import SequenceId from '@/utils/SequenceId';

export default Vue.extend({
  props: ['position', 'margin'],
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
    updateImage: function(value: File) {
      this.$emit('update:image', value);
    },
    updatePosition: function(value: string) {
      this.$emit('update:position', value);
    },
    updateMargin: function(value: string) {
      this.$emit('update:margin', Number(value));
    },
  },
});
</script>
