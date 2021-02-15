import AbstractFilter from "./AbstractFilter";

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
}

export enum supportModes {
  SIZES,
  RATIO,
}

export default class CropFilter extends AbstractFilter {
  position: supportPositions = 0; // Позиционирование
  width: number = 1;
  height: number = 1;
  mode: supportModes = supportModes.SIZES;

  protected cropByRatio(
    canvasCtx: OffscreenCanvasRenderingContext2D,
    width: number,
    height: number,
    position: supportPositions
  ): OffscreenCanvasRenderingContext2D {
    const delta = width / height;
    const canvasWidth = canvasCtx.canvas.width;
    const canvasHeight = canvasCtx.canvas.height;
    const deltaMin = Math.min(canvasWidth / width, canvasHeight / height);
    const newCanvasWidth = width * deltaMin;
    const newCanvasHeight = height * deltaMin;

    return this.cropBySize(
      canvasCtx,
      newCanvasWidth,
      newCanvasHeight,
      position
    );
  }

  protected cropBySize(
    canvasCtx: OffscreenCanvasRenderingContext2D,
    width: number,
    height: number,
    position: supportPositions
  ): OffscreenCanvasRenderingContext2D {
    const newCanvas = new OffscreenCanvas(width, height);
    const oldCanvas = canvasCtx.canvas;
    const newCanvasCtx = newCanvas.getContext("2d");
    if (newCanvasCtx === null)
      throw new Error("unable to create canvas context");

    const sL = 0;
    const dL = 0;
    const sC = Math.max((oldCanvas.width - width) / 2, 0);
    const dC = Math.max((width - oldCanvas.width) / 2, 0);
    const sR = Math.max(oldCanvas.width - width, 0);
    const dR = Math.max(width - oldCanvas.width, 0);
    const sT = 0;
    const dT = 0;
    const sM = Math.max((oldCanvas.height - height) / 2, 0);
    const dM = Math.max((height - oldCanvas.height) / 2, 0);
    const sB = Math.max(oldCanvas.height - height, 0);
    const dB = Math.max(height - oldCanvas.height, 0);
    const sW = Math.min(oldCanvas.width, width);
    const sH = Math.min(oldCanvas.height, height);
    const dW = sW;
    const dH = sH;
    console.log(width, height);

    switch (this.position) {
      case supportPositions.TOP_LEFT:
        newCanvasCtx.drawImage(oldCanvas, sL, sT, sW, sH, dL, dT, dW, dH);
        break;
      case supportPositions.TOP_CENTER:
        newCanvasCtx.drawImage(oldCanvas, sC, sT, sW, sH, dC, dT, dW, dH);
        break;
      case supportPositions.TOP_RIGHT:
        newCanvasCtx.drawImage(oldCanvas, sR, sT, sW, sH, dR, dT, dW, dH);
        break;
      case supportPositions.MIDDLE_LEFT:
        newCanvasCtx.drawImage(oldCanvas, sL, sM, sW, sH, dL, dM, dW, dH);
        break;
      case supportPositions.MIDDLE_CENTER:
        newCanvasCtx.drawImage(oldCanvas, sC, sM, sW, sH, dC, dM, dW, dH);
        break;
      case supportPositions.MIDDLE_RIGHT:
        newCanvasCtx.drawImage(oldCanvas, sR, sM, sW, sH, dR, dM, dW, dH);
        break;
      case supportPositions.BOTTOM_LEFT:
        newCanvasCtx.drawImage(oldCanvas, sL, sB, sW, sH, dL, dB, dW, dH);
        break;
      case supportPositions.BOTTOM_CENTER:
        newCanvasCtx.drawImage(oldCanvas, sC, sB, sW, sH, dC, dB, dW, dH);
        break;
      case supportPositions.BOTTOM_RIGHT:
        newCanvasCtx.drawImage(oldCanvas, sR, sB, sW, sH, dR, dB, dW, dH);
        break;
    }
    return newCanvasCtx;
  }

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx === null) throw new Error("unable to create canvas context");

    switch (this.mode) {
      case supportModes.RATIO:
        return this.cropByRatio(
          canvasCtx,
          this.width,
          this.height,
          this.position
        ).canvas;
      case supportModes.SIZES:
        return this.cropBySize(
          canvasCtx,
          this.width,
          this.height,
          this.position
        ).canvas;
      default:
        throw new Error("unsupport mode");
    }
  }
}
