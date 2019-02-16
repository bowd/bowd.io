import { leonardoNumbersTill } from './numbers';

const leonardoIndexMap = {1: 1}
let leonardoNumbers = [1, 1]

const leonardoIndex = (number) => {
  if (leonardoIndexMap[number] == undefined) {
    while (leonardoNumbers[leonardoNumbers.length-1] < number) {
      let next = leonardoNumbers[leonardoNumbers.length-1] + leonardoNumbers[leonardoNumbers.length-2] + 1;
      leonardoNumbers.push(next)
      leonardoIndexMap[next] = leonardoNumbers.length - 1;
    }
  }
  console.log(leonardoIndexMap);
  console.log(leonardoNumbers)

  return leonardoIndexMap[number]
}

export class LeonardoHeap {
  constructor(set, options) {
    this.trees = []
    this.options = {
      onlyStructural: false,
      ...options
    }
    this.pushArray(set || [])
  }

  pushArray(set) {
    set.forEach((item) => this.__push(item))
  }

  push(item) {
    const heap = new LeonardoHeap()
    heap.trees = this.trees
    heap.options = this.options
    heap.__push(item);
    return heap;
  }

  pop(item) {
    const heap = new LeonardoHeap()
    heap.trees = this.trees
    heap.options = this.options
    heap.__pop(item);
    return heap;

  }

  __push(item) {
    this.__pushStructural(item)
    if (this.options.onlyStructural == false) {
      this.__rebalance()
    }
  }

  __pop(item) {
    this.__popStructural(item)
    if (this.options.onlyStructural == false) {
      this.__rebalance()
    }
  }

  __rebalance() {}

  __pushStructural(item) {
    const { trees } = this;
    if (trees.length < 2) {
      trees.push(new Tree(item))
    } else {
      const li1 = leonardoIndex(trees[trees.length-1].length)
      const li2 = leonardoIndex(trees[trees.length-2].length)
      if (li1 + 1 == li2 || (li1 == li2 == 1)) {
        const tree1 = trees.pop()
        const tree2 = trees.pop()
        trees.push(new Tree(item, tree1, tree2))
      } else {
        trees.push(new Tree(item))
      }
    }
  }

  __popStructural(item) {
    const { trees } = this;
    if (trees[trees.length-1].length == 1) {
      trees.pop()
    } else {
      const last = trees.pop()
      this.trees = [...trees, last.right, last.left]
    }
  }

  toSet() {
    return this.trees.reduce((els, tree) => {
      return [...els, tree.walk() ]
    }, [])
  }
}

class Tree {
  constructor(root, left, right) {
    this.root = root
    this.left = left || new EmptyTree();
    this.right = right || new EmptyTree();
    this.length = 1 + this.left.length + this.right.length;
  }

  toData() {
    return {
      name: this.root,
      children: [this.left.toData(), this.right.toData()].filter(c => c != null)
    }
  }

  walk() {
    return [
      this.root,
      ...this.left.walk(),
      ...this.right.walk(),
    ]
  }
}

class EmptyTree {
  constructor() {
    this.length = 0
    this.walk = () => ([])
    this.toData = () => null
  }
}
