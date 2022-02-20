import React, { useState } from 'react';
import TextForm from '../TextForm/TextForm';


type Props = {
  title : string,
  addCard : () => void;

};

const Column: React.FC<Props> = props => {
  return (
    <div className="column">
      <div className="columnTitle">{props.title}</div>
      {props.children}
      <TextForm submitTextForm={props.addCard} placeholder="Add card..." />
  </div>
  );
};

export default Column;
