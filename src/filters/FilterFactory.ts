import FilterInterface from "./FilterInterface";

type FilterConstructor = {
    new (): FilterInterface
}

export default class FilterFactory {
  protected filterCollection: Array<FilterConstructor> = [];

  registerFilter(filter: FilterConstructor): void {
    this.filterCollection.push(filter);
  }

  findFilter(filterName: string): FilterConstructor |null {
    return (
        this.filterCollection.find(
          (filter: FilterConstructor) => filterName === filter.name
        ) ?? null
      );
  }

  getFilterCollection(): Array<FilterConstructor> {
    return this.filterCollection;
  }

  createInstance(filterName: string): FilterInterface | null {
    const filter = this.findFilter(filterName);
    return filter ? new filter() : null;
  }
}
