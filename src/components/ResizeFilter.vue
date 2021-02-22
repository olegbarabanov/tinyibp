<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      description="Если ширина или высота равна 0, то параметр расчитывается автоматически"
      label="Новый размер"
      class="m-0"
    >
      <b-input-group>
        <b-input-group-text>
          X:
        </b-input-group-text>
        <b-form-input
          :value="width"
          v-on:input="updateWidth"
          type="number"
          min="0"
          step="1"
        ></b-form-input>
        <b-input-group-text>
          Y:
        </b-input-group-text>
        <b-form-input
          :value="height"
          v-on:input="updateHeight"
          type="number"
          min="0"
          step="1"
        ></b-form-input>
      </b-input-group>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/SequenceId';

export default Vue.extend({
  props: ['width', 'height'],
  data() {
    return {
      componentID: SequenceId.getNew(),
    };
  },
  methods: {
    updateWidth: function(value: string) {
      this.$emit('update:width', Number(value));
    },
    updateHeight: function(value: string) {
      this.$emit('update:height', Number(value));
    },
  },
});
</script>
