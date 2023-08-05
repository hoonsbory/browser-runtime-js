import CallStack from './callStack.js';
import { Queue } from './dataStructure.js';

class EventLoop {
  static #instance;
  callStack = new CallStack();
  macrotaskQueue = new Queue();
  rafQueue = new Queue();
  microtaskQueue = new Queue();
  isLooping = false;
  constructor() {
    if (EventLoop.#instance) return EventLoop.#instance;
    EventLoop.#instance = this;
  }
  runMicroTask() {
    while (this.microtaskQueue.top) {
      console.log(
        `micro task send to call stack => ${this.microtaskQueue.top.data.name}`,
      );
      const task = this.microtaskQueue.top.data;
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
  isTaskExist() {
    return (
      this.rafQueue.top || this.macrotaskQueue.top || this.microtaskQueue.top
    );
  }
  runLoop() {
    this.isLooping = true;
    while (this.callStack.isEmpty() && this.isTaskExist()) {
      this.runMacroTask();
      this.runMicroTask();
      this.runRafTask();
    }
    this.isLooping = false;
  }
}

export default EventLoop;
