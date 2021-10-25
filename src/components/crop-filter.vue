<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group">
      <label for="input-mode-3" class="d-block">{{
        $t('cropfilter.form.mode.label')
      }}</label>
      <div>
        <select
          id="input-mode-3"
          name="mode"
          class="mt-3 form-select form-select-sm"
          :value="mode"
          @change="updateMode($event.target.value)"
        >
          <option
            v-for="supportMode in supportModes"
            :key="supportMode.value"
            :value="supportMode.value"
          >
            {{ supportMode.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="d-block">{{ $t('cropfilter.form.position.label') }}</label>
      <div>
        <select
          name="position"
          class="mt-3 form-select form-select-sm"
          :value="position"
          @change="updatePosition($event.target.value)"
        >
          <option
            v-for="supportPosition in supportPositions"
            :key="supportPosition.value"
            :value="supportPosition.value"
          >
            {{ supportPosition.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="d-block">{{ $t('cropfilter.form.sizes.label') }}</label>
      <div>
        <div role="group" class="input-group">
          <div class="input-group-text">
            X:
          </div>
          <input
            type="number"
            placeholder="auto"
            min="0"
            step="1"
            class="form-control"
            :value="formatter(width)"
            @input="updateWidth($event.target.value)"
          />
          <div class="input-group-text">
            Y:
          </div>
          <input
            type="number"
            placeholder="auto"
            min="0"
            step="1"
            class="form-control"
            :value="formatter(height)"
            @input="updateHeight($event.target.value)"
          />
        </div>
        <small tabindex="-1" class="form-text text-muted">{{
          $t('cropfilter.form.sizes.description')
        }}</small>
      </div>
    </div>
  </form>

  <!-- <b-form @submit.stop.prevent>
    <b-form-group
      :label="$t('cropfilter.form.mode.label')"
      :label-for="`input-mode-${componentID}`"
    >
      <b-form-select
        :id="`input-mode-${componentID}`"
        name="mode"
        :value="mode"
        :options="supportModes"
        size="sm"
        class="mt-3"
        @change="updateMode"
      />
    </b-form-group>
    <b-form-group
      :label="$t('cropfilter.form.position.label')"
      :label-for="`input-position-${componentID}`"
    >
      <b-form-select
        :id="`input-position-${componentID}`"
        name="position"
        :value="position"
        :options="supportPositions"
        size="sm"
        class="mt-3"
        @input="updatePosition"
      />
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
  </b-form> -->
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
    mode: {
      type: String,
      default: supportModes.RATIO,
    },
    position: {
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
    };
  },
  computed: {
    supportPositions: function() {
      return Object.values(supportPositions).map(position => {
        return {
          text: this.$t(`cropfilter.form.position.value.${position}`),
          value: position,
        };
      });
    },
    supportModes: function() {
      return Object.values(supportModes).map(mode => {
        return {
          text: this.$t(`cropfilter.form.mode.value.${mode}`),
          value: mode,
        };
      });
    },
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
