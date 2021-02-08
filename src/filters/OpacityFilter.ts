import BasicFilter from "./BasicFilter"

export default class OpacityFilter extends BasicFilter {
    level = 0;

    async run (canvas: any) {
      const canvasCtx = canvas.getContext("2d");
      const oldFilter = canvasCtx.filter;
      canvasCtx.filter = `opacity(${this.level * 0.01})`;
      canvasCtx.drawImage(canvas, 0, 0);
      canvasCtx.filter = oldFilter;
      return canvas;
    }
}