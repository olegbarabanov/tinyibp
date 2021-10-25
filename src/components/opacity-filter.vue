<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          class="form-range"
          :value="level"
          @input="updateLevel($event.target.value)"
        /><small tabindex="-1" class="form-text text-muted"
          >{{ $t('opacityfilter.form.level.description') }}: {{ level }}%</small
        >
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
      this.$emit('update:level', Number(value));
    },
  },
});
</script>
