<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="dark"
    class="h-100 text-center rounded-0"
    border-variant="dark"
  >
    <b-form @submit.stop.prevent class="mh-100 d-flex flex-row">
      <b-form-select v-model="selected" :options="options"></b-form-select>
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
        v-model="pattern"
        placeholder="Enter your pattern"
        trim
      ></b-form-input>
    </b-form>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      selected: null,
      quality: 1,
      pattern: '#name',
      options: [
        {value: null, text: 'Please select an option'},
        {value: 'a', text: 'This is First option'},
        {value: 'b', text: 'Selected Option'},
        {value: {C: '3PO'}, text: 'This is an option with object value'},
        {value: 'd', text: 'This one is disabled', disabled: true},
      ],
    };
  },
});
</script>
