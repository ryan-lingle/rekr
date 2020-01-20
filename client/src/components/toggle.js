import React from "react";

export default class Toggle extends React.Component {
  state = {
    on: this.props.on
  }

  componentWillReceiveProps({ on }) {
    this.setState({ on });
  }

  onChange = ({ target: { checked }}) => {
    this.props.onChange(checked);
    this.setState({ on: checked })
  }

  render() {
    const { customeClass } = this.props;
    return(
      <label className={`switch ${customeClass}`}>
        <input type="checkbox" onChange={this.onChange} checked={this.state.on} />
        <span className="toggle round"></span>
      </label>
    )
  }
}
