export default class FilterProcessor {
    #listProps = [];
    #queue = {};
    
    registerFilter(filter) {
        this.#listProps.push(filter);
    }

    getAllFilters() {
        return this.#listProps;
    }

    findFilter(name = String) {
        return this.#listProps.find(e => e.name === name);
    }

    async run(fileList, config) {
         var result = await Promise.all(fileList.map(async (file) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.src = url;
            await img.decode();
            const width = img.width;
            const height = img.height;
            var canvas = new OffscreenCanvas(width, height);
            canvas.getContext("2d").drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            return config.reduce((canvas, filterConfig) => {
                const filter = this.findFilter(filterConfig.name)
                return Object.assign(new filter(), filterConfig).run(canvas);
            }, canvas.getContext("2d"));            
        } ));

        return result
    }

    queue() {
        return this.#queue;
    }
}