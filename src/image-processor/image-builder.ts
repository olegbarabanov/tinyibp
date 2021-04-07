import {FilterMap, FilterProcessor, SupportMimesTypes, supportTypes} from '.';

/**
 * Builder class for images in various views
 */
export class ImageBuilder {
  protected quality = 90;
  protected type?: SupportMimesTypes;
  protected nameTransformPattern = '@file';
  protected file: File;
  protected filterProcessor?: FilterProcessor;
  protected filterMaps: Array<FilterMap> = [];
  protected decodeCacheImageBitmap?: ImageBitmap;

  /**
   * ImageBuilder constructor
   * @param file - image file
   */
  constructor(file: File) {
    this.file = file;
    this.type = this.file.type as SupportMimesTypes;
  }

  /**
   * Method for setting filter maps that define the filters to be applied to the image
   * @param filterMaps - list of filter maps
   * @returns (this) - current object
   */
  setFilterMap(filterMaps: Array<FilterMap>): ImageBuilder {
    this.filterMaps = filterMaps;
    return this;
  }

  /**
   * Method for returning the set list of filter maps
   * @returns returning the mounted list of FilterMap
   */
  getFilterMap(): Array<FilterMap> {
    return this.filterMaps;
  }

  /**
   * Method for setting the filter handler
   * @param filterProcessor - filter handler
   * @returns (this) - current image builder
   */
  setFilterProcessor(filterProcessor?: FilterProcessor): ImageBuilder {
    this.filterProcessor = filterProcessor;
    return this;
  }

  /**
   * Method for returning the set filter handler
   * @returns - filter handler
   */
  getFilterProcessor(): FilterProcessor | undefined {
    return this.filterProcessor;
  }

  /**
   * Method for setting the image quality level
   * @param value - image quality level
   * @returns (this) - current image builder
   */
  setQuality(value: number): ImageBuilder {
    this.quality = Number(value);
    return this;
  }

  /**
   * Method for returning the set image quality level
   * @returns - current image cuality level
   */
  getQuality(): number {
    return this.quality;
  }

  /**
   * Method for setting the required image MIME type
   * @param value - defined type or undefined
   * @returns (this) - current image builder
   */
  setType(value: SupportMimesTypes | undefined): ImageBuilder {
    this.type = value;
    if (!this.type) this.type = this.file.type as SupportMimesTypes;
    return this;
  }

  /**
   * Method for returning the set image MIME type or undefined
   * @returns image type or undefined if unknown
   */
  getType(): SupportMimesTypes | undefined {
    return this.type;
  }

  /**
   * method for setting the file name transformation pattern
   * @param value - transformation pattern
   * @returns (this) - current image builder
   */
  setNameTransformPattern(value: string): ImageBuilder {
    this.nameTransformPattern = value;
    return this;
  }

  /**
   * Method for returning the set file name transformation pattern
   * @returns current file name transformation pattern
   */
  getNameTransformPattern(): string {
    return this.nameTransformPattern;
  }

  /**
   * Method that returns the file name processed by the pattern (see method getNameTransformPattern)
   * @returns - pattern-processed file name
   */
  getTransformName(): string {
    const replacer = new Map();
    replacer.set('@file', () => this.file.name.replace(/\.[^.]+$/, ''));
    return this.nameTransformPattern.replaceAll(
      new RegExp([...replacer.keys()].join('|'), 'gi'),
      match => {
        return replacer.get(match)();
      }
    );
  }

  /**
   * Async method for asynchronous conversion blob to canvas
   * @param file - image blob
   * @returns - Promise which returns a new OffscreenCanvas
   */
  protected async convertToCanvas(file: File): Promise<OffscreenCanvas> {
    if (!this.decodeCacheImageBitmap) {
      this.decodeCacheImageBitmap = await createImageBitmap(file);
    }
    const imageBitmap = this.decodeCacheImageBitmap;

    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    /*BUG -- getContext can return NULL; */
    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx === null) throw new Error('unable to create canvas context');
    canvasCtx.drawImage(imageBitmap, 0, 0);
    return canvas;
  }

  /**
   * Async method for building the current canvas
   * @returns - Promise which returns a current OffscreenCanvas
   */
  async buildCanvas(): Promise<OffscreenCanvas> {
    const canvasPromise = this.convertToCanvas(this.file);
    return this.filterProcessor
      ? this.filterProcessor.run(await canvasPromise, this.filterMaps)
      : canvasPromise;
  }

  /**
   * Async method for building the current image bitmap
   * @returns - Promise which returns a current image bitmap
   */
  async buildImageBitmap(): Promise<ImageBitmap> {
    const canvas = await this.buildCanvas();
    return createImageBitmap(canvas);
  }

  /**
   * Async method for building the current image file
   * @returns - Promise which returns the resulting file
   */
  async buildFile(): Promise<File> {
    let type: SupportMimesTypes | undefined = this.type;
    if (!type) type = this.file.type as SupportMimesTypes;
    if (!supportTypes.has(type)) throw new Error('set unsupported image type');

    const canvas = await this.buildCanvas();
    const blob = await canvas.convertToBlob({
      type: type,
      quality: this.quality / 100,
    });
    const fileName = this.getTransformName();
    const fileExt = supportTypes.get(type) as string;
    return new File([blob], `${fileName}.${fileExt}`, {
      type: type,
    });
  }
}
