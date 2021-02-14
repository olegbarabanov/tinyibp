<template>
  <b-form @submit.stop.prevent>
    <label for="range-1">Обесцвечивание: {{ settings.level }} %</label>
    <b-form-input
      id="range-1"
      v-model="settings.level"
      type="range"
      min="0"
      max="100"
    ></b-form-input>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['settings']
})
</script>