import AbstractFilter from './AbstractFilter';

export default class SaturateFilter extends AbstractFilter {
  readonly name: string = 'saturate';
  level = 100;

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx === null) throw new Error('unable to create canvas context');

    const oldFilter = canvasCtx.filter;
    canvasCtx.filter = `saturate(${this.level * 0.01})`;
    canvasCtx.drawImage(canvas, 0, 0);
    canvasCtx.filter = oldFilter;
    return canvas;
  }
}
