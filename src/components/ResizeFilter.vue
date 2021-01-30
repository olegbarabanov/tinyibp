<template>
  <b-form @submit.stop.prevent>
    <label for="input-live">Новая ширина (X) в пикселях:</label>
    <b-form-input
      v-model="settings.resizeToX"
      type="number"
      min="0"
    ></b-form-input>

    <label for="input-live">Новая высота (Y) в пикселях:</label>
    <b-form-input
      v-model="settings.resizeToY"
      type="number"
      min="0"
    ></b-form-input>
  </b-form>
</template>

<script>
export default {
  props: ['settings']
}
</script>

<style>

</style>