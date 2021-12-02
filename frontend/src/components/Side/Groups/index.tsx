import React, { useState } from "react";

// context menu
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  useMenuState,
  ControlledMenu,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

// Local Imports
import styles from "./styles.module.scss";
import { boolean, string } from "yup/lib/locale";

type PropsGroup = {
  title: string;
  key?: string;
  tag?: string;
  _id: string;
  openGroupClick: (id: string) => void;
  leaveGroupClick: (id: string, uid: string) => void;
};

const Group: React.FC<PropsGroup> = (props) => {
  const { toggleMenu, ...menuProps } = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  return (
    <div
      key={props._id}
      onContextMenu={(e) => {
        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        toggleMenu(true);
      }}
    >
      <div
        className={styles.group}
        onClick={() => props.openGroupClick(props._id)}
      >
        <span className={styles.tag}>{props.tag}</span>
        <p className={styles.title}>{props.title}</p>
      </div>
      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <MenuItem onClick={() => props.leaveGroupClick(props._id, props._id)}>Leave Group</MenuItem>
        <MenuItem>aaa</MenuItem>

      </ControlledMenu>
    </div>
  );
};

type PropsGroups = {
  groups: PropsGroup[];
  openGroupClick: (id: string) => void;
  leaveGroupClick: (id: string, uid: string) => void;
};

const Groups: React.FC<PropsGroups> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {props.groups.map((group) => (
          <Group
            _id={group._id}
            key={group._id}
            title={group.title}
            tag={`${group.title[0]}${group.title[1]}`.toUpperCase()}
            openGroupClick={(id) => props.openGroupClick(id)}
            leaveGroupClick={(id) => props.leaveGroupClick(id, id)}
            
          />
        ))}
      </div>
    </div>
  );
};

export default Groups;
