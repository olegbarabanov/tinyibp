import FileToCanvas from "../utils/FileToCanvas";
import BasicFilter from "./BasicFilter"

export default class OverlayFilter extends BasicFilter {
    image = null;
    position = 0; // Позиционирование
    margin = 0; //Отступ

    get supportPositions () {
      return Object.freeze({
        TOP_LEFT: 0,
        TOP_CENTER: 1,
        TOP_RIGHT: 2,
        CENTER_LEFT: 3,
        CENTER_CENTER: 4,
        CENTER_RIGHT: 5,
        BOTTOM_LEFT: 6,
        BOTTOM_CENTER: 7,
        BOTTOM_RIGHT: 8,
        MOSAIC_FIT: 9
      })
    }

    async run (canvas: any) {
      const canvasCtx = canvas.getContext("2d");
      if (!this.image) return canvas;
      const image = await FileToCanvas(this.image);
      //const margin = parseInt(this.margin);
      const margin = this.margin;
      switch (this.position){
        case this.supportPositions.TOP_LEFT:
          canvasCtx.drawImage(image, margin, margin);
          break;
        case this.supportPositions.TOP_CENTER:
          canvasCtx.drawImage(image, (canvas.width - image.width) / 2, margin);
          break;
        case this.supportPositions.TOP_RIGHT:
          canvasCtx.drawImage(image, canvas.width - image.width - margin, margin);
          break;
        case this.supportPositions.CENTER_LEFT:
          canvasCtx.drawImage(image, margin, (canvas.height - image.height) / 2);
          break;
        case this.supportPositions.CENTER_CENTER:
          canvasCtx.drawImage(image, (canvas.width - image.width) / 2, (canvas.height - image.height) / 2);
          break;
        case this.supportPositions.CENTER_RIGHT:
          canvasCtx.drawImage(image, canvas.width - image.width - margin, (canvas.height - image.height) / 2);
          break;
        case this.supportPositions.BOTTOM_LEFT:
          canvasCtx.drawImage(image, margin, canvas.height - image.height - margin);
          break;
        case this.supportPositions.BOTTOM_CENTER:
          canvasCtx.drawImage(image, (canvas.width - image.width) / 2, canvas.height - image.height - margin);
          break;
        case this.supportPositions.BOTTOM_RIGHT:
          canvasCtx.drawImage(image, canvas.width - image.width - margin, canvas.height - image.height - margin);
          break;
        case this.supportPositions.MOSAIC_FIT: {
          // margin is not collapsed !!!
          let countCols = Math.floor((canvas.width - margin) / (image.width + margin));
          let countRows = Math.floor((canvas.height - margin) / (image.height + margin));
          let spaceBetweenCols = (canvas.width - image.width * countCols) / (countCols + 1);
          let spaceBetweenRows = (canvas.height - image.height * countRows) / (countRows + 1);
          
          for (let i = 0; i < countCols; i++) {
            for (let i2 = 0; i2 < countRows; i2++) {
              let x = spaceBetweenCols + i*(spaceBetweenCols + image.width);
              let y = spaceBetweenRows + i2 * (spaceBetweenRows + image.height);
              canvasCtx.drawImage(image, x , y);
            }
          }
          break;
        }
      }

      return canvas;
    }
}