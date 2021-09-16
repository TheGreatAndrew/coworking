import React from 'react';

// Local Imports
import logo from '../../../assets/gc-logo-symbol-nobg.png';
import styles from './styles.module.scss';

type Props = {
  onClick: () => void;
};

const Onboard: React.FC<Props> = props => {
  return (
    <div className={styles.container} onClick={props.onClick}>
      <div className={styles.wrapper}>
        <img className={styles.logo} alt="logo" src={logo} />
        <h1 className={styles.title}>Hello Students!</h1>
        <p className={styles.description}>
          This project is an instant messaging app
          that offer the students the focus and the productivity they need by working together with other people.
        </p>
        <ul className={styles.list}>
          <li>⭐️ Click on any channel you want to join.</li>
          <li>⭐️ Create a channel with the "+" icon.</li>
          <li>⭐️ Send messages with the text input.</li>
          <li>⭐️ Browse channels with the search input.</li>
          <li>⭐️ Report a bug with the "bug" icon.</li>
          <li>⭐️ Click on your profile to edit.</li>
          <li>⭐️ Use the "exit" icon to logout.</li>
        </ul>
      </div>
    </div>
  );
};

export default Onboard;
