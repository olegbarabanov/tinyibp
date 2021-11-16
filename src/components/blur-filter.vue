<i18n global src="../common/locales.json"></i18n>

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
          @input="updateLevel(($event.target as HTMLInputElement).value)"
        />
        <small tabindex="-1" class="form-text text-muted">{{
          t('blurfilter.form.level.description')
        }}</small>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
export default defineComponent({
  props: {
    level: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:level'],
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const updateLevel = (value: string) => {
      const numberValue = Number(value);
      if (!isNaN(numberValue)) {
        emit('update:level', numberValue);
      }
    };
    return {t, componentID, updateLevel};
  },
});

/*
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
*/
</script>
