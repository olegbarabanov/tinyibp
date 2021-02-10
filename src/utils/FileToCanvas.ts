export default async function FileToCanvas(file: any) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    const width = img.width;
    const height = img.height;
    var canvas = new OffscreenCanvas(width, height);

    /*BUG -- getContext can return NULL; */
    canvas.getContext("2d")?.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    return canvas;
}