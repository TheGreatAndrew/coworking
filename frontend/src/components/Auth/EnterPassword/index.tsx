import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// Local Imports
import logo from "../../../assets/gc-logo-symbol-nobg.png";
import CustomButton from "../../Shared/CustomButton/index";
import styles from "./styles.module.scss";

type Props = {};

type SnackData = {
  open: boolean;
  message: string | null;
  severity: "success" | "error" | undefined;
};

interface IRootState {
  auth: {
    id: string | null;
    token: string | null;
  };
}

const EnterPassword: React.FC<Props> = (props) => {
  const userData = useSelector((state: IRootState) => state.auth);


  const [snack, setSnack] = useState<SnackData>({
    open: false,
    severity: undefined,
    message: null,
  });

  const getQueryString = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    return params;
  }
  
  const changePassword = async (password: string) => {
    const params = getQueryString();
    const {uid, token} = params;

    const bodyParameters = {
      password : password
    }

    console.log(uid);
    console.log(token);
    

    // axios
    let response;
    try {
      response = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/passwords/${uid}/${token}`,
        bodyParameters,
      );
    } catch (error) {
      console.log("[ERROR][PASSWORD]: ", error);
      return;
    }
    if (!response) return;

    setSnack({ open: true, severity: "success", message: `password successfully changed` });

  };

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, 'Must be 6 characters at least')
        .required('Required')
        .max(20, 'Can not exceed 20 characters')
    }),
    onSubmit: (values) => changePassword(values.password),
  });

  return (
    <div className={styles.container}>
      <Link to="/">
        <img className={styles.logo} alt="logo" src={logo} />
      </Link>
      <form className={styles.form}>
        <TextField
          className={styles.input}
          id="password"
          label="Password"
          variant="outlined"
          type="text"
          helperText={formik.touched.password && formik.errors.password}
          error={formik.touched.password && !!formik.errors.password}
          {...formik.getFieldProps("password")}
        />
        <CustomButton type="submit" onClick={formik.handleSubmit} isPurple title="Reset" small={false} />

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
      </form>
    </div>
  );
};

export default EnterPassword;
