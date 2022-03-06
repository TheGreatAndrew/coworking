import React, {Component} from 'react';
import "./index.css";

export default class TextForm extends Component {
  onSubmit = event => {
    const form = event.target;
    event.preventDefault();
    this.props.onSubmit(form.input.value);
    form.reset();
  };

  render() {
    return (
      <div className="TextForm">
        <form onSubmit={this.onSubmit} ref={node => (this.form = node)}>
        <input
          type="text"
          className="TextForm__input"
          name="input"
          placeholder={this.props.placeholder}
        />
      </form>
      </div>
    );
  }
}
