import AbstractFilter from './abstract-filter';

export default class ResizeFilter extends AbstractFilter {
  readonly name: string = 'resize';
  width = 0;
  height = 0;

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const x = this.width;
    const y = this.height;
    const deltaX = x / canvas.width;
    const deltaY = y / canvas.height;
    let newHeight = y;
    let newWidth = x;

    if (x === 0 && y === 0) {
      return canvas;
    } else if (x === 0) {
      newWidth = deltaY * canvas.width;
    } else if (y === 0) {
      newHeight = deltaX * canvas.height;
    }

    const newCanvas = new OffscreenCanvas(newWidth, newHeight);
    const newCanvasCtx = newCanvas.getContext('2d');
    if (newCanvasCtx === null)
      throw new Error('unable to create canvas context');
    /*BUG -- getContext can return NULL; */
    newCanvasCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      newWidth,
      newHeight
    );

    return newCanvas;
  }
}
