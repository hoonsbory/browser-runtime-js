<h1 align="center">Javascript Browser Runtime 👋</h1>

<br>


## :page_with_curl: ​Summary

> Implementing how event loops, call stacks, and web APIs interact with each other via JavaScript
<br>



### Description

You can see in what order the prepared function objects are executed.

```javascript
function func1() {
  setTimeout(cb1, 0);
  const promise1 = Promise.resolve().then(cb2);
  const promise2 = new Promise((resolve, reject) => {
    setTimeout(function cb4() {
      resolve();
    }, 0);
    func2();
  });
  promise1().then(cb3);
  requestAnimationFrame(cb5);
}
```

Represent the above function as an object

```javascript
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
          name: 'setTimeout2',
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

```

The object has a function name (name) and a child function (childFunc) that will be executed in scope.

If it's an asynchronous function, it will have a callback.

There are three types of asynchronous functions: macro, micro (Promise), and raf (requestAnimationFrame).

For promises, create a resolve property in the scope that does the resolving. The value is the name of the corresponding promise object.

For macro tasks, there are various web APIs, but we fixed setTimeout to 0 seconds to make the sequence of actions clear.

The thread pool for the WEB API is limited to a default value of 5.

<br/>

### Usage
```
npm run start
```
command to run the program, you'll see the following output.
```
Push context! => func1
Run context! => func1
Push context! => setTimeout1
Run context! => setTimeout1
Start async => setTimeout1
Pop context! => setTimeout1
Push context! => promise1
Run context! => promise1
promise1 has fullfilled!
Pop context! => promise1
Push context! => promise2
Run context! => promise2
Push context! => setTimeout2
Run context! => setTimeout2
Start async => setTimeout2
Pop context! => setTimeout2
Push context! => func2
Run context! => func2
Pop context! => func2
Pop context! => promise2
Push context! => raf1
Run context! => raf1
Pop context! => raf1
Pop context! => func1
Micro task send to call stack => cb2
Push context! => cb2
Run context! => cb2
Pop context! => cb2
Raf task send to call stack => cb5
Push context! => cb5
Run context! => cb5
Pop context! => cb5
Complete async => setTimeout1
Oldest macro task send to call stack => cb1
Push context! => cb1
Run context! => cb1
Pop context! => cb1
Complete async => setTimeout2
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
Additionally, you can enter the above function object via the CLI to use it like a browser's developer tools console window.
<br>




