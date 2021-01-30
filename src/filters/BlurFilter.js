import BasicFilter from "./BasicFilter"

export default class BlurFilter extends BasicFilter {
    level = 0;

    run (canvas) {
      const oldFilter = canvas.filter;
      canvas.filter = `blur(${this.level}px)`;
      canvas.drawImage(canvas.canvas, 0, 0);
      canvas.filter = oldFilter;
      return canvas;
    }
}