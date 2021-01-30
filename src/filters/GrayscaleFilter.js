import BasicFilter from "./BasicFilter"

export default class GrayscaleFilter extends BasicFilter {
    level = 100;

    run (canvas) {
      const oldFilter = canvas.filter;
      canvas.filter = `grayscale(${this.level * 0.01})`;
      canvas.drawImage(canvas.canvas, 0, 0);
      canvas.filter = oldFilter;
      return canvas;
    }
}