<i18n src="../common/locales.json"></i18n>

<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      :description="$t('colorreplacementfilter.form.initcolor.description')"
      :label-for="`input-${componentID}`"
      class="m-0"
    >
      <b-form-input
        :id="`input-${componentID}`"
        :value="initColor"
        type="color"
        @change="updateInitColor"
      />
    </b-form-group>
    <b-form-group
      :description="$t('colorreplacementfilter.form.finalcolor.description')"
      :label-for="`input-${componentID}`"
      class="m-0 mt-3"
    >
      <b-form-input
        :id="`input-${componentID}`"
        :value="finalColor"
        type="color"
        @change="updateFinalColor"
      />
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/sequence-id';

export default Vue.extend({
  props: {
    initColor: {
      type: String,
      default: '',
    },
    finalColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      componentID: SequenceId.getNew(),
    };
  },
  methods: {
    updateInitColor: function(value: string) {
      this.$emit('update:initColor', value);
    },
    updateFinalColor: function(value: string) {
      this.$emit('update:finalColor', value);
    },
  },
});
</script>
