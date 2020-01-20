import React from "react";
import { Tooltip } from ".";
import { toSats } from "../utils";

export default class Table extends React.Component {
  state = {
    sortBy: null,
    big: false,
    n: 0,
  }

  format = {
    integer: (val) => (toSats(val, false) || 0),
    date: (val) => {
      const date = new Date(val);
      return date.toDateString();
    },
    time: (val) => {
      const date = new Date(val);
      return date.toTimeString();
    },
    string: (val) => val
  }

  sort = (key) => {
    this.setState(prevState => {
      const n = key === prevState.sortBy ? prevState.n + 1 : 0;
      return {
        sortBy: key,
        big: n % 2 === 1,
        n
      }
    })
  }

  sortedData = () => {
    const { sortBy, big } = this.state;
    return big ?
      this.props.data.sort((a, b) => a[sortBy] < b[sortBy] ? 1 : -1)
      : this.props.data.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);
  }

  arrow = (key) => {
    if (key === this.state.sortBy) {
      return <i className={`arrow fa fa-arrow-${this.state.big ? 'up' : 'down'}`} />
    }
  }

  rows = () => {
    const data = this.state.sortBy ? this.sortedData() : this.props.data;
    return data.map((datum, i) => (
      <tr key={i} className="table-row">
        {Object.keys(this.props.schema).map((key, ii) => {
            const { children, format } = this.props.schema[key];
            if (children) return <td className={`table-cell ${format}-cell`} key={ii}>{children(datum)}</td>;
            return(
              <td key={ii} className={`table-cell ${format}-cell`}>
                {this.format[format](datum[key])}
              </td>
            );
          }
        )}
      </tr>
    ));
  }

  render() {
    return(
      <table>
        <thead>
          <tr>
            {Object.keys(this.props.schema).map((key, i) =>
              <th onClick={() => this.sort(key)} key={i}>
                <div className="table-title">
                  <Tooltip tooltip={`Sort by ${this.props.schema[key].title}`}>
                    <span>
                      {this.props.schema[key].title + " "}
                      {this.arrow(key)}
                    </span>
                  </Tooltip>
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {this.rows()}
        </tbody>
      </table>
    );
  }
}
