import React, { useRef, useState, useEffect } from "react";

// Local Imports
import Timer from "./Timer/Timer";

type Props = {};

interface IRootState {}

const Momentum: React.FC<Props> = (props) => {
  return (
    <Timer/>
  );
};

export default Momentum;
