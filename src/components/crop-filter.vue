<i18n src="../common/locales.json"></i18n>

<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      :label="$t('cropfilter.form.mode.label')"
      :label-for="`input-mode-${componentID}`"
    >
      <b-form-select
        :id="`input-mode-${componentID}`"
        name="mode"
        :value="useMode"
        size="sm"
        class="mt-3"
        @change="updateMode"
      >
        <b-form-select-option
          v-for="mode in supportModes"
          :key="mode.value"
          :value="mode.value"
        >
          {{ $t(`cropfilter.form.mode.value.${mode.value}`) }}
        </b-form-select-option>
      </b-form-select>
    </b-form-group>
    <b-form-group
      :label="$t('cropfilter.form.position.label')"
      :label-for="`input-position-${componentID}`"
    >
      <b-form-select
        :id="`input-position-${componentID}`"
        name="position"
        :value="usePosition"
        size="sm"
        class="mt-3"
        @input="updatePosition"
      >
        <b-form-select-option
          v-for="position in supportPositions"
          :key="position.value"
          :value="position.value"
        >
          {{ $t(`cropfilter.form.position.value.${position.value}`) }}
        </b-form-select-option>
      </b-form-select>
    </b-form-group>
    <b-form-group
      :label="$t('cropfilter.form.sizes.label')"
      :label-for="`input-position-${componentID}`"
      :description="$t('cropfilter.form.sizes.description')"
    >
      <b-input-group>
        <b-input-group-text>
          X:
        </b-input-group-text>
        <b-form-input
          :value="width"
          name="width"
          type="number"
          step="1"
          min="0"
          placeholder="auto"
          :formatter="formatter"
          @input="updateWidth"
        />
        <b-input-group-text>
          Y:
        </b-input-group-text>
        <b-form-input
          :value="height"
          name="height"
          type="number"
          step="1"
          min="0"
          placeholder="auto"
          :formatter="formatter"
          @input="updateHeight"
        />
      </b-input-group>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  supportPositions,
  supportModes,
} from '@/image-processor/filters/crop-filter';
import SequenceId from '@/utils/sequence-id';

export default Vue.extend({
  props: {
    useMode: {
      type: String,
      default: supportModes.SIZES,
    },
    usePosition: {
      type: String,
      default: supportPositions.CENTER_MIDDLE,
    },
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
      supportPositions: Object.values(supportPositions).map(position => {
        return {text: position, value: position};
      }),
      supportModes: Object.values(supportModes).map(mode => {
        return {text: mode, value: mode};
      }),
    };
  },
  methods: {
    formatter(value: string): string {
      return Number(value) === 0 ? '' : value;
    },
    updateMode(value: string) {
      this.$emit('update:mode', value);
    },
    updatePosition(value: string) {
      this.$emit('update:position', value);
    },
    updateWidth(value: string) {
      this.$emit('update:width', Number(value));
    },
    updateHeight(value: string) {
      this.$emit('update:height', Number(value));
    },
  },
});
</script>
