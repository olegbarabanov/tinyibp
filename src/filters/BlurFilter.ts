import AbstractFilter from './AbstractFilter';

export default class BlurFilter extends AbstractFilter {
  readonly name: string = 'blur';
  level = 0;

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx === null) throw new Error('unable to create canvas context');

    const oldFilter = canvasCtx.filter;
    canvasCtx.filter = `blur(${this.level}px)`;
    canvasCtx.drawImage(canvas, 0, 0);
    canvasCtx.filter = oldFilter;
    return canvas;
  }
}
