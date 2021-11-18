<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group">
      <label for="input-mode-3" class="d-block">{{
        t('cropfilter.form.mode.label')
      }}</label>
      <div>
        <select
          id="input-mode-3"
          v-model="mode"
          name="mode"
          class="mt-3 form-select form-select-sm"
        >
          <option
            v-for="modeItem in modeList"
            :key="modeItem.value"
            :value="modeItem.value"
          >
            {{ modeItem.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="d-block">{{ t('cropfilter.form.position.label') }}</label>
      <div>
        <select
          v-model="position"
          name="position"
          class="mt-3 form-select form-select-sm"
        >
          <option
            v-for="positionItem in positionList"
            :key="positionItem.value"
            :value="positionItem.value"
          >
            {{ positionItem.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="d-block">{{ t('cropfilter.form.sizes.label') }}</label>
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
            :value="inputSizeFormatter(width)"
            @input="width = ($event.target as HTMLInputElement).value"
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
            :value="inputSizeFormatter(height)"
            @input="height = ($event.target as HTMLInputElement).value"
          />
        </div>
        <small tabindex="-1" class="form-text text-muted">{{
          t('cropfilter.form.sizes.description')
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
import {computed, defineComponent} from 'vue';
import {
  supportPositions,
  supportModes,
} from '@/image-processor/filters/crop-filter';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {
          mode: supportModes.RATIO,
          position: supportPositions.CENTER_MIDDLE,
          width: 1,
          height: 1,
        };
      },
    },
  },

  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const mode = computed({
      get: () => props.modelValue.mode,
      set: value =>
        emit('update:modelValue', {...props.modelValue, mode: value}),
    });

    const position = computed({
      get: () => props.modelValue.position,
      set: value =>
        emit('update:modelValue', {...props.modelValue, position: value}),
    });

    const width = computed({
      get: () => props.modelValue.width,
      set: value =>
        emit('update:modelValue', {...props.modelValue, width: value}),
    });

    const height = computed({
      get: () => props.modelValue.height,
      set: value =>
        emit('update:modelValue', {...props.modelValue, height: value}),
    });

    const inputSizeFormatter = (value: string): string => {
      return Number(value) === 0 ? '' : value;
    };

    const positionList = computed(() => {
      return Object.values(supportPositions).map(position => {
        return {
          text: t(`cropfilter.form.position.value.${position}`),
          value: position,
        };
      });
    });

    const modeList = computed(() => {
      return Object.values(supportModes).map(mode => {
        return {
          text: t(`cropfilter.form.mode.value.${mode}`),
          value: mode,
        };
      });
    });

    return {
      t,
      componentID,
      mode,
      position,
      width,
      height,
      positionList,
      modeList,
      inputSizeFormatter,
    };
  },
});

/*
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
*/
</script>
