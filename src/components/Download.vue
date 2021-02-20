<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="dark"
    class="h-100 text-center rounded-0"
    border-variant="dark"
  >
    <b-form @submit.stop.prevent class="mh-100 d-flex flex-row">
      <b-form-select
        v-model="selectedType"
        :options="supportTypes"
      ></b-form-select>
      <b-form-input
        id="range-2"
        v-model="quality"
        type="range"
        min="1"
        max="100"
        step="1"
      ></b-form-input>
      <b-form-input
        id="input-live"
        v-model="nameTransformPattern"
        placeholder="Enter your pattern"
        trim
      ></b-form-input>
    </b-form>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {supportTypes} from '../filters/ImageProcessor';

console.log(supportTypes.keys());

export default Vue.extend({
  data() {
    return {
      supportTypes: Array.from(supportTypes, type => {
        return {value: type[0], text: type[1] as string};
      }),
      options: [{value: null, text: 'Please select an option'}],
    };
  },
  computed: {
    selectedType: {
      get() {
        return this.$store.state.type;
      },
      set(value) {
        this.$store.dispatch('setType', value);
      },
    },
    quality: {
      get() {
        return this.$store.state.quality;
      },
      set(value) {
        this.$store.dispatch('setQuality', value);
      },
    },
    nameTransformPattern: {
      get() {
        return this.$store.state.nameTransformPattern;
      },
      set(value) {
        this.$store.dispatch('setNameTransformPattern', value);
      },
    },
  },
});
</script>
