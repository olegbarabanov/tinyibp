<i18n src="../common/locales.json"></i18n>

<template>
  <b-form @submit.stop.prevent>
    <b-form-group
      :label="$t('overlayfilter.form.image.label')"
      :label-for="`input-image-${componentID}`"
    >
      <b-form-file
        :id="`input-image-${componentID}`"
        placeholder="Choose a file or drop it here..."
        :accept="acceptImageTypeList"
        drop-placeholder="Drop file here..."
        @input="updateImage"
      />
    </b-form-group>
    <b-form-group
      :label="$t('overlayfilter.form.position.label')"
      :label-for="`input-position-${componentID}`"
    >
      <b-form-select
        :value="position"
        :options="supportPositions"
        :label-for="`input-position-${componentID}`"
        size="sm"
        @input="updatePosition"
      />
    </b-form-group>
    <b-form-group
      :label="$t('overlayfilter.form.margin.label')"
      :label-for="`input-margin-${componentID}`"
    >
      <b-form-input
        :label-for="`input-margin-${componentID}`"
        :value="margin"
        type="number"
        step="1"
        @input="updateMargin"
      />
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {supportPositions} from '@/ImageProcessor/filters/OverlayFilter';
import SequenceId from '@/utils/SequenceId';
import {supportTypes} from '@/ImageProcessor';

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
      this.$emit('update:position', value);
    },
    updateMargin: function(value: string): void {
      this.$emit('update:margin', Number(value));
    },
  },
});
</script>

function SupportTypes(SupportTypes: any, arg1: (type: unknown) => any) { throw
new Error('Function not implemented.'); }
