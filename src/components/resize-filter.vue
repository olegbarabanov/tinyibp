<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <fieldset class="form-group m-0">
      <legend tabindex="-1" class="col-form-label pt-0">
        {{ t('resizefilter.form.size.label') }}
      </legend>
      <div>
        <div class="input-group">
          <div class="input-group-text">
            X:
          </div>
          <input
            v-model="width"
            type="number"
            min="0"
            step="1"
            class="form-control"
          />
          <div class="input-group-text">
            Y:
          </div>
          <input
            v-model="height"
            type="number"
            min="0"
            step="1"
            class="form-control"
          />
        </div>
        <small tabindex="-1" class="form-text text-muted">{{
          t('resizefilter.form.size.description')
        }}</small>
      </div>
    </fieldset>
  </form>

  <!-- <b-form @submit.stop.prevent>
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
  </b-form> -->
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {width: 1, height: 1};
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const width = computed({
      get: () => props.modelValue.initColor,
      set: value =>
        emit('update:modelValue', {...props.modelValue, width: Number(value)}),
    });
    const height = computed({
      get: () => props.modelValue.finalColor,
      set: value =>
        emit('update:modelValue', {...props.modelValue, height: Number(value)}),
    });
    return {t, componentID, width, height};
  },
});
</script>
