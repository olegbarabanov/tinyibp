export default abstract class AbstractFilter {
  /*
      static create(): AbstractFilter {
          return new this();
      }
  
      static getBasicProperty() {
          return Object.entries(new());
      }
      */
  readonly name: string;

  public constructor() {
    this.name = this.constructor.name;
  }

  async run(canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
    return canvas;
  }
}
