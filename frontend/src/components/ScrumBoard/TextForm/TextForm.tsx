import React from "react";
import { useFormik } from "formik";
import TextField from "@material-ui/core/TextField";

import styles from "./styles.module.scss";

type Props = {
  submitTextForm: (text: string) => void;
  placeholder : string
};

const TextForm: React.FC<Props> = (props) => {
  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: (values) => props.submitTextForm(values.text),
  });

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <TextField
          className={styles.input}
          id="email"
          label="Email"
          variant="outlined"
          type="text"
          placeholder={props.placeholder}
          {...formik.getFieldProps("text")}
        />
      </form>
    </div>
  );
};

export default TextForm;
