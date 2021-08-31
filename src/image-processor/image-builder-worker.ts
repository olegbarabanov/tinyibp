//import {ImageBuilder} from './ImageBuilder';

import {FilterProcessor, ImageBuilder, SUPPORT_FILTERS} from '.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

const filterProcessor = new FilterProcessor();

SUPPORT_FILTERS.forEach(filter => {
  filterProcessor.getFilterFactory().registerFilter(filter);
});

ctx.onmessage = e => {
  if (
    !e.ports[0] ||
    !(e.ports[0] instanceof MessagePort) ||
    !(e.data instanceof File)
  ) {
    return false;
  }

  const messagePort = e.ports[0];
  const imageBuilder = new ImageBuilder(e.data);
  imageBuilder.setFilterProcessor(filterProcessor);

  messagePort.onmessage = async e => {
    const ERR_TYPE =
      'data is not an object of the type "{method: ImageBuilder method, params: ...args}"';
    if (
      typeof e.data !== 'object' ||
      !e.data.method ||
      !e.data.params ||
      !(e.data.method in imageBuilder) ||
      !Array.isArray(e.data.params)
    )
      throw new Error(ERR_TYPE);
    const method: keyof ImageBuilder = e.data.method;
    if (typeof imageBuilder[method] !== 'function') throw new Error(ERR_TYPE);
    const params: Parameters<typeof imageBuilder[typeof method]> =
      e.data.params;

    /**
     * FIXME
     * Unfortunally, TypeScript 4.1 has problems with types when using spread(...) operator for typing
     *
     * A simple example of the problem:
     * const dateFields = [20218, 5, 14, 14, 41, 11];
       const date = new Date(...dateFields); have error "Expected 0-7 arguments, but got 0 or more."

     * see offer ideas: https://github.com/microsoft/TypeScript/issues/10727
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (imageBuilder[method] as any)(...params);
    const transferable: Array<Transferable | OffscreenCanvas> = [];
    for (const cls of [
      OffscreenCanvas,
      MessagePort,
      ArrayBuffer,
      ImageBitmap,
    ]) {
      if (result instanceof cls) {
        transferable.push(result);
        break;
      }
    }
    if (e.ports[0]) {
      e.ports[0].postMessage(result, transferable);
    }
  };
};
