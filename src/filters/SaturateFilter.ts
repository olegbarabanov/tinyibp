import BasicFilter from "./BasicFilter"

export default class SaturateFilter extends BasicFilter {
    level = 100;

    async run (canvas: any) {
      const canvasCtx = canvas.getContext("2d");
      const oldFilter = canvasCtx.filter;
      canvasCtx.filter = `saturate(${this.level * 0.01})`;
      canvasCtx.drawImage(canvas, 0, 0);
      canvasCtx.filter = oldFilter;
      return canvas;
    }
}