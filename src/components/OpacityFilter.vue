<template>
  <b-form @submit.stop.prevent>
    <label for="range-1">Уровень прозрачности (в %)</label>
    <b-form-input
      id="range-1"
      v-model="settings.level"
      type="range"
      min="0"
      max="100"
    ></b-form-input>
    <div class="mt-2">Значение: {{ settings.level }} %</div>
  </b-form>
</template>

<script>
export default {
  props: ['settings']
};
</script>

<style>
</style>