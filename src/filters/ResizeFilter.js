import BasicFilter from "./BasicFilter"

export default class ResizeFilter extends BasicFilter {
    resizeToX = 0;
    resizeToY = 0;

    async run (canvas) {
      const x = Number(this.resizeToX);
      const y = Number(this.resizeToY);
      const deltaX = x / canvas.width;
      const deltaY = y / canvas.height;
      var newHeight = y;
      var newWidth = x;

      if (x === 0 && y === 0) {
        return canvas;
      } else if (x === 0) {
        newWidth = deltaY * canvas.width;
      } else if (y === 0) {
        newHeight = deltaX * canvas.height;
      }

      const newCanvas = new OffscreenCanvas(newWidth, newHeight);
      newCanvas.getContext("2d").drawImage(canvas,0,0,canvas.width,canvas.height,0,0,newWidth,newHeight);
      return newCanvas;
    }
}