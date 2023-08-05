import { Queue } from './dataStructure.js';
import EventLoop from './eventLoop.js';

class WebAPIThreadPool {
  static #instance;
  constructor() {
    if (WebAPIThreadPool.#instance) return WebAPIThreadPool.#instance;
    WebAPIThreadPool.#instance = this;
    this.eventLoop = new EventLoop();
    this.threadQueue = new Queue();
    this.webAPITaskQueue = new Queue();
  }
  webAPITaskEnQueue(func) {
    this.webAPITaskQueue.enqueue(func);
    this.allocateThread();
  }
  allocateThread() {
    if (this.threadQueue.size >= 5) {
      console.log('thread is fulled');
    } else
      this.threadQueue.enqueue(
        new WebApi(
          this.onCompleteFunc.bind(this),
          this.webAPITaskQueue.dequeue(),
        ),
      );
  }
  deallocateThread() {
    this.threadQueue.dequeue();
  }
  onCompleteFunc(func) {
    this.eventLoop.macrotaskQueue.enqueue(func);
    // this.sendMacroToQueue(func);
    this.eventLoop.runLoop();
    this.deallocateThread();
    if (this.webAPITaskQueue.top) this.allocateThread();
  }
}
class WebApi {
  constructor(onCompleteFunc, func) {
    this.onCompleteFunc = onCompleteFunc;
    this.func = func;
    this.startAsyncFunction();
  }

  startAsyncFunction() {
    console.log(`start async => ${this.func.name}`);
    setTimeout(() => {
      console.log(`complete async => ${this.func.name}`);
      this.onCompleteFunc(this.func.callback);
    }, 0);
  }
}

export default WebAPIThreadPool;
