import React, { useEffect } from 'react';
import { Button, CircularProgress, Hidden } from '@material-ui/core';
import { IconButton, Tooltip } from '@material-ui/core';
import { useSelector } from 'react-redux';

// Local Imports
import styles from './styles.module.scss';

type PropsMessage = {
  username: string;
  text: string;
  image: string;
  _id: string;
  date: string;
  onDelete: (mid : string) => void; 
};

interface IRootState {
  auth: {
    id : string;
    username: string;
    image: string;
  };
}



const Message: React.FC<PropsMessage> = props => {
  const { id, username, image } = useSelector((state: IRootState) => state.auth);
   var hiddens = false
  if (username==props.username){
    hiddens = true
  }

  return (
    <div className={styles.messageContainer}>
      
      
      <img className={styles.image} alt="User" src={props.image} />
      <div className={styles.textBox}>
        <p className={styles.username}>
          {props.username} <span className={styles.date}>{props.date}</span>
          {hiddens ? <button className={styles.button1}  onClick={()=>props.onDelete(id)}> Delete me :(</button> : null}
        </p>
        <p className={styles.message}>{props.text}</p>  
      </div>

    </div>
  );
};




type PropsMessages = {
  messages: PropsMessage[];
  loading: boolean;
  onClick: () => void;
  onDelete: (mid : string) => void;
  
};


// TODO
// click 'message' show the menu (done)
// button is ugly -> how many types of clickable 
// show menu 
// show menu with options 
// show menu at that x, y location
// delete option clickable

// document.addEventListener('contextmenu', event => {
//   event.preventDefault();
//   console.log("norm 2021");
//   }
// );

const Messages: React.FC<PropsMessages> = props => {
  useEffect(() => {
    const chatElement = document.getElementById('chat');
    if (chatElement) {
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  });

  return (
    <div id="chat" className={styles.container} onClick={props.onClick} >
      {props.loading ? (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.wrapper}>
          {props.messages.map(message => (
            <Message
              _id={message._id}
              key={message._id}
              username={message.username}
              text={message.text}
              image={message.image}
              date={message.date}
              onDelete={()=>{props.onDelete(message._id)}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
