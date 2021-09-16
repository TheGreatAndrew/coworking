import React, { useRef, useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';


// Local Imports
import CustomButton from '../CustomButton/index';
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

const ForrestModal: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const { id } = useSelector((state: IRootState) => state.auth);

  const [startTime, setStartTime] = useState(new Date)
  const [stopTime, setStopTime] = useState(new Date)
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(() => {
    setCount(count + 1);
  }, isRunning ? delay : null);


  const displayTime = () => {
  // setCount(stopTime && startTime ? stopTime.valueOf() - startTime.valueOf() : 0);
  var minutes = Math.floor(count / 60);
  var seconds = count - minutes * 60;
  if(seconds < 10)
    return `${minutes}:0${seconds}`
  else  
    return `${minutes}:${seconds}`

}

  const handleStart = () => { 
    setStartTime(new Date());
    setStopTime(new Date());
    setIsRunning(true);
  }

  const handleGiveUp = () => { 
    setIsRunning(false);
    setStopTime(new Date());

    // axios forrest save
    props.incrementForrest(id, Math.floor(count/60));

    setCount(0);
  }

  const hello = () =>{
    return 'hello world';
  }

  return (
    <>
      <div className={styles.backdrop} onClick={() => dispatch({ type: 'MODAL', payload: { modal: null } })}></div>
      <div className={styles.modal}>
        <h2>{props.title}</h2>

        <ThemeProvider theme={darkTheme}>
          <form className={styles.form} onSubmit={e => e.preventDefault()}>
            
            <h1>{displayTime()}</h1>
            If you stop within 10 minutes, the time log won't record this session
            
            <div>
              <CustomButton onClick={() => handleStart()} isPurple title="Start" small />
              <CustomButton onClick={() => handleGiveUp()} isPurple title="Give Up" small />
            </div>
          </form>
        </ThemeProvider>
      </div>
    </>
  );


};

export default ForrestModal;
