import React, { useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch } from "react-redux";

// local
import { data, statuses } from "../data";
import Item from "../Item/Item";
import DropBoard from "../DropBoard/DropBoard";
import Column from "../Column/Column";
import TextForm from "../TextForm/TextForm";

import styles from './styles.module.scss'

const Board = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState(data);

  const onDrop = (item, monitor, status) => {
    const mapping = statuses.find((si) => si.status === status);

    setItems((prevState) => {
      const newItems = prevState
        .filter((i) => i.id !== item.id)
        .concat({ ...item, status, icon: mapping.icon });
      return [...newItems];
    });
  };

  const moveItem = (dragIndex, hoverIndex) => {
    const item = items[dragIndex];
    setItems((prevState) => {
      const newItems = prevState.filter((i, idx) => idx !== dragIndex);
      newItems.splice(hoverIndex, 0, item);
      return [...newItems];
    });
  };

  return (
    <div className={styles.container}>
      {statuses.map((s) => {
        return (
          <DndProvider backend={HTML5Backend}>
            {/*   eslint-disable-next-line no-restricted-globals */}
            <div key={status} className={styles.colWrapper}>
              <h2 className={styles.colHeader}>{s.status.toUpperCase()}</h2>
              <DropBoard onDrop={onDrop} status={s.status}>
                <Column>
                  {items
                    .filter((i) => i.status === s.status)
                    .map((i, idx) => (
                      <Item
                        key={i.id}
                        item={i}
                        index={idx}
                        moveItem={moveItem}
                        status={s}
                      />
                    ))}
                </Column>
              </DropBoard>
            </div>
          </DndProvider>
        );
      })}
      {/* <TextForm onSubmit={() => {}} placeholder="Add Column..." /> */}
    </div>
  );
};

export default Board;
