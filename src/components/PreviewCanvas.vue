<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="transparent"
    header-bg-variant="dark"
    header-text-variant="white"
    header="Предпросмотр"
    class="h-100 text-center"
    border-variant="dark"
  >
    <div class="h-100 d-flex flex-column border border-left border-right">
      <b-form-group v-slot="{ariaDescribedby}">
        <b-form-radio-group
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radios-btn-default"
          buttons
        ></b-form-radio-group>
      </b-form-group>
      Size: {{ width }} x {{ height }} px
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
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      selected: 'result-preview' as string,
      width: 0 as number,
      height: 0 as number,
      updateTimeout: 0 as any,
      showProcessIndicator: false as boolean,
    };
  },
  computed: {
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
        const sourceCanvas = await this.$store.dispatch(
          'runFilterProcessorForOne',
          {
            index: this.$store.state.showFileIndex,
            ignoreFilter: this.selected === 'original-preview',
          }
        );
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        this.width = sourceCanvas.width;
        this.height = sourceCanvas.height;
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
    selected: async function() {
      await this.updateCanvas();
    },
  },
  //updated: function() {
  //  this.updateCanvas();
  // }
});
</script>
