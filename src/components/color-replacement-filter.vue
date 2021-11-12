<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          type="color"
          class="form-control"
          :value="initColor"
          @change="updateInitColor($event.target.value)"
        /><small tabindex="-1" class="form-text text-muted">{{
          $t('colorreplacementfilter.form.initcolor.description')
        }}</small>
      </div>
    </div>
    <div class="form-group m-0 mt-3">
      <div>
        <input
          type="color"
          class="form-control"
          :value="finalColor"
          @change="updateFinalColor($event.target.value)"
        /><small tabindex="-1" class="form-text text-muted">{{
          $t('colorreplacementfilter.form.finalcolor.description')
        }}</small>
      </div>
    </div>
  </form>
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
      console.log(value);
      this.$emit('update:initColor', value);
    },
    updateFinalColor: function(value: string) {
      this.$emit('update:finalColor', value);
    },
  },
});
</script>
