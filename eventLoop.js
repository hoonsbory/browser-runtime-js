import { Queue } from './dataStructure.js';
class EventLoop {
  callStack;
  macrotaskQueue = new Queue();
  rafQueue = new Queue();
  microtaskQueue = new Queue();
  runMicroTask() {
    while (this.isMicroTaskExist()) {
      console.log(
        `micro task send to call stack => ${this.microtaskQueue.top.data.callback.name}`,
      );
      const task = this.microtaskQueue.top.data.callback;
      this.microtaskQueue.dequeue();
      this.callStack.push(task);
    }
  }
  runMacroTask() {
    if (this.macrotaskQueue.top) {
      console.log(
        `oldest macro task send to call stack => ${this.macrotaskQueue.top.data.name}`,
      );
      const task = this.macrotaskQueue.top.data;
      this.macrotaskQueue.dequeue();
      this.callStack.push(task);
    }
  }
  runRafTask() {
    if (this.rafQueue.top) {
      console.log(`raf send to call stack => ${this.rafQueue.top.data.name}`);
      const task = this.rafQueue.top.data;
      this.rafQueue.dequeue();
      this.callStack.push(task);
    }
  }
  isMicroTaskExist() {
    return (
      this.microtaskQueue.top &&
      this.microtaskQueue.top.data.state === 'fullfilled'
    );
  }
  isTaskExist() {
    return (
      this.rafQueue.top || this.macrotaskQueue.top || this.isMicroTaskExist()
    );
  }
  runLoop() {
    while (this.callStack.isEmpty() && this.isTaskExist()) {
      this.runMacroTask();
      this.runMicroTask();
      this.runRafTask();
    }
  }
}

export default EventLoop;
