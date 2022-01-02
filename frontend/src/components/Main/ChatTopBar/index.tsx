import React, {useState} from "react";
import { useSelector } from "react-redux";
import { InputBase, IconButton } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import axios from "axios";


// Local Imports
import styles from "./styles.module.scss";

type Props = {
  title?: String;
  menuClick: () => void;
};

type GroupData = {
  _id: string;
};


interface IRootState {
  auth: {
    id: string | null;
    username: string | null;
    token: string | null;
  };
  app: {
    currentGroup: GroupData;
  };
}

const TopBar: React.FC<Props> = (props) => {
  const userData = useSelector((state: IRootState) => state.auth);
  const {
    currentGroup
  } = useSelector((state: IRootState) => state.app);
  const [addUserValue, setAddUserValue] = useState('');


  // TODO snackbar 
  const addUserToGroup = async () => {  
    const { token } = userData;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const bodyParameters = {
      uid : addUserValue
    }

    console.log("test abc " + addUserValue)

    // axios
    let response;
    try {
      response = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/groups/invite/${currentGroup._id}`,
        bodyParameters,
        config
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][INVITE USERS]: ", error);
      return;
    }
    if (!response) return;

    

  }

  const addUserHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddUserValue(e.target.value);
  };

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
                onChange={e => addUserHandler(e)}
                value={addUserValue}
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
