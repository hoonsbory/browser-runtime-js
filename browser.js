import CallStack from './callStack.js';
import EventLoop from './eventLoop.js';
import WebAPIThreadPool from './webAPIThreadPool.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
class Browser {
  constructor() {
    this.callStack = new CallStack();
    this.eventLoop = new EventLoop();
    this.WebAPIThreadPool = new WebAPIThreadPool();
  }

  //click, scroll ... => triggered by ui thread
  gestureEvent(type) {
    this.WebAPIThreadPool.webAPITaskEnQueue(eventCallback[type]);
  }

  testCLI() {}

  start() {
    this.callStack.push({
      name: 'func1',
      type: 'micro',
      callback: {
        name: 'cb1',
      },
      childFunc: [
        {
          name: 'func2',
          type: 'micro',
          callback: {
            name: 'cb2',
          },
          childFunc: [
            {
              name: 'func4',
              type: 'macro',
              callback: {
                name: 'cb3',
              },
            },
            {
              name: 'func5',
              type: 'macro',
              callback: {
                name: 'cb4',
              },
            },
            { name: 'func3' },
          ],
        },
        {
          name: 'func6',
          type: 'raf',
          callback: {
            name: 'raf1',
          },
        },
      ],
    });
    rl.on('line', line => {
      this.callStack.push(JSON.parse(line));
    });
  }
}
const browser = new Browser();
browser.start();
