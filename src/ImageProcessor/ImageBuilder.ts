import {FilterMap, FilterProcessor, SupportMimesTypes, supportTypes} from '.';

export class ImageBuilder {
  protected quality = 90;
  protected type?: SupportMimesTypes;
  protected nameTransformPattern = '@file';
  protected file: File;
  protected filterProcessor?: FilterProcessor;
  protected filterMaps: Array<FilterMap> = [];
  protected decodeCacheImageBitmap?: ImageBitmap;

  constructor(file: File) {
    this.file = file;
    this.type = this.file.type as SupportMimesTypes;
  }

  setFilterMap(filterMaps: Array<FilterMap>) {
    this.filterMaps = filterMaps;
    return this;
  }

  getFilterMap() {
    return this.filterMaps;
  }

  setFilterProcessor(filterProcessor?: FilterProcessor) {
    this.filterProcessor = filterProcessor;
    return this;
  }

  getFilterProcessor(): FilterProcessor | undefined {
    return this.filterProcessor;
  }

  setQuality(value: number) {
    this.quality = Number(value);
    return this;
  }

  getQuality() {
    return this.quality;
  }

  setType(value: SupportMimesTypes | undefined) {
    this.type = value;
    if (!this.type) this.type = this.file.type as SupportMimesTypes;
    return this;
  }

  getType(): SupportMimesTypes | undefined {
    return this.type;
  }

  setNameTransformPattern(value: string) {
    this.nameTransformPattern = value;
    return this;
  }

  getNameTransformPattern(): string {
    return this.nameTransformPattern;
  }

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

  async buildCanvas(): Promise<OffscreenCanvas> {
    const canvasPromise = this.convertToCanvas(this.file);
    return this.filterProcessor
      ? this.filterProcessor.run(await canvasPromise, this.filterMaps)
      : canvasPromise;
  }

  async buildImageBitmap(): Promise<ImageBitmap> {
    const canvas = await this.buildCanvas();
    return createImageBitmap(canvas);
  }

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
