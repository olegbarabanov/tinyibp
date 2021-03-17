import AbstractFilter from './AbstractFilter';

export default class ContrastFilter extends AbstractFilter {
  readonly name: string = 'contrast';
  level = 100;

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const newCanvas = new OffscreenCanvas(canvas.width, canvas.height);
    const newCanvasCtx = newCanvas.getContext('2d');
    if (newCanvasCtx === null)
      throw new Error('unable to create canvas context');

    newCanvasCtx.filter = `contrast(${this.level * 0.01})`;
    newCanvasCtx.drawImage(canvas, 0, 0);
    newCanvasCtx.filter = '';
    return newCanvas;
  }
}
