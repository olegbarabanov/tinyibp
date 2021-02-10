<template>
  <b-form @submit.stop.prevent>
    <label for="range-1">Уровень контрастности (в %)</label>
    <b-form-input
      id="range-1"
      v-model="settings.level"
      type="range"
      min="0"
      max="200"
    ></b-form-input>
    <div class="mt-2">Значение: {{ settings.level }} %</div>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['settings']
})
</script>

<style>
</style>