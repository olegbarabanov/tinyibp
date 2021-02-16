export type FilterMap = {
  name: string;
}

export default interface FilterInterface {
  name: string;
  run(canvas: OffscreenCanvas): Promise<OffscreenCanvas>;
  getPropertyMap(): FilterMap;
  setPropertyMap(map: FilterMap): FilterInterface;
}