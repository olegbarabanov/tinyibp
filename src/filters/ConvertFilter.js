import BasicFilter from "./BasicFilter"

export default class ConvertFilter extends BasicFilter {
    supportFormat = {
      "webp" : "image/webp",
      "gif" : "image/gif",
      "png" : "image/png",
      "jpg" : "image/jpeg"
    }

    targetFormat = "jpg";

    run (canvas) {
      return canvas;
    }
}