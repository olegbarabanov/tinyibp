import {FilterFactory, FilterMap} from '.';

/**
 * Сlass for registering and executing filters
 */
export default class FilterProcessor {
  protected filterFactory: FilterFactory;

  /**
   * @param filterFactory - filter factory class or undefined.
   */
  constructor(filterFactory?: FilterFactory) {
    this.filterFactory = !filterFactory ? new FilterFactory() : filterFactory;
  }

  /**
   * Кeturns the assigned class factory
   * @returns - assigned object implements the FilterFactory class
   */
  getFilterFactory(): FilterFactory {
    return this.filterFactory;
  }

  /**
   * A method that starts processing the canvas with filters based on filter maps
   * @param canvas - object implements the Offscreen Canvas class
   * @param filterMaps - a filter maps that describes the filter parameters
   * @returns - Promise which returns a new OffscreenCanvas
   */
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
