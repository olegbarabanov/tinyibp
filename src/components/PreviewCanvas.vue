<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="transparent"
    class="h-100 text-center"
    border-variant="dark"
    no-body
  >
    <b-card-header
      header-bg-variant="dark"
      header-text-variant="white"
      class="d-flex flex-row align-items-center justify-content-center p-1"
      style="min-height:3rem"
    >
      <h5 class="my-0 mx-4">Предпросмотр</h5>
      <b-form-group v-slot="{ariaDescribedby}" class="d-inline-flex m-0 mx-4">
        <b-form-radio-group
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radios-btn-default"
          size="sm"
          buttons
        ></b-form-radio-group>
      </b-form-group>
    </b-card-header>
    <b-card-body class="h-100">
      <div class="h-100 d-flex flex-column border border-left border-right">
        <b-overlay
          :show="showProcessIndicator"
          class="d-flex flex-grow-1 align-items-center justify-content-center overflow-auto p-1"
        >
          <canvas
            class="mw-100 mh-100"
            id="canvas"
            ref="canvas"
            :width="width"
            :height="height"
          />
        </b-overlay>
      </div>
    </b-card-body>
    <b-card-footer
      footer-bg-variant="dark"
      footer-text-variant="white"
      v-show="show"
      class="text"
    >
      <p class="text-nowrap">
        <b-badge class="d-inline-flex text-truncate mw-100">{{ name }}</b-badge>
      </p>
      <p>
        <span class="m-3"
          >Размер <b-badge>{{ width }}x{{ height }}</b-badge></span
        >
        <span class="m-3"
          >Вес <b-badge>{{ sizeToMb }} МБ</b-badge></span
        >
        <span class="m-3"
          >Тип <b-badge>{{ type }}</b-badge></span
        >
      </p>
    </b-card-footer>
  </b-card>
</template>

<script lang="ts">
import FilterProcessor from '@/filters/FilterProcessor';
import ImageProcessor from '@/filters/ImageProcessor';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      selected: 'result-preview' as string,
      width: 0 as number,
      height: 0 as number,
      updateTimeout: 0 as any,
      showProcessIndicator: false as boolean,
      size: 0 as number,
      type: '' as string,
      name: '' as string,
    };
  },
  computed: {
    show: function() {
      return this.$store.state.showFileIndex !== null;
    },
    sizeToMb: function() {
      return (this.$data.size / 1000 ** 2).toFixed(3);
    },
    options: function() {
      return [
        {
          value: 'original-preview',
          text: this.$t('preview.button.viewselector.originalview'),
        },
        {
          value: 'result-preview',
          text: this.$t('preview.button.viewselector.resultview'),
        },
      ];
    },
  },
  methods: {
    updateCanvas: function() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      if (this.$store.state.showFileIndex === null) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      this.showProcessIndicator = true;
      window.clearTimeout(this.updateTimeout);
      this.updateTimeout = window.setTimeout(async () => {
        const sourceBlob =
          this.selected === 'original-preview'
            ? this.$store.state.fileList[this.$store.state.showFileIndex]
            : await this.$store.dispatch(
                'runFilterProcessorForOne',
                this.$store.state.showFileIndex
              );

        const sourceCanvas = await new ImageProcessor(
          new FilterProcessor()
        ).convertToCanvas(sourceBlob);
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        this.width = sourceCanvas.width;
        this.height = sourceCanvas.height;
        this.size = sourceBlob.size;
        this.type = sourceBlob.type;
        this.name = sourceBlob.name;
        this.$nextTick(() =>
          canvas.getContext('2d')?.drawImage(sourceCanvas, 0, 0)
        );
        this.showProcessIndicator = false;
      }, 200);
    },
  },
  watch: {
    '$store.state.filterMaps': {
      handler: async function() {
        await this.updateCanvas();
      },
      deep: true,
    },
    '$store.state.showFileIndex': async function() {
      await this.updateCanvas();
    },
    '$store.state.type': async function() {
      await this.updateCanvas();
    },
    '$store.state.quality': async function() {
      await this.updateCanvas();
    },
    '$store.state.nameTransformPattern': async function() {
      await this.updateCanvas();
    },
    selected: async function() {
      await this.updateCanvas();
    },
  },
  //updated: function() {
  //  this.updateCanvas();
  // }
});
</script>
