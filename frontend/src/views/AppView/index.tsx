import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";


// Local Imports
import Onboard from "../../components/Main/Onboard/index";
import Messages from "../../components/Main/Messages/index";
import MsgInput from "../../components/Main/MsgInput/index";
import ChatTopBar from "../../components/Main/ChatTopBar";
import MainTopBar from "../../components/Main/TopBar/index";
import SideTopBar from "../../components/Side/TopBar/index";
import BottomBar from "../../components/Side/BottomBar/index";
import Search from "../../components/Side/Search/index";
import Groups from "../../components/Side/Groups/index";
import GroupsDiscovery from "../../components/Side/GroupsDiscovery/GroupsDiscovery";
import GroupInfo from "../../components/Side/GroupInfo/index";
import Member from "../../components/Side/Members/Member";
import Members from "../../components/Side/Members/index";
import EditProfile from "../../components/Shared/EditProfile/index";
import styles from "./styles.module.scss";
import Modal from "../../components/Shared/Modal/index";
import ForrestModal from "../../components/Shared/Modal/ForrestModal";

type GroupData = {
  _id: string;
  title: string;
  description: string;
  owner: string;
  isPrivate: boolean,
  openGroupClick: () => void;
  leaveGroupClick: () => void;
};

type SnackData = {
  open: boolean;
  message: string | null;
  severity: "success" | "error" | undefined;
};

interface IRootState {
  auth: {
    isLogged: boolean;
    id: string | null;
    username: string | null;
    image: string | null;
    token: string | null;
  };
  app: {
    inChannel: boolean;
    currentGroup: GroupData;
    allGroups: GroupData[];
    joinedGroups: GroupData[];
    messages: [];
    members: [];
    groups: [];
    modal: null | "bug" | "edit" | "create" | "forrest";
    groupModal: null | "group";
    forrest: number;
  };
}

