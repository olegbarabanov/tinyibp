<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group">
      <label class="d-block">{{ $t('overlayfilter.form.image.label') }}</label>
      <input
        type="file"
        :accept="acceptImageTypeList"
        class="form-control form-control-sm"
        @input="updateImage($event.target.files[0])"
      />
    </div>
    <div class="form-group">
      <label class="d-block">{{
        $t('overlayfilter.form.position.label')
      }}</label>
      <div>
        <select
          class="form-select form-select-sm"
          :value="position"
          @input="updatePosition($event.target.value)"
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
      <label class="d-block">{{ $t('overlayfilter.form.margin.label') }}</label>
      <div>
        <input
          type="number"
          step="1"
          :value="margin"
          class="form-control"
          @input="updateMargin($event.target.value)"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {supportPositions} from '@/image-processor/filters/overlay-filter';
import {supportTypes} from '@/image-processor';

export default Vue.extend({
  props: {
    position: {
      type: Number as PropType<supportPositions>,
      default: supportPositions.MIDDLE_CENTER,
    },
    margin: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  data() {
    return {
      componentID: SequenceId.getNew(),
      supportPositions: Object.entries(supportPositions)
        .filter(([position]) => isNaN(Number(position)))
        .map(([position, index]) => {
          return {text: position, value: index};
        }),
    };
  },
  computed: {
    acceptImageTypeList() {
      return Array.from(supportTypes, type => type[0]).join(',');
    },
  },
  methods: {
    updateImage: function(value: File): void {
      this.$emit('update:image', value);
    },
    updatePosition: function(value: string): void {
      this.$emit('update:position', Number(value));
    },
    updateMargin: function(value: string): void {
      this.$emit('update:margin', Number(value));
    },
  },
});
</script>
