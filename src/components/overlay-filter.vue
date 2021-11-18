<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <div class="form-group">
      <label class="d-block">{{ t('overlayfilter.form.image.label') }}</label>
      <input
        type="file"
        :accept="acceptImageTypeList"
        class="form-control form-control-sm"
        @input="updateImage(($event.target as HTMLInputElement).files?.[0])"
      />
    </div>
    <div class="form-group">
      <label class="d-block">{{
        t('overlayfilter.form.position.label')
      }}</label>
      <div>
        <select v-model="position" class="form-select form-select-sm">
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
      <label class="d-block">{{ t('overlayfilter.form.margin.label') }}</label>
      <div>
        <input v-model="margin" type="number" step="1" class="form-control" />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
import {supportPositions} from '@/image-processor/filters/overlay-filter';
import {supportTypes} from '@/image-processor';

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {
          position: supportPositions.MIDDLE_CENTER,
          margin: 0,
          // image: undefined as Blob | undefined,
        };
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const componentID = SequenceId.getNew();
    const {t} = useI18n({useScope: 'global'});
    const margin = computed({
      get: () => props.modelValue.margin,
      set: value =>
        emit('update:modelValue', {...props.modelValue, margin: value}),
    });
    const position = computed({
      get: () => props.modelValue.position,
      set: value =>
        emit('update:modelValue', {...props.modelValue, position: value}),
    });

    const updateImage = (image?: File) => {
      console.log(image);
      emit('update:modelValue', {...props.modelValue, image});
    };

    // const image = computed({
    //   get: () => props.modelValue.image,
    //   set: value =>
    //     emit('update:modelValue', {...props.modelValue, image: value}),
    // });

    const positionList = computed(() =>
      Object.entries(supportPositions)
        .filter(([position]) => isNaN(Number(position)))
        .map(([position, index]) => {
          return {text: position, value: index};
        })
    );

    const acceptImageTypeList = computed(() =>
      Array.from(supportTypes, type => type[0]).join(',')
    );

    return {
      t,
      componentID,
      margin,
      position,
      positionList,
      acceptImageTypeList,
      // image,
      updateImage,
    };
  },
});

/*
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
*/
</script>
