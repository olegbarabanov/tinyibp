<i18n src="../common/locales.json"></i18n>

<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      :description="$t('rotatefilter.form.angle.description') + `: ${angle}%`"
      :label-for="`input-${componentID}`"
      class="m-0"
    >
      <b-form-input
        :id="`input-${componentID}`"
        :value="angle"
        type="number"
        step="0.1"
        @input="updateAngle"
      />
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/sequence-id';

export default Vue.extend({
  props: {
    angle: {
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
    updateAngle: function(value: string) {
      this.$emit('update:angle', Number(value));
    },
  },
});
</script>
