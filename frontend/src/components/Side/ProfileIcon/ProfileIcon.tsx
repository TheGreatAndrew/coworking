import React from "react";
import { Offline, Online } from "react-detect-offline";

// Local Imports
import styles from "./styles.module.scss";

type Props = {
  image: string;
  profileClick: () => void;
};

// TODO : finish online/ offline mode
const ProfleIcon: React.FC<Props> = (props) => {
  return (
    <div>
      <Online>
        <img
          className={styles.image}
          alt="User"
          src={props.image}
          onClick={props.profileClick}
        />
      </Online>
      <Offline>(Offline)</Offline>
    </div>
  );
};

export default ProfleIcon;
