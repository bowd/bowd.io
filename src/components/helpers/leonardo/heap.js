import { leonardoNumbersTill } from './numbers';

const leonardoIndexMap = { 1: 1 };
let leonardoNumbers = [1, 1];

const leonardoIndex = number => {
  if (leonardoIndexMap[number] == undefined) {
    while (leonardoNumbers[leonardoNumbers.length - 1] < number) {
      let next =
        leonardoNumbers[leonardoNumbers.length - 1] +
        leonardoNumbers[leonardoNumbers.length - 2] +
        1;
      leonardoNumbers.push(next);
      leonardoIndexMap[next] = leonardoNumbers.length - 1;
    }
  }

  return leonardoIndexMap[number];
};

export class LeonardoHeap {
  constructor(set, options) {
    this.trees = [];
    this.length = 0;
    this.options = {
      balance: true,
      ...options,
    };
    this.pushArray(set || []);
  }

  pushArray(set) {
    set.forEach(item => this.__push(item));
  }

  push(item, options) {
    const heap = new LeonardoHeap();
    heap.trees = this.trees;
    heap.length = this.length;
    heap.options = { ...this.options, ...options };
    heap.__push(item);
    return heap;
  }

  pop(options) {
    const heap = new LeonardoHeap();
    heap.trees = this.trees;
    heap.length = this.length;
    heap.options = { ...this.options, ...options };
    const item = heap.__pop();
    return [heap, item];
  }

  balance() {
    const heap = new LeonardoHeap();
    heap.trees = this.trees;
    heap.length = this.length;
    heap.options = this.options;
    heap.__rebalance();
    return heap;
  }

  __push(item) {
    this.__pushStructural(item);
    this.length += 1;
    if (this.options.balance == true) {
      this.__rebalance();
    }
  }

  __pop() {
    const item = this.__popStructural();
    this.length -= 1;
    if (this.options.balance == true) {
      this.__rebalance();
    }
    return item;
  }

  __rebalance() {
    for (
      let start = Math.max(0, this.trees.length - 2);
      start < this.trees.length;
      start++
    ) {
      let currentIndex = start;
      let current = this.trees[currentIndex];

      for (let nextIndex = start - 1; nextIndex >= 0; nextIndex--) {
        const nextTree = this.trees[nextIndex];
        if (
          nextTree.root > current.root &&
          (current.left.isEmpty || nextTree.root > current.left.root) &&
          (current.right.isEmpty || nextTree.root > current.right.root)
        ) {
          current.swapRoot(nextTree);
          currentIndex = nextIndex;
          current = nextTree;
        } else {
          break;
        }
      }
      current.rebalance();
    }
  }

  __pushStructural(item) {
    const { trees } = this;
    if (trees.length < 2) {
      trees.push(new Tree(item));
    } else {
      const li1 = leonardoIndex(trees[trees.length - 1].length);
      const li2 = leonardoIndex(trees[trees.length - 2].length);
      if (li1 + 1 == li2 || (li1 == li2) == 1) {
        const right = trees.pop();
        const left = trees.pop();
        trees.push(new Tree(item, left, right));
      } else {
        trees.push(new Tree(item));
      }
    }
  }

  __popStructural() {
    const { trees } = this;
    const last = trees.pop();
    if (last.length > 1) {
      this.trees = [...trees, last.left, last.right];
    }
    return last.root;
  }

  toSet() {
    return this.trees.reduce((els, tree) => {
      return [...els, ...tree.walk()];
    }, []);
  }
}

class Tree {
  constructor(root, left, right) {
    this.root = root;
    this.left = left || new EmptyTree();
    this.right = right || new EmptyTree();
    this.length = 1 + this.left.length + this.right.length;
    this.isEmpty = false;
  }

  swapRoot(other) {
    const root = this.root;
    this.root = other.root;
    other.root = root;
  }

  rebalance() {
    if (this.left.root > this.root && this.left.root > this.right.root) {
      this.swapRoot(this.left);
      this.left.rebalance();
    } else if (this.right.root > this.root) {
      this.swapRoot(this.right);
      this.right.rebalance();
    }
  }

  toData() {
    return {
      name: this.root,
      children: [this.right.toData(), this.left.toData()].filter(
        c => c != null
      ),
    };
  }

  walk() {
    return [...this.left.walk(), this.root, ...this.right.walk()];
  }
}

class EmptyTree {
  constructor() {
    this.length = 0;
    this.walk = () => [];
    this.toData = () => null;
    this.isEmpty = true;
  }
}
