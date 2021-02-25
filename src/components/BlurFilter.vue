<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      description="Укажите уровень размытия"
      :label-for="`input-${componentID}`"
      class="m-0"
    >
      <b-form-input
        :value="level"
        v-on:input="updateLevel"
        :id="`input-${componentID}`"
        type="number"
        min="0"
        max="100"
        step="0.1"
      ></b-form-input>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/SequenceId';

export default Vue.extend({
  props: {
    level: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      componentID: SequenceId.getNew(),
    };
  },
  methods: {
    updateLevel: function(value: string) {
      const numberValue = Number(value);
      if (!isNaN(numberValue)) {
        this.$emit('update:level', numberValue);
      }
    },
  },
});
</script>
