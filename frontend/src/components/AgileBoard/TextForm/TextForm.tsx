import {Component} from 'react';

import { useFormik } from 'formik';
import { TextField } from '@material-ui/core';

// local
import styles from "./styles.module.scss";

type Props = {
  onSubmit: (item : string, status : string) => void;
  status : string;
};

const TextForm : React.FC<Props> = props => {
  
  const formik = useFormik({
    initialValues: {
      value : ''
    },
    onSubmit: (values, {resetForm}) => {
      props.onSubmit(values.value, props.status);
      resetForm()
    }
  });

    return (
      <div className={styles.TextForm}>
        <form onSubmit={formik.handleSubmit}>
        <TextField
          className={styles.TextFormInput}
          id="value"
          placeholder="Add Item ..."      
          {...formik.getFieldProps('value')}
        />
      </form>
      </div>
    );
}

export default TextForm;