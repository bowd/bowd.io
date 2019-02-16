import React from 'react';
import range from 'lodash/range'
import './leonardo.css';

class Vizualizer extends React.Component {
  constructor() {
    super();
    this.state = {
      n: 500,
      showing: 'number'
    }
  }

  renderToggle() {
    return (
      <div className="controls">
        <div className="item-toggle">
          Showing:{' '}
          Leonardo{' '}
          <span data-selected={this.state.showing == "number"} onClick={() => this.setState({showing: 'number'})}>
            numbers
          </span>
          {' '}/{' '}
          <span data-selected={this.state.showing == "indexes"} onClick={() => this.setState({showing: 'indexes'})}>
            indices
          </span>
        </div>
        <div className="n">
          n =
          <input type="number" value={this.state.n} onChange={(evt) => this.setState({n: Math.min(parseInt(evt.target.value), 1000)})}/>
        </div>
      </div>
    )
  }

  render() {
    const { n } = this.state;

    const sets = leonardoSets(n);
    const leonardoNumbers = leonardoNumbersTill(n);
    const isLeonardo = Object.assign({}, ...Array.from(leonardoNumbers, (k) => ({[k]: true}) ));
    const leonardoIndex = leonardoNumbers.reduce((li, num, index) => {
      li[num] = index;
      return li
    }, {})

    return (
      <div className="leonardo-widget">
        {this.renderToggle()}
        <div className="scroll-container">
          {range(1, n+1).map((i) => (
            <div key={i} className="row">
              <span style={{background: isLeonardo[i] ? color(i == 1 ? 1 : leonardoIndex[i]) : 'inherit'}} className="index"> {i} </span>
              {sets[i].map((li) => (
                <span className="item" style={{background: color(li)}} data-color={color(li)} key={`${i}-${li}`}>
                  {this.state.showing == "number" ? leonardoNumbers[li] : li}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const color = (n) => {
  const color = Math.floor((Math.abs(Math.sin(15 + n) * 16777215)) % 16777215).toString(16);
  const padded = ("000000" + color).slice(-6)
  return "#" + padded +"aa";
}


const leonardoSets = (n) => {
  const sets = {
    1: [1],
    2: [0,1],
  }
  const leonardoNumbers = leonardoNumbersTill(n);
  const leonardoIndex = leonardoNumbers.reduce((indexMap, ln, index) => {
    indexMap[ln] = index;
    return indexMap;
  }, {})

  for (let i = 3; i <= n; i++) {
    if (!!leonardoIndex[i]) {
      sets[i] =  [leonardoIndex[i]]
    } else {
      let delta, index;
      for (index = leonardoNumbers.length - 1; index >= 0; index--) {
        delta = leonardoNumbers[index]
        if (i - delta >= 0 && occurancesInSet(sets[i-delta], index) == 0) {
          break;
        }
      }
      if (index == undefined) {
        console.log("Could not find any delta :(, this should never happen.")
      }
      sets[i] = [ ...sets[i-delta], index ].sort((a,b) => (a-b))
    }
  }
  return sets;
}

const occurancesInSet = (set, index) => {
  return set.indexOf(index) == -1 ? 0 : 1;
}

const leonardoNumbersTill = (n) => {
  const leonardoNumbers = [1, 1]
  while (leonardoNumbers[leonardoNumbers.length-1] < n) {
    leonardoNumbers.push(
      leonardoNumbers[leonardoNumbers.length-1] +
      leonardoNumbers[leonardoNumbers.length-2] +
      1
    )
  }
  return leonardoNumbers;
}



export default {
  namespace: "leonardo",
  components: {
    vizualizer: Vizualizer
  }
}

