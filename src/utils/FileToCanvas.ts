export default async function FileToCanvas(file: File): Promise<OffscreenCanvas> {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    const width = img.width;
    const height = img.height;
    var canvas = new OffscreenCanvas(width, height);

    /*BUG -- getContext can return NULL; */
    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx === null) throw new Error("unable to create canvas context");
    canvasCtx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    
    return canvas;
}