import FilterInterface, {FilterMap} from "./FilterInterface";

export default abstract class AbstractFilter implements FilterInterface{

    abstract run(canvas: OffscreenCanvas): Promise<OffscreenCanvas>

    readonly name: string = "";

    getPropertyMap(): FilterMap {
        return Object.assign({}, this) as FilterMap;
    }

    setPropertyMap(map: FilterMap): FilterInterface {
       return Object.assign(this, map);
    }
}