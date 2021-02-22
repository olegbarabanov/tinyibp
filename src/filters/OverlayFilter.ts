import FileToCanvas from '../utils/FileToCanvas';
import AbstractFilter from './AbstractFilter';

export enum supportPositions {
  TOP_LEFT,
  TOP_CENTER,
  TOP_RIGHT,
  MIDDLE_LEFT,
  MIDDLE_CENTER,
  MIDDLE_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_CENTER,
  BOTTOM_RIGHT,
  MOSAIC_FIT,
}

export default class OverlayFilter extends AbstractFilter {
  readonly name: string = 'overlay';
  image?: File = undefined;
  position = 0; // Позиционирование
  margin = 0; //Отступ

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    if (!this.image) return canvas;

    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx === null) throw new Error('unable to create canvas context');
    const image = await FileToCanvas(this.image);
    //const margin = parseInt(this.margin);
    const margin = this.margin;
    switch (this.position) {
      case supportPositions.TOP_LEFT:
        canvasCtx.drawImage(image, margin, margin);
        break;
      case supportPositions.TOP_CENTER:
        canvasCtx.drawImage(image, (canvas.width - image.width) / 2, margin);
        break;
      case supportPositions.TOP_RIGHT:
        canvasCtx.drawImage(image, canvas.width - image.width - margin, margin);
        break;
      case supportPositions.MIDDLE_LEFT:
        canvasCtx.drawImage(image, margin, (canvas.height - image.height) / 2);
        break;
      case supportPositions.MIDDLE_CENTER:
        canvasCtx.drawImage(
          image,
          (canvas.width - image.width) / 2,
          (canvas.height - image.height) / 2
        );
        break;
      case supportPositions.MIDDLE_RIGHT:
        canvasCtx.drawImage(
          image,
          canvas.width - image.width - margin,
          (canvas.height - image.height) / 2
        );
        break;
      case supportPositions.BOTTOM_LEFT:
        canvasCtx.drawImage(
          image,
          margin,
          canvas.height - image.height - margin
        );
        break;
      case supportPositions.BOTTOM_CENTER:
        canvasCtx.drawImage(
          image,
          (canvas.width - image.width) / 2,
          canvas.height - image.height - margin
        );
        break;
      case supportPositions.BOTTOM_RIGHT:
        canvasCtx.drawImage(
          image,
          canvas.width - image.width - margin,
          canvas.height - image.height - margin
        );
        break;
      case supportPositions.MOSAIC_FIT: {
        // margin is not collapsed !!!
        const countCols = Math.floor(
          (canvas.width - margin) / (image.width + margin)
        );
        const countRows = Math.floor(
          (canvas.height - margin) / (image.height + margin)
        );
        const spaceBetweenCols =
          (canvas.width - image.width * countCols) / (countCols + 1);
        const spaceBetweenRows =
          (canvas.height - image.height * countRows) / (countRows + 1);
        for (let i = 0; i < countCols; i++) {
          for (let i2 = 0; i2 < countRows; i2++) {
            const x = spaceBetweenCols + i * (spaceBetweenCols + image.width);
            const y = spaceBetweenRows + i2 * (spaceBetweenRows + image.height);
            canvasCtx.drawImage(image, x, y);
          }
        }
        break;
      }
    }

    return canvas;
  }
}
