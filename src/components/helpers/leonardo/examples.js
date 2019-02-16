import React from 'react';
import Tree from "react-tree-graph";
import 'react-tree-graph/dist/style.css'
import range from "lodash/range";
import { leonardoSets, leonardoNumbersTill } from './numbers';
import { LeonardoHeap } from './heap';

class Heap extends React.Component {
  render() {
    const { heap } = this.props;
    console.log(heap.trees)

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
              transform: "rotate(90)"
            }}
            textProps={{
              width: "20px"
            }}
          />
          ))}
      </div>
    )
  }
}

const EXAMPLES_ADD = {
  "example-1": {
    set: [29, 34, 56, 67, 10, 11, 13, 14, 17, 44, 12, 32, 89],
    nextElement: 99
  },
  "example-2": {
    set: [29, 34, 56, 23, 33],
    nextElement: 99
  },
  "example-3": {
    set: [29, 34, 56, 23, 33, 44],
    nextElement: 99
  }
}

export class HeapPushExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      heap: new LeonardoHeap(EXAMPLES_ADD[props.id].set),
      nextElement: EXAMPLES_ADD[this.props.id].nextElement,
      added: false,
    }
  }

  render() {
    const { heap, nextElement, added } = this.state;
    return (
      <div className="leonardo-widget">
        <div className="set">
          { added == false ?
            <button onClick={() => {
              this.setState({
                heap: this.state.heap.push(this.state.nextElement),
                added: true
              })
            }}>Push {nextElement}</button>
          : <button onClick={() => {
              this.setState({
                heap: this.state.heap.pop(),
                added: false
              })
            }}>Reset</button>
          }

        </div>
        <Heap heap={heap} />
      </div>
    )
  }

}

const varHeap = (n) => range(1, n+1).map((i) => "x"+i)

const EXAMPLES = {
  'example-1': varHeap(6),
  'example-2': varHeap(13),
}

export const HeapExample = ({id}) => (
  <div className="leonardo-widget">
    <Heap heap={new LeonardoHeap(EXAMPLES[id])} />
  </div>
)


