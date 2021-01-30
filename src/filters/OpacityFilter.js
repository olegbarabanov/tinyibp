import BasicFilter from "./BasicFilter"

export default class OpacityFilter extends BasicFilter {
    level = 0;

    run (canvas) {
      const oldFilter = canvas.filter;
      canvas.filter = `opacity(${this.level * 0.01})`;
      canvas.drawImage(canvas.canvas, 0, 0);
      canvas.filter = oldFilter;
      return canvas;
    }
}