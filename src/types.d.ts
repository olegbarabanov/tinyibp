declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

// const __APP_VERSION__ is assigned from the webpack settings
declare const __APP_VERSION__;
