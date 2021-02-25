<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      label="Режим кадрирования"
      :label-for="`input-mode-${componentID}`"
    >
      <b-form-select
        :id="`input-mode-${componentID}`"
        name="mode"
        :value="mode"
        :options="supportModes"
        size="sm"
        class="mt-3"
        v-on:change="updateMode"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Позиционирование"
      :label-for="`input-position-${componentID}`"
    >
      <b-form-select
        :id="`input-position-${componentID}`"
        name="position"
        :value="position"
        :options="supportPositions"
        size="sm"
        class="mt-3"
        v-on:input="updatePosition"
      ></b-form-select>
    </b-form-group>
    <b-form-group
      label="Размеры"
      :label-for="`input-position-${componentID}`"
      description="пустое поле = автоматический размер"
    >
      <b-input-group>
        <b-input-group-text>
          X:
        </b-input-group-text>
        <b-form-input
          :value="width"
          name="width"
          v-on:input="updateWidth"
          type="number"
          step="1"
          min="0"
          placeholder="auto"
          :formatter="formatter"
        ></b-form-input>
        <b-input-group-text>
          Y:
        </b-input-group-text>
        <b-form-input
          :value="height"
          name="height"
          v-on:input="updateHeight"
          type="number"
          step="1"
          min="0"
          placeholder="auto"
          :formatter="formatter"
        ></b-form-input>
      </b-input-group>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import {supportPositions, supportModes} from '../filters/CropFilter';
import SequenceId from '@/utils/SequenceId';

export default Vue.extend({
  props: ['mode', 'position', 'width', 'height'],
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
    formatter(value: string) {
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
