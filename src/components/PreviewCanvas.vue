<template>
  <div>
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
        <canvas id="canvas" ref="canvas" :width="width" :height="height" />
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
      showProcessIndicator: false
    };
  },
  methods: {
    updateCanvas: function() {
      this.showProcessIndicator = true;
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(async () => {
        const sourceCanvas = await this.$store.dispatch("runFilterProcessorForOne", this.$store.state.showFileIndex);
        const canvas = this.$refs.canvas;
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        this.width = sourceCanvas.canvas.width;
        this.height = sourceCanvas.canvas.height;
        this.$nextTick(() => canvas.getContext("2d").drawImage(sourceCanvas.canvas, 0, 0))
        this.showProcessIndicator = false;
      }, 200)
    }
  },
  watch: {
  "$store.state.filterList": {
    handler:  async function() {
      await this.updateCanvas();
    },
    deep: true
  },
  "$store.state.showFileIndex" : {
    handler: async function() {
      //setTimeout(() => this.updateCanvas(), 500);
      await this.updateCanvas();
    },
    deep: true
  },
  },
  //updated: function() {
  //  this.updateCanvas();
 // }
};
</script>

<style>
</style>