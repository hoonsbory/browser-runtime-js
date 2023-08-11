import { Stack } from './dataStructure.js';

class CallStack extends Stack {
  WebAPIThreadPool;
  eventLoop;
  constructor() {
    super();
  }
  push(context) {
    console.log(`Push context! => ${context.name}`);
    super.push(context);
    this.run();
  }
  pop() {
    console.log(`Pop context! => ${this.top.data.name}`);
    super.pop();
    if (this.isEmpty() && !this.eventLoop.isLooping) {
      console.log('callstack is empty. run event loop');
      this.eventLoop.runLoop();
    }
  }
  run() {
    const { data } = this.top;
    console.log(`Run context! => ${data.name}`);

    data.childFunc?.forEach(context => this.push(context));

    if (data.callback)
      switch (data.type) {
        case 'micro':
          console.log(
            `Push micro task to micro task queue! => ${data.callback.name}`,
          );
          this.eventLoop.microtaskQueue.enqueue(data);
          break;
        case 'macro':
          console.log(`Push setTimeout to web API Thread! => ${data.name}`);
          this.WebAPIThreadPool.webAPITaskEnQueue(data);
          break;
        case 'raf':
          console.log(
            `Push raf task to raf task queue! => ${data.callback.name}`,
          );
          this.eventLoop.rafQueue.enqueue(data.callback);
          break;
        default:
          break;
      }
    if (data.resolve)
      this.eventLoop.microtaskQueue.forEach(node => {
        if (node.data.name === data.resolve) {
          node.data.state = 'fullfilled';
          console.log(`${node.data.name} has fullfilled!`);
        }
      });
    this.pop();
  }
}

export default CallStack;
