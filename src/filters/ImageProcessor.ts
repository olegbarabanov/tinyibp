import {FilterMap} from './FilterInterface';
import FilterProcessor from './FilterProcessor';

enum SupportExtensions {
  jpg = 'jpg',
  gif = 'gif',
  webp = 'webp',
  png = 'png',
  svg = 'svg',
}

enum SupportMimesTypes {
  jpg = 'image/jpeg',
  gif = 'image/gif',
  webp = 'image/webp',
  png = 'image/png',
  svg = 'image/svg',
}

const supportTypes = new Map<SupportMimesTypes, SupportExtensions>([
  [SupportMimesTypes.jpg, SupportExtensions.jpg],
  [SupportMimesTypes.gif, SupportExtensions.gif],
  [SupportMimesTypes.webp, SupportExtensions.webp],
  [SupportMimesTypes.png, SupportExtensions.png],
  [SupportMimesTypes.svg, SupportExtensions.svg],
]);

const defaultType = SupportMimesTypes.png;

export default class ImageProcessor {
  readonly filterProcessor: FilterProcessor;
  protected quality = 100;
  protected type: SupportMimesTypes | null = null;
  protected defaultType: SupportMimesTypes = SupportMimesTypes.png;
  protected nameTransformPattern = '@file';
  protected filterMaps: Array<FilterMap> = [];

  constructor(filterProcessor: FilterProcessor) {
    this.filterProcessor = filterProcessor;
  }

  setQuality(value: number) {
    this.quality = Number(value);
  }

  getQuality() {
    return this.quality;
  }

  setType(value: SupportMimesTypes | null) {
    this.type = value;
  }

  getType(): SupportMimesTypes | null {
    return this.type;
  }

  setNameTransformPattern(value: string) {
    this.nameTransformPattern = value;
  }

  getNameTransformPattern(): string {
    return this.nameTransformPattern;
  }

  setFilterMaps(filterMaps: Array<FilterMap>) {
    this.filterMaps = filterMaps;
  }

  async convertToCanvas(file: File): Promise<OffscreenCanvas> {
    const url = window.URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    const width = img.width;
    const height = img.height;
    const canvas = new OffscreenCanvas(width, height);

    /*BUG -- getContext can return NULL; */
    const canvasCtx = canvas.getContext('2d');
    if (canvasCtx === null) throw new Error('unable to create canvas context');
    canvasCtx.drawImage(img, 0, 0);
    window.URL.revokeObjectURL(url);

    return canvas;
  }

  async run(file: File): Promise<File> {
    const canvas = await this.filterProcessor.run(
      await this.convertToCanvas(file),
      this.filterMaps
    );
    const blob = await canvas.convertToBlob({
      type: this.type ?? undefined,
      quality: this.quality / 100,
    });
    const fileName = file.name;
    let type: SupportMimesTypes | null = this.type;
    if (!type) type = file.type as SupportMimesTypes;
    if (type === SupportMimesTypes.svg) type = this.defaultType;
    if (!type) type = this.defaultType;
    if (!supportTypes.has(type)) throw new Error('set unsupported image type');
    const fileExt = supportTypes.get(type) as string;

    return new File([blob], `${file.name}.${fileExt}`);
  }
}
