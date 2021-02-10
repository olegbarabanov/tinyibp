<template>
  <b-form @submit.stop.prevent>
    <label for="range-1">Уровень контрастности (в %)</label>
    <b-form-input
      id="range-1"
      v-model="settings.level"
      type="number"
      min="0"
      max="100"
    ></b-form-input>
    
  </b-form>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: ['settings']
})
</script>

<style>

</style>