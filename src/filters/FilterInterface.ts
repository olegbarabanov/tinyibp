export default interface FilterInterface {
  run(canvas: OffscreenCanvas): Promise<OffscreenCanvas>
}