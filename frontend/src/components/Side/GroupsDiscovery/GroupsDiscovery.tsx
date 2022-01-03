import React, { useState, useEffect } from "react";

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
import CustomButton from "../../Shared/CustomButton";

type PropsGroup = {
  title: string;
  description: string;
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
      <div className={styles.group}>
        <span className={styles.tag}>{props.tag}</span>
        <p className={styles.title}>{props.title}</p>
        <span className={styles.tag}></span>
        <p className={styles.title}>
          {"[description : "}
          {props.description}
          {"]"}
        </p>
        <span className={styles.tag}></span>
        <CustomButton
          onClick={() => props.openGroupClick(props._id)}
          isPurple
          title="Join"
          small
        />
      </div>
      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <MenuItem onClick={() => props.leaveGroupClick(props._id, props._id)}>
          Leave Group
        </MenuItem>
      </ControlledMenu>
    </div>
  );
};

type PropsGroups = {
  groups: GroupData[];
  openGroupClick: (id: string) => void;
  leaveGroupClick: (id: string, uid: string) => void;
};

type GroupData = {
  _id: string;
  title: string;
  description: string;
  owner: string;
  isPrivate: boolean;
  openGroupClick: () => void;
  leaveGroupClick: () => void;
};

const GroupsDiscovery: React.FC<PropsGroups> = (props) => {
  const [allGroups, setAllGroups] = useState(props.groups);


  const filterOnlyPublicGroup = (allGroups: GroupData[]) => {
    allGroups = allGroups.filter((group) => group.isPrivate == false);
    return allGroups;
  };

  useEffect(() => { 
    setAllGroups(filterOnlyPublicGroup(allGroups))
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {allGroups.map((group) => (
          <Group
            _id={group._id}
            key={group._id}
            title={group.title}
            description={group.description}
            tag={`${group.title[0]}${group.title[1]}`.toUpperCase()}
            openGroupClick={(id) => props.openGroupClick(id)}
            leaveGroupClick={(id) => props.leaveGroupClick(id, id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupsDiscovery;
