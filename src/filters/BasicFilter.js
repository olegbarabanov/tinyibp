export default class BasicFilter {
    #name = String;
    #vueComponent = String;

    static create() {
        return new self;
    }

    static getBasicProperty() {
        return Object.entries(new this);
    }

    get name () {
        return this.getName();
    }

    getName() {
        return this.constructor.name;
    }

    getVueComponent() {
        return this.#vueComponent;
    }

    run (canvas) {
        return canvas;
    }
}