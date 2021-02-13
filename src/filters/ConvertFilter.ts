import FilterInterface from "./FilterInterface";

interface ITypeFormat {
  [key: string]: string ;
}

export default class ConvertFilter implements FilterInterface {

    readonly supportFormat: ITypeFormat = {
      "webp" : "image/webp",
      "gif" : "image/gif",
      "png" : "image/png",
      "jpg" : "image/jpeg"
    }

    targetFormat: string = "jpg";

    async run (canvas: OffscreenCanvas): Promise<OffscreenCanvas> {
      return canvas;
    }
}