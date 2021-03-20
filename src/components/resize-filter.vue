<i18n src="../common/locales.json"></i18n>

<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      :description="$t('resizefilter.form.size.description')"
      :label="$t('resizefilter.form.size.label')"
      class="m-0"
    >
      <b-input-group>
        <b-input-group-text>
          X:
        </b-input-group-text>
        <b-form-input
          :value="width"
          type="number"
          min="0"
          step="1"
          @input="updateWidth"
        />
        <b-input-group-text>
          Y:
        </b-input-group-text>
        <b-form-input
          :value="height"
          type="number"
          min="0"
          step="1"
          @input="updateHeight"
        />
      </b-input-group>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/sequence-id';

export default Vue.extend({
  props: {
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
  },
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
