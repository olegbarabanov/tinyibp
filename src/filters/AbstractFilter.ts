import FilterInterface, {FilterMap} from "./FilterInterface";

export default abstract class AbstractFilter implements FilterInterface{

    abstract run(canvas: OffscreenCanvas): Promise<OffscreenCanvas>

    readonly name: string;

    constructor() {
        this.name = this.constructor.name;
    }

    getPropertyMap(): FilterMap {
        return Object.assign(this, this) as FilterMap;
    }

    setPropertyMap(map: FilterMap): FilterInterface {
       return Object.assign(this, map);
    }
}