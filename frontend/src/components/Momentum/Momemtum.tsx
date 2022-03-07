import React, { useRef, useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';


// Local Imports
import styles from './styles.module.scss';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

type Props = {
  incrementForrest: (uid: string, time: Number) => void;
  title: string;
};

interface IRootState {
  auth: {
    id : string; 
  };
}

function useInterval(callback : any, delay : any){
  const savedCallback = useRef<any>();

  useEffect(() => {
    savedCallback.current = callback;
  },[callback])

  useEffect(() => {
    function tick(){
      if (savedCallback.current) savedCallback.current();
    }

    if(delay != null){
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay])
} 

const Momemtum: React.FC<Props> = props => {
  return(
    <div>
      Momemtum
    </div>
  )

};

export default Momemtum;
