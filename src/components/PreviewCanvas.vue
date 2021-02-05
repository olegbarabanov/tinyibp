<template>
  <div class="preview h-100 d-flex flex-column">
    <b-form-group label="Button style radios" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        id="btn-radios-1"
        v-model="selected"
        :options="options"
        :aria-describedby="ariaDescribedby"
        name="radios-btn-default"
        buttons
      ></b-form-radio-group>
    </b-form-group>
    Width: {{ width }} px, Height: {{ height }} px
    <b-overlay :show="showProcessIndicator" class="d-inline-block">
      <canvas class="mw-100" id="canvas" ref="canvas" :width="width" :height="height" />
    </b-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "original-preview",
      options: [
        { text: "no-preview", value: "no-preview" },
        { text: "original-preview", value: "original-preview" },
        { text: "result-preview", value: "result-preview" },
      ],
      width: 0,
      height: 0,
      updateTimeout: 0,
      showProcessIndicator: false,
    };
  },
  methods: {
    updateCanvas: function () {
      const canvas = this.$refs.canvas;

      if (!this.$store.state.showFileIndex) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      this.showProcessIndicator = true;
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(async () => {
        const sourceCanvas = await this.$store.dispatch(
          "runFilterProcessorForOne",
          this.$store.state.showFileIndex
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        this.width = sourceCanvas.width;
        this.height = sourceCanvas.height;
        this.$nextTick(() =>
          canvas.getContext("2d").drawImage(sourceCanvas, 0, 0)
        );
        this.showProcessIndicator = false;
      }, 200);
    },
  },
  watch: {
    "$store.state.filterList": {
      handler: async function () {
        await this.updateCanvas();
      },
      deep: true,
    },
    "$store.state.showFileIndex": async function () {
        await this.updateCanvas();
    }
  },
  //updated: function() {
  //  this.updateCanvas();
  // }
};
</script>

<style>
div.preview {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".15"/></svg>');
  background-size: 50px;
}
</style>