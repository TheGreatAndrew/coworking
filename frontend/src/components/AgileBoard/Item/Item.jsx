import React, { Fragment, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import AgileModal from "../AgileModal/AgileModal";
import ITEM_TYPE from "../data/types";

import styles from './styles.module.scss'

const Item = ({ item, index, moveItem, status }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ITEM_TYPE,
        type: ITEM_TYPE,
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index; // the main 
            const hoverIndex = index; // the main one is hovering this

            if (dragIndex === hoverIndex) {
                return
            }

            const hoveredRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientY = mousePosition.y - hoveredRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type : ITEM_TYPE,
        item: { type: ITEM_TYPE, ...item, index },
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
                <p className={styles.itemStatus}>{item.icon}</p>
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