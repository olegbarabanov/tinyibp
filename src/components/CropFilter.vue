<template>
  <b-form @submit.stop.prevent>
    <b-form-select
      v-model="settings.mode"
      :options="supportModes"
      size="sm"
      class="mt-3"
    ></b-form-select>
    <b-form-select
      v-model="settings.position"
      :options="supportPositions"
      size="sm"
      class="mt-3"
    ></b-form-select>
    X:<b-form-input
      id="range-1"
      v-model="settings.width"
      type="number"
      step="1"
    ></b-form-input>
    Y:<b-form-input
      id="range-1"
      v-model="settings.height"
      type="number"
      step="1"
    ></b-form-input>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import {supportPositions, supportModes} from '../filters/CropFilter';

export default Vue.extend({
  props: ['settings'],
  data() {
    return {
      supportPositions: Object.entries(supportPositions)
        .filter(([position]) => isNaN(Number(position)))
        .map(([position, index]) => {
          return {text: position, value: index};
        }),
      supportModes: Object.entries(supportModes)
        .filter(([mode]) => isNaN(Number(mode)))
        .map(([mode, index]) => {
          return {text: mode, value: index};
        }),
    };
  },
});
</script>
