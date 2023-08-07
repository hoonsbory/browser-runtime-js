import { Stack } from './dataStructure.js';

class CallStack extends Stack {
  WebAPIThreadPool;
  eventLoop;
  constructor() {
    super();
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
          this.eventLoop.microtaskQueue.enqueue(data);
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

    if (data.resolve)
      this.eventLoop.microtaskQueue.forEach(node => {
        if (node.data.name === data.resolve) {
          node.data.state = 'fullfilled';
          console.log(`${node.data.name} is fullfilled!`);
        }
      });
    this.pop();
  }
}

export default CallStack;
