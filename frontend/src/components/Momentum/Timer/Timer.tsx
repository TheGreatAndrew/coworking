import React, { useRef, useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import axios from "axios";


// Local Imports
import CustomButton from '../../Shared/CustomButton/index'
import styles from './styles.module.scss';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

type Props = {
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

const Momentum: React.FC<Props> = props => {
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

  // save forrest
  const incrementForrest = async (uid: string, time: Number) => {
    let response;

    // first 10 minutes don't count
    // if(time <= 10){
    //   time = 0
    // }

    //
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
    incrementForrest(id, Math.floor(count/60));

    setCount(0);
  }
  
  return (
      <div>
        <h2>Focus</h2>

        <ThemeProvider theme={darkTheme}>
          <form className={styles.form} onSubmit={e => e.preventDefault()}>
            
            <h1>{displayTime()}</h1>
            
            <div>
              <CustomButton onClick={() => handleStart()} isPurple title="Start" small />
              <CustomButton onClick={() => handleGiveUp()} isPurple title="Give Up" small />
            </div>
            [1] If you stop within 10 minutes, the time log won't record this session
            [2] The stop watch only works if it over 10 minutes
            It’s hard to start something, every hour you will have 1 credit, this credit can be used get an extra 10 minutes
          </form>
        </ThemeProvider>
      </div>
  );


};

export default Momentum;
