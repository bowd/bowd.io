import React from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';
import range from 'lodash/range';
import { leonardoSets, leonardoNumbersTill } from './numbers';
import { LeonardoHeap } from './heap';

class Heap extends React.Component {
  render() {
    const { heap } = this.props;

    return (
      <div className="heap">
        {heap.trees.map(tree => (
          <Tree
            key={tree.toData().name}
            data={tree.toData()}
            height={250}
            width={300}
            animated={true}
            duration={200}
            nodeRadius={14}
            svgProps={{
              transform: 'rotate(90)',
            }}
            textProps={{
              width: '20px',
            }}
          />
        ))}
      </div>
    );
  }
}

const varHeap = n => range(1, n + 1).map(i => 'x' + i);
const EXAMPLES = {
  'show-1': {
    set: varHeap(6),
  },
  'show-2': {
    set: varHeap(13),
  },
  'push-1': {
    set: [29, 34, 56, 67, 10, 11, 13, 14, 17, 44, 12, 32, 89],
  },
  'push-2': {
    set: [29, 34, 56, 23, 33],
  },
  'push-3': {
    set: [29, 34, 56, 23, 33, 44],
  },
  'balance-1': {
    set: [29, 34, 56, 23, 33, 44],
    nextToPush: 11,
  },
  'balance-2': {
    set: [89, 34, 29, 37, 54, 23, 33, 11, 93, 24, 88, 65],
  },
};

export const HeapShowExample = ({ id }) => (
  <HeapExample example={EXAMPLES[id]} />
);

export const HeapPushExample = ({ id }) => (
  <HeapExample example={EXAMPLES[id]} canPush={true} canPop={true} />
);

export const HeapBalanceExample = ({ id }) => (
  <HeapExample
    example={EXAMPLES[id]}
    canPush={true}
    canPop={true}
    initialBalance={true}
    balanceOnPush={false}
    balanceOnPush={false}
    canBalance={true}
  />
);

export class HeapExample extends React.Component {
  static defaultProps = {
    canPush: false,
    canPop: false,
    canBalance: false,
    balanceOnPush: false,
    balanceOnPop: false,
    initialBalance: false,
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
  }

  initialState(props) {
    const heap = new LeonardoHeap(props.example.set, {
      balance: props.initialBalance,
    });
    return {
      heap: heap,
      nextToPush: props.example.nextToPush || this.getNext(heap),
    };
  }

  pop = () => {
    const [newHeap, lastEl] = this.state.heap.pop({
      balance: this.props.balanceOnPop,
    });
    this.setState({
      heap: newHeap,
      nextToPush: lastEl,
    });
  };

  push = () => {
    const newHeap = this.state.heap.push(this.state.nextToPush, {
      balance: this.props.balanceOnPush,
    });
    this.setState({
      heap: newHeap,
      nextToPush: this.getNext(this.state.heap),
    });
  };

  getNext(heap) {
    let next = null;
    const items = heap.toSet();
    while (items.indexOf(next) > -1 || next == null) {
      next = Math.floor(Math.random() * 100);
    }
    return next;
  }

  balance = () => {
    const newHeap = this.state.heap.balance();
    this.setState({
      heap: newHeap,
    });
  };

  reset = () => {
    this.setState(this.initialState(this.props));
  };

  render() {
    const { heap, nextElement, added } = this.state;
    return (
      <div className="leonardo-widget">
        <div className="set">
          {this.props.canPush ? (
            <button onClick={this.push} disabled={this.state.heap.length > 13}>
              Push ({this.state.nextToPush})
            </button>
          ) : null}
          {this.props.canPop ? (
            <button onClick={this.pop} disabled={this.state.heap.length == 0}>
              Pop
            </button>
          ) : null}
          {this.props.canBalance ? (
            <button onClick={this.balance}>Balance</button>
          ) : null}
          {this.props.canPush || this.props.canPop || this.props.canBalance ? (
            <button onClick={this.reset}>Reset</button>
          ) : null}
        </div>
        <Heap heap={heap} />
      </div>
    );
  }
}
