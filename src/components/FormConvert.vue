<template>
  <b-form @submit.stop.prevent>
    <label for="text-password">Password</label>
    <b-form-input
      type="password"
      id="text-password"
      aria-describedby="password-help-block"
    ></b-form-input>
    <b-form-text> Конвертировать в формат </b-form-text>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: ['settings'],
});
</script>
