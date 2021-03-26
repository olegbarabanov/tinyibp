import {FilterConstructor, FilterInterface} from '.';

/**
 * Factory class for filters
 */
export class FilterFactory {
  protected filterCollection: Array<FilterConstructor> = [];

  /**
   * method for registering filters for subsequent work with it
   * @param filter - a class (not an object!) that implements the FilterInterface
   */
  registerFilter(filter: FilterConstructor): void {
    this.filterCollection.push(filter);
  }

  /**
   * method for searching for the class corresponding to the filter name
   * @param filterName - string name of the filter
   * @returns corresponding class or null
   */
  findFilter(filterName: string): FilterConstructor | null {
    return (
      this.filterCollection.find(
        (filter: FilterConstructor) => filterName === new filter().name
      ) ?? null
    );
  }

  /**
   * method that returns a list of registered filters
   * @returns a list of registered filters
   */
  getFilterCollection(): Array<FilterConstructor> {
    return this.filterCollection;
  }

  /**
   * method that returns an instance of the filter
   * @param filterName - string name of the filter
   * @returns - instance of the filter class or null
   */
  createInstance(filterName: string): FilterInterface | null {
    const filter = this.findFilter(filterName);
    return filter ? new filter() : null;
  }
}
