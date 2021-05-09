import AbstractFilter from './abstract-filter';

export default class RotateFilter extends AbstractFilter {
  readonly name: string = 'rotate';
  angle = 0;

  /**
   * Method for converting degrees to radians value
   * @param degree - angle in degrees
   * @returns - angle in radians
   */
  degToRad(degree: number): number {
    return degree * (Math.PI / 180);
  }

  /**
   * method for normalizing the angle value
   * @param degree - angle in any number range
   * @returns - normalize value between 0 and 359 degree
   */
  normalizeAngle(degree: number): number {
    degree %= 360;
    if (degree < 0) degree += 360;
    return degree;
  }

  /**
   * method to calculate the width and height of the canvas at an angle
   * @param width - width source canvas
   * @param height - height source canvas
   * @param angle - angle in degrees
   * @returns - new width and height
   */
  protected computeRotatedSize(
    width: number,
    height: number,
    angle: number
  ): {width: number; height: number} {
    angle = this.normalizeAngle(angle);
    const angleDeg = angle % 90 === 0 ? 90 : angle % 90;
    if (
      angle === 0 ||
      (angle > 90 && angle <= 180) ||
      (angle > 270 && angle <= 360)
    )
      [height, width] = [width, height];

    const angleRad = this.degToRad(angleDeg);
    const newWidth = width * Math.cos(angleRad) + height * Math.sin(angleRad);
    const newHeight = width * Math.sin(angleRad) + height * Math.cos(angleRad);
    return {width: newWidth, height: newHeight};
  }

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    const newCanvasSize = this.computeRotatedSize(
      canvas.width,
      canvas.height,
      this.angle
    );

    const newCanvas = new OffscreenCanvas(
      newCanvasSize.width,
      newCanvasSize.height
    );
    const newCanvasCtx = newCanvas.getContext('2d');
    if (newCanvasCtx === null)
      throw new Error('unable to create canvas context');
    newCanvasCtx.save();
    newCanvasCtx.translate(newCanvasSize.width / 2, newCanvasSize.height / 2);
    newCanvasCtx.rotate(this.degToRad(this.angle));
    newCanvasCtx.drawImage(canvas, -(canvas.width / 2), -(canvas.height / 2));
    newCanvasCtx.restore();
    return newCanvas;
  }
}
