import FileToCanvas from "../utils/FileToCanvas";
import FilterFactory from "./FilterFactory";
import FilterInterface from "./FilterInterface";

export default class FilterProcessor {
    listProps: Array<FilterInterface> = [];
    protected filterFactory: FilterFactory;

    constructor(filterFactory?: FilterFactory) {
        this.filterFactory = !filterFactory ? new FilterFactory() : filterFactory;
    }

    getFilterFactory(): FilterFactory {
        return this.filterFactory;
    }

    async run(file: File, config: any): Promise<OffscreenCanvas> {
        let canvas = await FileToCanvas(file);
        for (let filterConfig of config) {
            let filter = this.getFilterFactory().findFilter(filterConfig.name);
            if (!filter) throw new Error("filter not found");
            canvas = await Object.assign(new filter(), filterConfig).run(canvas);
        }
        return canvas;
    }

}