import React, { Fragment, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import AgileModal from "../AgileModal/AgileModal";
import ITEM_TYPE from "../data/types";

import styles from './styles.module.scss'

const Item = ({ item, itemId, moveItem, status, statusId, statusIndex }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ITEM_TYPE,
        type: ITEM_TYPE,
        hover(item, monitor) {
            console.log("Item.jsx status id " + statusId)

            const draggingItem = monitor.getItem()
            if(draggingItem.id != itemId){
                moveItem(draggingItem.id, statusId, statusIndex)
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type : ITEM_TYPE,
        item: { type: ITEM_TYPE, ...item, itemId },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    const [show, setShow] = useState(false);

    const onOpen = () => setShow(true);

    const onClose = () => setShow(false);

    drag(drop(ref));

    return (
        <Fragment>
            <div
                ref={ref}
                style={{ opacity: isDragging ? 0 : 1 }}
                className={styles.item}
                onClick={onOpen}
            >
                <div className={styles.colorBar} style={{ backgroundColor: status.color }}/>
                <p className={styles.itemTitle}>{item.content}</p>
                <p className={styles.itemStatus}>{status.icon}</p>
            </div>
            <AgileModal
                item={item}
                onClose={onClose}
                show={show}
            />
        </Fragment>
    );
};

export default Item;