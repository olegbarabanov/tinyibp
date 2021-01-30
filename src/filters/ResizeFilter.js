import BasicFilter from "./BasicFilter"

export default class ResizeFilter extends BasicFilter {
    resizeToX = 100;
    resizeToY = 100;

    run (canvas) {
      return canvas;
    }
}