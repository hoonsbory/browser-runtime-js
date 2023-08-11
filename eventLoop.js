import { Queue } from './dataStructure.js';
class EventLoop {
  callStack;
  macrotaskQueue = new Queue();
  rafQueue = new Queue();
  microtaskQueue = new Queue();
  runMicroTask() {
    while (this.isMicroTaskExist()) {
      const { data } = this.microtaskQueue.top;
      console.log(`Micro task send to call stack => ${data.callback.name}`);
      const task = data.callback;
      this.microtaskQueue.dequeue();
      this.callStack.push(task);
    }
  }
  runMacroTask() {
    if (this.macrotaskQueue.top) {
      const { data } = this.macrotaskQueue.top;
      console.log(`Oldest macro task send to call stack => ${data.name}`);
      this.macrotaskQueue.dequeue();
      this.callStack.push(data);
    }
  }
  runRafTask() {
    if (this.rafQueue.top) {
      const { data } = this.rafQueue.top;
      console.log(`Raf task send to call stack => ${data.name}`);
      this.rafQueue.dequeue();
      this.callStack.push(data);
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
