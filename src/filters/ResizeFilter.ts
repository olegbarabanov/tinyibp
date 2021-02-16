import AbstractFilter from "./AbstractFilter";

export default class ResizeFilter extends AbstractFilter {
    readonly name:string = "resize";
    resizeToX: number = 0;
    resizeToY: number = 0;

    async run (canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
      const x = this.resizeToX;
      const y = this.resizeToY;
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
      const newCanvasCtx = newCanvas.getContext("2d");
      if (newCanvasCtx === null) throw new Error("unable to create canvas context");
      /*BUG -- getContext can return NULL; */
      newCanvasCtx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,newWidth,newHeight);

      return newCanvas;
    }
}