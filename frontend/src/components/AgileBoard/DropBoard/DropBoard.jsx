import React from "react";
import { useDrop } from "react-dnd";
import ITEM_TYPE from "../data/types";
import styles from "./index.css";

const DropBoard = ({ onDrop, children, status }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ITEM_TYPE,
        type: ITEM_TYPE,
        canDrop: (item, monitor) => {
            return true;
        },
        drop: (item, monitor) => {
            onDrop(item, monitor, status);
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    });

    return (
        <div ref={drop} className={styles.dropWrapper}>
            {React.cloneElement(children, { isOver })}
        </div>
    )
};

export default DropBoard;