const AppView: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: IRootState) => state.auth);
  const {
    inChannel,
    currentGroup,
    allGroups,
    joinedGroups,
    messages,
    members,
    groups,
    modal,
    groupModal,
    forrest,
  } = useSelector((state: IRootState) => state.app);

  const [mobile, setMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<SnackData>({
    open: false,
    severity: undefined,
    message: null,
  });
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [isGroupDiscovery, setGroupDiscovery] = useState(false);


  axios.interceptors.request.use(function (config) {
    const { token } = userData;

    config.headers.Authorization =  `Bearer ${token}`;

    return config;
  });

  useEffect(() => {
    const socket = socketIOClient(
      process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
        process.env.REACT_APP_SOCKET_URL!,
      { transports: ["websocket"] }
    );
    socket.emit("new user", userData.id);
    socket.on("fetch messages", (id: string) => fetchMessages(id));
    socket.on("fetch all groups", fetchAllGroups);
    socket.on("fetch joined groups", fetchJoinedGroups);

    // socket.on('fetch forrest', (uid: string) => fetchForrest(uid));
    setSocket(socket);
    fetchAllGroups();
    fetchJoinedGroups();
  }, []);

  // whenever switch to new group
  useEffect(() => {
    if (!socket) return;
    socket.emit("join group", userData.id, currentGroup?._id);

    fetchMessages();
  }, [currentGroup]);

  // Handlers
  const logoutHandler = () => {
    socket?.disconnect();
    localStorage.removeItem("userData");
    dispatch({ type: "LOGOUT" });
  };

  // TODO : use uid and not userData.id
  const joinGroupHandler = async (gid: string, uid: string) => {
    const { token } = userData;

    const bodyParameters = {
      uid : userData.id
    }

    // axios
    let response;
    try {
      response = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/groups/invite/${gid}`,
        bodyParameters,
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][JOIN]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not join group.`,
      });
      return;
    }
    if (!response) return;

    // dispatch and socket no need cause fetchGroup already included
    fetchAllGroups();
    fetchJoinedGroups();
    setSnack({ open: true, severity: "success", message: `group joined.` });
  };

  // TODO : use uid and not userData.id
  const leaveGroupHandler = async (gid: string, uid: string) => {
    // axios
    let response;
    try {
      response = await axios.delete(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/groups/${gid}/members/${userData.id}`
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][LEAVE]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not leave group.`,
      });
      return;
    }
    if (!response) return;

    // dispatch and socket no need cause fetchGroup already included
    fetchAllGroups();
    fetchJoinedGroups();
    setSnack({ open: true, severity: "success", message: `group left.` });
  };

  const groupHandler = (gid: string) => {
    setLoading(true);
    const current = groups.filter((item: GroupData) => item._id === gid);
    if (current.length > 0) {
      dispatch({ type: "CHANGE GROUP", payload: { currentGroup: current[0] } });
    }
  };

  // Async Requests
  const createGroup = async (title: string, description: string) => {
    const { token, id } = userData;
    if (!token) {
      setSnack({
        open: true,
        severity: "error",
        message: `Guests are not allowed to create groups, please register.`,
      });
      return;
    }

    let verifiedToken;
    try {
      verifiedToken = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/users/verify`,
        {
          id,
          token,
        }
      );
    } catch (error) {
      console.log("[ERROR][AUTH][VERIFY]: ", error);
      return;
    }
    if (!verifiedToken.data.access) {
      localStorage.removeItem("userData");
      return;
    }

    let response;
    try {
      response = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/groups`,
        {
          title,
          description: description ? description : "No description.",
          uid: id,
        }
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][CREATE]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not create group.`,
      });
      return;
    }
    if (!response) return;
    dispatch({ type: "MODAL", payload: { modal: null } });
    fetchAllGroups();
    fetchJoinedGroups();
    socket?.emit("create group", userData.id, title);
    setSnack({
      open: true,
      severity: "success",
      message: `${title} channel created.`,
    });
  };

  const editProfileRequest = async (username: string, image: string) => {
    const { token, id } = userData;
    if (!token) {
      setSnack({
        open: true,
        severity: "error",
        message: `Guests are not allowed to edit profile, please register.`,
      });
      return;
    }

    // TODO : why do we need to verify token, remove this
    let verifiedToken;
    try {
      verifiedToken = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/users/verify`,
        {
          id,
          token,
        }
      );
    } catch (error) {
      console.log("[ERROR][AUTH][VERIFY]: ", error);
      return;
    }
    if (!verifiedToken.data.access) {
      localStorage.removeItem("userData");
      return;
    }

    let response;
    try {
      response = await axios.put(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/users/edit`,
        {
          id,
          username,
          image,
        }
      );
    } catch (error) {
      console.log("[ERROR][USERS][EDIT]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not edit profile.`,
      });
      return;
    }
    if (!response) return;
    setSnack({ open: true, severity: "success", message: `Profile updated.` });
    dispatch({ type: "MODAL", payload: { modal: null } });
    dispatch({
      type: "EDIT",
      payload: {
        username: response.data.user.username,
        image: response.data.user.image,
      },
    });
  };

  const editGroupRequest = async (title: string, description : string, image: string, isPrivate : boolean) => {
    const { token } = userData;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const bodyParameters = {
      gid: currentGroup?._id,
      title,
      description,
      isPrivate
    }

    let response;
    try {
      response = await axios.put(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/groups/edit`,
        bodyParameters,
        config
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][EDIT]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not edit group's info.`,
      });
      return;
    }

    if (!response) return;
  
    setSnack({ open: true, severity: "success", message: `Refresh to see changes` });
    dispatch({ type: "GROUP MODAL", payload: { groupModal: null } });


    // TODO : refresh group with new title, description -> has to include title in GroupAction, has to fetch from useSelector 
    // 

    // dispatch({
    //   type: "GROUP EDIT",
    //   payload: {
    //     currentGroup : currentGroup
    //   },
    // });

  }


  const createMessage = async (text: string, date: string) => {
    if (!socket) return;

    // post the message by this user, into the current group, then instruct socket to reload messages
    let response;
    try {
      response = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/messages`,
        {
          gid: currentGroup?._id,
          text,
          username: userData.username,
          image: userData.image,
          uid: userData.id,
          date,
        }
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][CREATE]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not send message.`,
      });
      return;
    }
    if (!response) return;
    socket?.emit("message", userData.id, currentGroup?._id);
    fetchMessages();
  };

  const fetchAllGroups = async () => {
    let response;
    try {
      response = await axios.get(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/groups`
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][FETCH]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not fetch groups.`,
      });
      return;
    }

    if (!response) return;
    dispatch({
      type: "FETCH ALL GROUPS",
      payload: {
        allGroups: response.data.groups,
        groups: response.data.groups,
      },
    });
  };

  const fetchJoinedGroups = async () => {
    const { id } = userData;

    let response;
    try {
      response = await axios.get(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/users/groups/${id}`
      );
    } catch (error) {
      console.log("[ERROR][GROUPS][FETCH]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not fetch joined groups.`,
      });
      return;
    }

    if (!response) return;
    dispatch({
      type: "FETCH JOINED GROUPS",
      payload: {
        joinedGroups: response.data.groups,
      },
    });
  };

  const fetchMessages = async (gid = currentGroup?._id) => {
    if (!gid) return;
    let response;
    try {
      response = await axios.get(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/groups/${gid}`
      );
    } catch (error) {
      console.log("[ERROR][MESSAGES][FETCH]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not fetch messages and members.`,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    if (response.data.error) {
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not fetch messages and members.`,
      });
      return;
    }
    dispatch({
      type: "FETCH MESSAGES",
      payload: {
        messages: response.data.messages,
        members: response.data.members,
      },
    });
  };

  const deleteMessage = async (mid: string) => {
    if (!mid) return;
    let response;
    try {
      response = await axios.delete(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/messages/${mid}`
      );
    } catch (error) {
      console.log("[ERROR][MESSAGES][DELETE]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not delete messages.`,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    if (response.data.error) {
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not delete messages.`,
      });
      return;
    }
    dispatch({
      type: "DELETE MESSAGES",
      payload: {
        messages: response.data.messages,
        members: response.data.members,
      },
    });
    fetchMessages();
  };

  const reportBug = async (title: string, description: string) => {
    const { id } = userData;

    let response;
    try {
      response = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/bugs`,
        {
          id,
          title,
          description: description ? description : "No description.",
        }
      );
    } catch (error) {
      console.log("[ERROR][BUGS][CREATE]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not report bug.`,
      });
      return;
    }
    if (!response) return;
    dispatch({ type: "MODAL", payload: { modal: null } });
    setSnack({
      open: true,
      severity: "success",
      message: `Bug reported, thank you!`,
    });
  };

  // Render
  let sideContent;
  let mainContent;

  if (inChannel) {

    sideContent = (
      <div className={styles.sideContent}>
        <GroupInfo
          currentGroup={currentGroup}
          groupEditClick={() => {
            dispatch({ type: "GROUP MODAL", payload: { groupModal: "group" } });
            setMobile(false);
          }}
          groupEditSubmit={editGroupRequest}
          groupModal={groupModal}
        />

        <Members
          owner={currentGroup.owner}
          members={members}
          loading={loading}
        />
      </div>
    );
    // in chat mode
    mainContent = (
      <div className={styles.main}>
        <ChatTopBar
          title={currentGroup?.title}

          menuClick={() => setMobile(true)}
        />
        <Messages
          messages={messages}
          onClick={() => setMobile(false)}
          onDelete={deleteMessage}
          loading={loading}
        />
        <MsgInput sendClick={createMessage} onClick={() => setMobile(false)} />
      </div>
    );
  } else {
    sideContent = (
      <div className={styles.sideContent}>
        <Groups
          groups={joinedGroups}
          openGroupClick={(id) => groupHandler(id)}
          leaveGroupClick={(id) => leaveGroupHandler(id, id)}
        />
      </div>
    );
    // group list mode 
    if (isGroupDiscovery) {
      mainContent = (
        <div className={styles.main}>
          <div>
            <MainTopBar title="All Groups" menuClick={() => setMobile(false)} />
            <Search
              groups={groups}
              update={(filteredGroups) =>
                dispatch({
                  type: "SEARCH",
                  payload: { allGroups: filteredGroups },
                })
              }
            />
            <GroupsDiscovery
              groups={allGroups}
              openGroupClick={(id) => joinGroupHandler(id, id)}
              leaveGroupClick={() => {}}
            />
          </div>
        </div>
      );
    } else {
      // default mode 
      mainContent = (
        <div className={styles.main}>
          <MainTopBar title="" menuClick={() => setMobile(true)} />
          <Onboard onClick={() => setMobile(false)} />
        </div>
      );
    }
  }

  // fetch forrest
  const fetchForrest = async (uid: string) => {
    if (!uid) return;
    let response;
    try {
      response = await axios.get(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/users/forrest/${uid}`
      );
    } catch (error) {
      console.log("[ERROR][FORREST]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occured: Could not fetch forrest.`,
      });
      return;
    }
    setLoading(false);
    dispatch({
      type: "FETCH FORREST",
      payload: { forrest: response.data.forrest },
    });
    return response.data.forrest;
  };

  // save forrest
  const incrementForrest = async (uid: string, time: Number) => {
    let response;

    try {
      response = await axios.put(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/users/forrest`,
        {
          id: uid,
          forrest: time,
        }
      );
    } catch (error) {
      console.log("[ERROR][FORREST]: ", error);
      return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftside}>
        aaa
      </div>
      <div className={mobile ? styles.mobile : styles.side}>
        <SideTopBar
          inChannel={inChannel}
          arrowClick={() => {
            dispatch({ type: "EXIT" });
          }}
          plusClick={() => {
            dispatch({ type: "MODAL", payload: { modal: "create" } });
            setMobile(false);
          }}
          groupDiscoveryClick={() => {
            setGroupDiscovery(!isGroupDiscovery);
          }}
        />
        {sideContent}
        <BottomBar
          exitClick={logoutHandler}
          profileClick={() => {
            dispatch({ type: "MODAL", payload: { modal: "edit" } });
            setMobile(false);
          }}
          bugClick={() => {
            dispatch({ type: "MODAL", payload: { modal: "bug" } });
            setMobile(false);
          }}
          forrestClick={() => {
            dispatch({ type: "MODAL", payload: { modal: "forrest" } });
            setMobile(false);
          }}
        />
      </div>
      {mainContent}
      {modal === "create" && (
        <Modal onCreate={createGroup} title="New Channel" />
      )}
      {modal === "edit" && (
        <EditProfile onEdit={editProfileRequest} fetchForrest={fetchForrest} />
      )}
      {modal === "bug" && <Modal onCreate={reportBug} title="Bug Report" />}
      {modal === "forrest" && (
        <ForrestModal incrementForrest={incrementForrest} title="Focus" />
      )}
      <Snackbar
        open={snack.open}
        onClose={() =>
          setSnack({ open: false, severity: snack.severity, message: null })
        }
        autoHideDuration={5000}
      >
        <MuiAlert
          variant="filled"
          onClose={() =>
            setSnack({ open: false, severity: snack.severity, message: null })
          }
          severity={snack.severity}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AppView;
