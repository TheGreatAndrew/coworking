import React from "react";
import { InputBase, IconButton } from "@material-ui/core";
import Button from '@material-ui/core/Button';

// Local Imports
import styles from "./styles.module.scss";

type Props = {
  title?: String;
  menuClick: () => void;
};

const addUserToGroup = async () => {

  // put middleware, and change joinGroupHandler() -> test if joinGroup works 
  // store form input -> useState() 


  // get token for Bearer 
  // get gid
  // get uid from form 


  // send axios 



 
}

const TopBar: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>

      <div className={styles.wrapper}>

        <div className={styles.topbar}>
          <h2 className={styles.title}>{props.title}</h2>

          <div className={styles.entireinput}>
            <div className={styles.forminput}>
              <InputBase
                className={styles.textinput}
                placeholder="Type the user id"
              />
            </div>
            <Button className={styles.addButton} onClick={addUserToGroup}>Add</Button>

          </div>

        </div>


      </div>

    </div>
  );
};

export default TopBar;
