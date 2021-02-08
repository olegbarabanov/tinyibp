import FileToCanvas from "../utils/FileToCanvas";

export default class FilterProcessor {
    #listProps: Array<any> = [];
    #queue = {};
    
    registerFilter(filter: any) {
        this.#listProps.push(filter);
    }

    getAllFilters() {
        return this.#listProps;
    }

    findFilter(name:String) {
        return this.#listProps.find(e => e.name === name);
    }

    async run(fileList: any, config: any) {
         return await Promise.all(fileList.map(async (file: any) => {
            let canvas = await FileToCanvas(file);
            for (let filterConfig of config) {
                let filter = this.findFilter(filterConfig.name);
                canvas = await Object.assign(new filter(), filterConfig).run(canvas);
            }
            return canvas;
        } ));
    }

    queue() {
        return this.#queue;
    }
}