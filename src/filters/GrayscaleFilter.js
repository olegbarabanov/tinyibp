import BasicFilter from "./BasicFilter"

export default class GrayscaleFilter extends BasicFilter {
    level = 100;

    async run (canvas) {
      const canvasCtx = canvas.getContext("2d");
      const oldFilter = canvasCtx.filter;
      canvasCtx.filter = `grayscale(${this.level * 0.01})`;
      canvasCtx.drawImage(canvas, 0, 0);
      canvasCtx.filter = oldFilter;
      return canvas;
    }
}