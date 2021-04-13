// eslint-disable-next-line node/no-unpublished-import
import Worker from 'worker-loader!./image-builder-worker';

export default class ImageBuilderWorkerManager {
  protected static workerManager?: ImageBuilderWorkerManager;
  protected maxWorkers = 1;
  protected workerList: Array<Worker> = [];
  protected countCallWorkers = 0;

  protected constructor() {
    this.workerList.push(new Worker());
  }

  setMaxWorker(maxWorkers: number): ImageBuilderWorkerManager {
    if (maxWorkers < 1)
      throw new Error('the maximum number of workers must be >= 1');
    this.maxWorkers = maxWorkers;
    if (this.workerList.length > maxWorkers) {
      this.workerList = this.workerList.slice(0, maxWorkers);
    } else {
      const countNewWorkers = maxWorkers - this.workerList.length;
      for (let i = 0; i < countNewWorkers; i++) {
        this.workerList.push(new Worker());
      }
    }
    return this;
  }

  getMaxWorker(): number {
    return this.maxWorkers;
  }

  getWorker(): Worker {
    const workerIndex = this.countCallWorkers % this.workerList.length;
    if (this.countCallWorkers === Number.MAX_SAFE_INTEGER) {
      this.countCallWorkers = 0;
    } else {
      this.countCallWorkers++;
    }
    return this.workerList[workerIndex];
  }

  static getInstance(): ImageBuilderWorkerManager {
    if (!ImageBuilderWorkerManager.workerManager) {
      ImageBuilderWorkerManager.workerManager = new ImageBuilderWorkerManager();
    }
    return ImageBuilderWorkerManager.workerManager;
  }
}
