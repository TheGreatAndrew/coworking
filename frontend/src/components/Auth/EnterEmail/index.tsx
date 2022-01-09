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

const EnterEmail: React.FC<Props> = (props) => {
  const [snack, setSnack] = useState<SnackData>({
    open: false,
    severity: undefined,
    message: null,
  });

  
  const sendPasswordResetEmail = async (email: string) => {
  
    const bodyParameters = {
      email : email
    }

    // axios
    let response;
    try {
      response = await axios.post(
        `${
          process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
          process.env.REACT_APP_SERVER_URL
        }/passwords`,
        bodyParameters,
      );
    } catch (error) {
      console.log("[ERROR][PASSWORD]: ", error);
      return;
    }
    if (!response) return;

    setSnack({ open: true, severity: "success", message: `email successfully sent to ${email}` });

  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => sendPasswordResetEmail(values.email),
  });

  return (
    <div className={styles.container}>
      <Link to="/">
        <img className={styles.logo} alt="logo" src={logo} />
      </Link>
      <form className={styles.form}>
        <TextField
          className={styles.input}
          id="email"
          label="Email"
          variant="outlined"
          type="text"
          helperText={formik.touched.email && formik.errors.email}
          error={formik.touched.email && !!formik.errors.email}
          {...formik.getFieldProps("email")}
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

export default EnterEmail;
