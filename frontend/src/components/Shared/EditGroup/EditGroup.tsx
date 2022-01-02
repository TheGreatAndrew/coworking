import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  TextField,
  CircularProgress,
  FormGroupClassKey,
  Switch
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// Local Imports
import CustomButton from "../CustomButton/index";
import styles from "./styles.module.scss";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

type Props = {
  currentGroup: {
    title: string;
    description: string;
    isPrivate: boolean;
  };
  onEditSubmit: (title: string, description : string, image: string, isPrivate : boolean) => void;
};

interface IRootState {
  auth: {
    id: string;
    title: string;
  };
}

const EditGroup: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const { id, title } = useSelector((state: IRootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [newTitle, setTitle] = useState(props.currentGroup.title);
  const [titleError, setTitleError] = useState(false);
  const [titleHelper, setTitleHelper] = useState("");
  const [description, setDescription] = useState(
    props.currentGroup.description
  );
  const [isPrivate, setIsPrivate] = useState(props.currentGroup.isPrivate);

  

  const editHandler = (newtitle: string, description : string, image : string) => {
    if (titleError) {
      setIsValid(false);
      return;
    }

    props.onEditSubmit(newtitle, description, image, isPrivate);
  };

  const titleHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= 2 || e.target.value.length > 12) {
      setTitleError(true);
      setTitleHelper("Title should contain 3 to 12 characters.");
    } else {
      setTitleError(false);
      setTitleHelper("");
      setIsValid(true);
    }

    setTitle(e.target.value);
  };

  const descriptionHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const isPrivateHandler = (e : any) => {
    setIsPrivate(e.target.checked)
  };

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={() =>
          dispatch({ type: "GROUP MODAL", payload: { modal: null } })
        }
      ></div>
      <div className={styles.modal}>
        <h2>Group Settings</h2>
        <ThemeProvider theme={darkTheme}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <TextField
              className={styles.input}
              id="title"
              label="Title"
              variant="outlined"
              onChange={(e) => titleHandler(e)}
              helperText={titleHelper}
              error={titleError}
              value={newTitle}
            />
            <TextField
              className={styles.input}
              id="description"
              rows={3}
              multiline
              label="Description"
              variant="outlined"
              onChange={(e) => descriptionHandler(e)}
              value={description}
            />

            <div>
              <text>Private Group</text>
              <Switch checked={isPrivate} onChange={isPrivateHandler}/>

            </div>



            <CustomButton
              onClick={() => editHandler(newTitle, description, "")}
              isPurple
              title="Edit"
              small
            />
            {!isValid && <p className={styles.error}>Invalid entries.</p>}
            {isLoading && <CircularProgress />}
          </form>
        </ThemeProvider>
      </div>
    </>
  );
};

export default EditGroup;
