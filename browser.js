import CallStack from './callStack.js';
import EventLoop from './eventLoop.js';
import WebAPIThreadPool from './webAPIThreadPool.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// function func1() {
//   setTimeout(cb1, 0);
//   const promise1 = Promise.resolve().then(cb2);
//   const promise2 = new Promise((resolve, reject) => {
//     setTimeout(function cb4() {
//       resolve();
//     }, 0);
//     func2();
//   });
//   promise1().then(cb3);
//   requestAnimationFrame(cb5);
// }

const executeContext = {
  name: 'func1',
  childFunc: [
    {
      name: 'setTimeout1',
      type: 'macro',
      callback: {
        name: 'cb1',
      },
    },
    {
      name: 'promise1',
      type: 'micro',
      resolve: 'promise1',
      callback: {
        name: 'cb2',
      },
    },
    {
      name: 'promise2',
      type: 'micro',
      state: 'pending',
      callback: {
        name: 'cb3',
      },
      childFunc: [
        {
          name: 'setTimeout3',
          type: 'macro',
          callback: {
            name: 'cb4',
            resolve: 'promise2',
          },
        },
        { name: 'func2' },
      ],
    },
    {
      name: 'raf1',
      type: 'raf',
      callback: {
        name: 'cb5',
      },
    },
  ],
};

class Browser {
  constructor() {
    this.callStack = new CallStack();
    this.eventLoop = new EventLoop();
    this.WebAPIThreadPool = new WebAPIThreadPool();
    this.callStack.eventLoop = this.eventLoop;
    this.callStack.WebAPIThreadPool = this.WebAPIThreadPool;
    this.eventLoop.callStack = this.callStack;
    this.WebAPIThreadPool.eventLoop = this.eventLoop;
  }

  //click, scroll ... => triggered by ui thread
  gestureEvent(type) {
    this.WebAPIThreadPool.webAPITaskEnQueue(eventCallback[type]);
  }

  start() {
    this.callStack.push(executeContext);
    rl.on('line', line => {
      this.callStack.push(JSON.parse(line));
    });
  }
}
const browser = new Browser();
browser.start();
