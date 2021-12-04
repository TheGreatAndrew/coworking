import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EditGroup from '../../Shared/EditGroup/EditGroup';

// Local Imports
import styles from "./styles.module.scss";

type Props = {
  currentGroup: {
    title: string;
    description: string;
  } | null;
  groupModal : null | 'group';
  groupEditClick : () => void;
};

const GroupInfo: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
      {props.groupModal === "group" && (
        <EditGroup onEdit={()=>{}}/>
        )}
        <Tooltip title="Edit Group" placement="bottom">
          <IconButton className={styles.arrowButton} onClick={props.groupEditClick}>
            <EditIcon className={styles.arrow} />
          </IconButton>
        </Tooltip>

        <p className={styles.title}>{props.currentGroup?.title}</p>
        <p className={styles.description}>{props.currentGroup?.description}</p>
      </div>
    </div>
  );
};

export default GroupInfo;
