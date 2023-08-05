import { Stack } from './dataStructure.js';
import EventLoop from './eventLoop.js';
import WebAPIThreadPool from './webAPIThreadPool.js';

class CallStack extends Stack {
  static #instance;
  constructor() {
    super();
    if (CallStack.#instance) return CallStack.#instance;
    CallStack.#instance = this;
    this.WebAPIThreadPool = new WebAPIThreadPool();
    this.eventLoop = new EventLoop();
  }
  push(context) {
    console.log(`push context! => ${context.name}`);
    super.push(context);
    this.run();
  }
  pop() {
    console.log(`pop context! => ${this.top.data.name}`);
    super.pop();
    if (this.isEmpty() && !this.eventLoop.isLooping) this.eventLoop.runLoop();
  }
  run() {
    const { data } = this.top;
    console.log(`run context! => ${data.name}`);

    data.childFunc?.forEach(context => this.push(context));
    if (data.callback)
      switch (data.type) {
        case 'micro':
          this.eventLoop.microtaskQueue.enqueue(data.callback);
          break;
        case 'macro':
          this.WebAPIThreadPool.webAPITaskEnQueue(data);
          break;
        case 'raf':
          this.eventLoop.rafQueue.enqueue(data.callback);
          break;
        default:
          break;
      }
    this.pop();
  }
}

export default CallStack;
