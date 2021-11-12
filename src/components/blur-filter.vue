<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          class="form-control"
          :value="level"
          @input="updateLevel($event.target.value)"
        />
        <small tabindex="-1" class="form-text text-muted">{{
          $t('blurfilter.form.level.description')
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
