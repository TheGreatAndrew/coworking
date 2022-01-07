import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EditGroup from "../../Shared/EditGroup/EditGroup";

// Local Imports
import styles from "./styles.module.scss";

type Props = {
  currentGroup: {
    title: string;
    description: string;
    isPrivate: boolean,
  } | null;
  groupModal: null | "group";
  groupEditClick: () => void;
  groupEditSubmit: (title: string, description : string, image: string, isPrivate : boolean) => void;
  
};

const GroupInfo: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {props.groupModal === "group" && props.currentGroup !== null && (
          <EditGroup currentGroup={props.currentGroup} onEditSubmit={props.groupEditSubmit} />
        )}
        <Tooltip title="Edit Group" placement="bottom">
          <IconButton
            className={styles.arrowButton}
            onClick={props.groupEditClick}
          >
            <EditIcon className={styles.arrow} />
          </IconButton>
        </Tooltip>

        <p className={styles.title}>group title : </p>
        <p className={styles.description}>{props.currentGroup?.title}</p>

        <p className={styles.title}>description (how this group studies) : </p>
        <p className={styles.description}>{props.currentGroup?.description}</p>

        <p className={styles.title}>meeting link : </p>
        <p className={styles.description}>url</p>

      </div>
    </div>
  );
};

export default GroupInfo;
