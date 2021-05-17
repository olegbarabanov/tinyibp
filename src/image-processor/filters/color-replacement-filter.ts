import AbstractFilter from './abstract-filter';

type RGBAStruct = {r: number; g: number; b: number; a: number};

export default class ColorReplacementFilter extends AbstractFilter {
  readonly name: string = 'color-replacement';
  initColor = '#FFFFFF';
  finalColor = '#FFFFFF';

  protected isValidHexColor(hex: string): boolean {
    return /^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(hex);
  }

  protected hexToRgba(hex: string): RGBAStruct {
    if (!this.isValidHexColor(hex)) throw new Error('incorrect hex color');
    hex = hex.replace(/#/, '');
    if (hex.length < 6) hex = hex.replace(/(.)/g, '$1$1');
    if (hex.length < 8) hex += 'FF';
    const dec = hex.match(/../g)?.map(val => parseInt(val, 16));
    if (!dec || dec.length < 4) throw new Error('incorrect hex color');
    const color: RGBAStruct = {
      r: dec[0],
      g: dec[1],
      b: dec[2],
      a: dec[3],
      //a: Math.round((100 * 255) / dec[3]) / 100,
    };

    return color;
  }

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx === null) throw new Error('unable to create canvas context');
    const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const initColorRgba = this.hexToRgba(this.initColor);
    const finalColorRgba = this.hexToRgba(this.finalColor);

    /**
     * in the current version ignores the alpha channel
     */
    for (let i = 0; i < data.length; i += 4) {
      if (
        data[i] === initColorRgba.r &&
        data[i + 1] === initColorRgba.g &&
        data[i + 2] === initColorRgba.b // &&
        //data[i + 3] === initColorRgba.a
      ) {
        data[i] = finalColorRgba.r;
        data[i + 1] = finalColorRgba.g;
        data[i + 2] = finalColorRgba.b;
        //data[i + 3] = finalColorRgba.a;
      }
    }
    canvasCtx.putImageData(imageData, 0, 0);
    return canvas;
  }
}
