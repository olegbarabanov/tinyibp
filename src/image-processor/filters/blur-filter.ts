import AbstractFilter from './abstract-filter';

export default class BlurFilter extends AbstractFilter {
  readonly name: string = 'blur';
  level = 0;

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const newCanvas = new OffscreenCanvas(canvas.width, canvas.height);
    const newCanvasCtx = newCanvas.getContext('2d');
    if (newCanvasCtx === null)
      throw new Error('unable to create canvas context');

    newCanvasCtx.filter = `blur(${this.level}px)`;
    newCanvasCtx.drawImage(canvas, 0, 0);
    newCanvasCtx.filter = 'none';
    return newCanvas;
  }
}
