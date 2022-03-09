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
import styles from "./styles.module.scss";

const Board = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState(data);

  // purpose -> for dropping
  // how -> filter out the moved item, ...item only change status and icon   
  const onDrop = (item, monitor, status) => {
    // const mapping = statuses.find((element) => element.status === status);

    setItems((prevState) => {
      const newItems = prevState
        .filter((i) => i.id !== item.id)
        .concat({ ...item, status });

        // .concat({ ...item, status, icon: mapping.icon });
      return [...newItems];
    });
  };

  // purpose -> for moving same column
  // how -> get main item. filter out have that item. add that item to hover location
  const moveItem = (dragIndex, hoverIndex) => {
    const item = items[dragIndex];

    setItems((prevState) => {
      const newItems = prevState.filter((item, index) => index !== dragIndex);
      newItems.splice(hoverIndex, 0, item);
      return [...newItems];
    });
  };

  // 
  const addItem = (newTitle, newStatus) => {
    // TODO delete this
    let randomId = Math.floor(Math.random() * 200000) + 5;

    setItems((prevState) => {
      const newItems = prevState
        .concat({ id : randomId, status : newStatus, title: newTitle, content: newTitle});
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
                    .map((item, index) => (
                      <Item
                        key={item.id}
                        item={item}
                        index={index}
                        moveItem={moveItem}
                        status={s}
                      />
                    ))}
                  <TextForm onSubmit={addItem} status={s.status}/>
                </Column>
              </DropBoard>
            </div>
          </DndProvider>
        );
      })}
    </div>
  );
};

export default Board;
