<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group m-0">
      <div>
        <input
          v-model.lazy="initColor"
          type="color"
          class="form-control"
        /><small tabindex="-1" class="form-text text-muted">{{
          t('colorreplacementfilter.form.initcolor.description')
        }}</small>
      </div>
    </div>
    <div class="form-group m-0 mt-3">
      <div>
        <input
          v-model.lazy="finalColor"
          type="color"
          class="form-control"
        /><small tabindex="-1" class="form-text text-muted">{{
          t('colorreplacementfilter.form.finalcolor.description')
        }}</small>
      </div>
    </div>
  </form>
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
        return {initColor: '', finalColor: ''};
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const initColor = computed({
      get: () => props.modelValue.initColor,
      set: value =>
        emit('update:modelValue', {...props.modelValue, initColor: value}),
    });
    const finalColor = computed({
      get: () => props.modelValue.finalColor,
      set: value =>
        emit('update:modelValue', {...props.modelValue, finalColor: value}),
    });
    return {t, componentID, initColor, finalColor};
  },
});
</script>
