<template>
  <b-form @submit.stop.prevent>
    <label for="range-1"></label>
    <b-form-file
      v-model="settings.image"
      :state="Boolean(settings.image)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
    ></b-form-file>
    <b-form-select v-model="settings.position" :options="supportPositions" size="sm" class="mt-3"></b-form-select>
    margin px<b-form-input id="range-1" v-model="settings.margin" type="number" step="1"></b-form-input>
  </b-form>
</template>

<script>
export default {
  props: ["settings"],
  data() {
    return {
      supportPositions: Object.entries(this.settings.supportPositions).map(([position, index]) => {return {"text": position, "value": index}}),
    }
  },
};
</script>

<style>
</style>