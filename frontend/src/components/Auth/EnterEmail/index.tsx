import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

// Local Imports
import logo from "../../../assets/gc-logo-symbol-nobg.png";
import CustomButton from "../../Shared/CustomButton/index";
import styles from "./styles.module.scss";

type Props = {};


const EnterEmail: React.FC<Props> = (props) => {
  const sendPasswordResetEmail = async (email: string) => {
  //   const { token } = userData;
  
  //   const config = {
  //     headers: { Authorization: `Bearer ${token}` }
  //   }
  
  //   const bodyParameters = {
  //     uid : userData.id
  //   }
  
  //   // axios
  //   let response;
  //   try {
  //     response = await axios.post(
  //       `${
  //         process.env.REACT_APP_MY_HEROKU_BACKEND_URL ||
  //         process.env.REACT_APP_SERVER_URL
  //       }/groups/invite/${gid}`,
  //       bodyParameters,
  //       config
  //     );
  //   } catch (error) {
  //     console.log("[ERROR][GROUPS][JOIN]: ", error);
  //     return;
  //   }
  //   if (!response) return;
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

      </form>
    </div>
  );
};

export default EnterEmail;
