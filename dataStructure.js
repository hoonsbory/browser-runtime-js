class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.top = null;
    this.currEnqueuedNode = null;
    this.size = 0;
  }
  enqueue(data) {
    const newNode = new Node(data);
    newNode.data = data;
    if (!this.top) this.top = newNode;
    else {
      this.currEnqueuedNode.next = newNode;
    }
    this.currEnqueuedNode = newNode;
    this.size += 1;
  }
  dequeue() {
    const temp = this.top.data;
    this.top = this.top?.next;
    this.size += -1;
    return temp;
  }
}

class Stack {
  constructor() {
    this.top = null;
  }
  isEmpty() {
    return this.top === null;
  }
  push(data) {
    const newNode = new Node(data);
    newNode.next = this.top;
    this.top = newNode;
  }
  pop() {
    if (this.isEmpty()) return;
    this.top = this.top.next;
  }
}

export { Queue, Stack };
