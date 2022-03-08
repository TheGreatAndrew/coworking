import {Component} from 'react';
import styles from "./styles.module.scss";

export default class TextForm extends Component {
  onSubmit = event => {
    const form = event.target;
    event.preventDefault();
    this.props.onSubmit(form.input.value);
    form.reset();
  };

  render() {
    return (
      <div className={styles.TextForm}>
        <form onSubmit={this.onSubmit} ref={node => (this.form = node)}>
        <input
          type="text"
          className={styles.TextFormInput}
          name="input"
          placeholder={this.props.placeholder}
        />
      </form>
      </div>
    );
  }
}
