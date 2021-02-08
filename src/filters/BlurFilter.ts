import BasicFilter from "./BasicFilter"

export default class BlurFilter extends BasicFilter {
    level = 0;

    async run (canvas: any) {
      const canvasCtx = canvas.getContext("2d");
      
      const oldFilter = canvasCtx.filter;
      canvasCtx.filter = `blur(${this.level}px)`;
      canvasCtx.drawImage(canvas, 0, 0);
      canvasCtx.filter = oldFilter;
      return canvas;
    }
}