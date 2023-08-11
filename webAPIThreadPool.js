import { Queue } from './dataStructure.js';

class WebAPIThreadPool {
  eventLoop;
  constructor() {
    this.threadQueue = new Queue();
    this.webAPITaskQueue = new Queue();
  }
  webAPITaskEnQueue(func) {
    this.webAPITaskQueue.enqueue(func);
    this.allocateThread();
  }
  allocateThread() {
    if (this.threadQueue.size >= 5) {
      console.log('Thread is fulled');
    } else
      this.threadQueue.enqueue(
        new WebAPI(
          this.onCompleteFunc.bind(this),
          this.webAPITaskQueue.dequeue(),
        ),
      );
  }
  deallocateThread() {
    this.threadQueue.dequeue();
  }
  onCompleteFunc(func) {
    console.log(
      `Complete async & Macro task send to Macrotask queue => ${func.name}`,
    );
    this.eventLoop.macrotaskQueue.enqueue(func);
    // this.sendMacroToQueue(func);
    this.eventLoop.runLoop();
    this.deallocateThread();
    if (this.webAPITaskQueue.top) this.allocateThread();
  }
}
class WebAPI {
  constructor(onCompleteFunc, func) {
    this.onCompleteFunc = onCompleteFunc;
    this.func = func;
    this.startAsyncFunction();
  }

  startAsyncFunction() {
    console.log(`Start async => ${this.func.name}`);
    if (this.func.ms === 0) this.onCompleteFunc(this.func.callback);
    else
      setTimeout(() => this.onCompleteFunc(this.func.callback), this.func.ms);
  }
}

export default WebAPIThreadPool;
