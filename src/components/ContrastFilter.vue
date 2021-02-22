<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      description="Укажите уровень контрастности в %"
      :label-for="`input-${componentID}`"
      class="m-0"
    >
      <b-form-input
        :value="level"
        v-on:input="updateLevel"
        :id="`input-${componentID}`"
        type="number"
        min="0"
        step="0.1"
      ></b-form-input>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/SequenceId';

export default Vue.extend({
  props: ['level'],
  data() {
    return {
      componentID: SequenceId.getNew(),
    };
  },
  methods: {
    updateLevel: function(value: string) {
      this.$emit('update:level', Number(value));
    },
  },
});
</script>
