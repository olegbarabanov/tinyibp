import {ImageBuilder} from './image-builder';
import ImageBuilderWorkerManager from './image-builder-worker-manager';

export class ImageBuilderWorkerProxy extends ImageBuilder {
  readonly worker: Worker;
  readonly messagePort: MessagePort;

  constructor(file: File) {
    super(file);
    this.worker = ImageBuilderWorkerManager.getInstance().getWorker();
    const mc = new MessageChannel();
    this.messagePort = mc.port1;
    this.worker.postMessage(file, [mc.port2]);
    this.worker.onmessage = e => console.log(this, e);
  }

  setFilterMap(...args: Parameters<ImageBuilder['setFilterMap']>): this {
    this.messagePort.postMessage({method: 'setFilterMap', params: args});
    return super.setFilterMap(...args);
  }

  setQuality(...args: Parameters<ImageBuilder['setQuality']>): this {
    this.messagePort.postMessage({method: 'setQuality', params: args});
    return super.setQuality(...args);
  }

  setType(...args: Parameters<ImageBuilder['setType']>): this {
    this.messagePort.postMessage({method: 'setType', params: args});
    return super.setType(...args);
  }

  setNameTransformPattern(
    ...args: Parameters<ImageBuilder['setNameTransformPattern']>
  ): this {
    this.messagePort.postMessage({
      method: 'setNameTransformPattern',
      params: args,
    });
    return super.setNameTransformPattern(...args);
  }

  async buildCanvas(): Promise<OffscreenCanvas> {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = e => {
        if (e.data instanceof OffscreenCanvas) {
          resolve(e.data);
        } else {
          reject(
            new Error('the return value must be of the type OffscreenCanvas')
          );
        }
      };
      messageChannel.port1.onmessageerror = () => reject();
      this.messagePort.postMessage({method: 'buildCanvas', params: []}, [
        messageChannel.port2,
      ]);
    });
  }

  async buildImageBitmap(): Promise<ImageBitmap> {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = e => {
        if (e.data instanceof ImageBitmap) {
          resolve(e.data);
        } else {
          reject(new Error('the return value must be of the type ImageBitmap'));
        }
      };
      messageChannel.port1.onmessageerror = () => reject();
      this.messagePort.postMessage({method: 'buildImageBitmap', params: []}, [
        messageChannel.port2,
      ]);
    });
  }

  async buildFile(): Promise<File> {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = e => {
        if (e.data instanceof File) {
          resolve(e.data);
        } else {
          reject(new Error('the return value must be of the type File'));
        }
      };
      messageChannel.port1.onmessageerror = () => reject();
      this.messagePort.postMessage({method: 'buildFile', params: []}, [
        messageChannel.port2,
      ]);
    });
  }
}
