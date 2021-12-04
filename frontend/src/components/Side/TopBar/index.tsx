import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ViewListIcon from '@material-ui/icons/ViewList';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

// Local Imports
import styles from './styles.module.scss';

type Props = {
  arrowClick: () => void;
  plusClick: () => void;
  groupDiscoveryClick : () => void;
  inChannel: boolean;
};

const TopBar: React.FC<Props> = props => {
  return (
    <div className={styles.container}>
      {props.inChannel ? (
        <div className={styles.wrapperInChannel}>
          <Tooltip title="Back to groups list" placement="bottom">
            <IconButton className={styles.arrowButton} onClick={props.arrowClick}>
              <ArrowBackIosIcon className={styles.arrow} />
            </IconButton>
          </Tooltip>
          <h2 className={styles.title}>Go back</h2>
        </div>
      ) : (
        <div className={styles.wrapperOutChannel}>
          <h2 className={styles.title}>Joined Groups</h2>
          <div>
          <Tooltip title="Search Groups" placement="bottom">
            <IconButton className={styles.addButton} onClick={props.groupDiscoveryClick}>
              <ViewListIcon className={styles.add} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create Group" placement="bottom">
            <IconButton className={styles.addButton} onClick={props.plusClick}>
              <AddIcon className={styles.add} />
            </IconButton>
          </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
