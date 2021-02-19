import FilterFactory from './FilterFactory';
import FilterInterface, {FilterMap} from './FilterInterface';

export default class FilterProcessor {
  listProps: Array<FilterInterface> = [];
  protected filterFactory: FilterFactory;

  constructor(filterFactory?: FilterFactory) {
    this.filterFactory = !filterFactory ? new FilterFactory() : filterFactory;
  }

  getFilterFactory(): FilterFactory {
    return this.filterFactory;
  }

  async run(
    canvas: OffscreenCanvas,
    filterMaps: Array<FilterMap>
  ): Promise<OffscreenCanvas> {
    for (const map of filterMaps) {
      const filterConstructor = this.getFilterFactory().findFilter(map.name);
      if (!filterConstructor) throw new Error('filter not found');
      const filter = new filterConstructor();
      filter.setPropertyMap(map);
      canvas = await filter.run(canvas);
    }
    return canvas;
  }
}
