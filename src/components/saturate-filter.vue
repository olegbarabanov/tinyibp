<i18n src="../common/locales.json"></i18n>

<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      :description="$t('saturatefilter.form.level.description') + `: ${level}%`"
      :label-for="`input-${componentID}`"
      class="m-0"
    >
      <b-form-input
        :id="`input-${componentID}`"
        :value="level"
        type="range"
        min="0"
        max="200"
        step="0.1"
        @input="updateLevel"
      />
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/sequence-id';

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
      this.$emit('update:level', Number(value));
    },
  },
});
</script>
