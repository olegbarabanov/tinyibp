import {FilterInterface, FilterMap} from '..';

export default abstract class AbstractFilter implements FilterInterface {
  abstract readonly name: string;

  abstract run(canvas: OffscreenCanvas): Promise<OffscreenCanvas>;
  getPropertyMap(): FilterMap {
    return Object.assign({}, this) as FilterMap;
  }

  setPropertyMap(map: FilterMap): FilterInterface {
    return Object.assign(this, map);
  }
}
