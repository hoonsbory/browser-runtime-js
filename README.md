<h1 align="center">Javascript Browser Runtime 👋</h1>

<br>


## :page_with_curl: ​Summary

> Implemented a browser in JavaScript to demonstrate the interaction between the event loop, callstack, and web API in a browser. <br> The event loop was implemented following the HTML specifications.
<br>



### Description

For implementing function execution in the browser, we represent functions as objects and add them to the call stack.

```javascript
function func1() {
  setTimeout(cb1, 0);
  const promise1 = Promise.resolve().then(cb2);
  const promise2 = new Promise((resolve, reject) => {
    setTimeout(function cb4() {
      resolve();
    }, 1000);
    func2();
  });
  promise2.then(cb3);
  requestAnimationFrame(cb5);
}
```

This is what an object representation of the function above would look like

```javascript
const executeContext = {
  name: 'func1',
  childFunc: [
    {
      name: 'setTimeout1',
      type: 'macro',
      ms: 0,
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
          name: 'setTimeout2',
          type: 'macro',
          ms: 1000,
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

```

### browser.js (main JS)
```javascript
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

  start() {
    this.callStack.push(executeContext);

    // After the function finishes executing, you can try to execute it again by entering it in JSON format into the CLI, as demonstrated in the previous example
    // ex) {"name" : "func1" }
    rl.on('line', line => {
      this.callStack.push(JSON.parse(line));
    });
  }
}
const browser = new Browser();
browser.start();
```

The object contains a function named 'name' and a child function called 'childFunc'. These functions will be executed within the scope.

Asynchronous functions must have a callback.

There are three types of asynchronous functions: macro, micro (Promise), and raf (requestAnimationFrame) that can be employed.

To create promises, add a 'resolve' property in the scope that resolves the promise. The value should match the name of the corresponding promise object.

To make the sequence of actions clear for macro tasks, we set setTimeout to 0 seconds, although several web APIs are available.

By default, the thread pool for the WEB API is limited to 5.

<br/>

### Usage
```
npm run start
```
When you run the program with the command, you will see the following output.
```
Push context! => func1
Run context! => func1
Push context! => setTimeout1
Run context! => setTimeout1
Push setTimeout to web API Thread! => setTimeout1
Start async => setTimeout1
Complete async & Macro task send to Macrotask queue => cb1
Pop context! => setTimeout1
Push context! => promise1
Run context! => promise1
Push micro task to micro task queue! => cb2
promise1 has fullfilled!
Pop context! => promise1
Push context! => promise2
Run context! => promise2
Push context! => setTimeout2
Run context! => setTimeout2
Push setTimeout to web API Thread! => setTimeout2
Start async => setTimeout2
Pop context! => setTimeout2
Push context! => func2
Run context! => func2
Pop context! => func2
Push micro task to micro task queue! => cb3
Pop context! => promise2
Push context! => raf1
Run context! => raf1
Push raf task to raf task queue! => cb5
Pop context! => raf1
Pop context! => func1
callstack is empty. run event loop
Oldest macro task send to call stack => cb1
Push context! => cb1
Run context! => cb1
Pop context! => cb1
Micro task send to call stack => cb2
Push context! => cb2
Run context! => cb2
Pop context! => cb2
Raf task send to call stack => cb5
Push context! => cb5
Run context! => cb5
Pop context! => cb5
Complete async & Macro task send to Macrotask queue => cb4
Oldest macro task send to call stack => cb4
Push context! => cb4
Run context! => cb4
promise2 has fullfilled!
Pop context! => cb4
Micro task send to call stack => cb3
Push context! => cb3
Run context! => cb3
Pop context! => cb3
```
<br>




