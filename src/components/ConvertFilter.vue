<template>
  <b-form @submit.stop.prevent>
    <label for="range-1">Конвертировать в формат:</label>
    <b-form-select v-model="settings.targetFormat" :options="settings.supportFormat" class="mb-3">
    </b-form-select>
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