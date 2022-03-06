import React, { useState } from "react";

import { data, statuses } from "../../components/AgileBoard/data";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./styles.module.scss";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch } from "react-redux";

// local
import Item from "../../components/AgileBoard/Item/Item";
import DropBoard from "../../components/AgileBoard/DropBoard/DropBoard";
import Column from "../../components/AgileBoard/Column/Column";
import TextForm from "../../components/AgileBoard/TextForm/TextForm";


const ProductivityView = () => {
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

  const changeViewMode = () => {
    dispatch({ type: "MANAGE VIEW", payload: { viewMode: 'app' } });
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftside}>
        <IconButton className={styles.homeButton} onClick={changeViewMode}>
          <HomeIcon className={styles.home} />
        </IconButton>
      </div>
      <div className={styles.main}>
        {statuses.map((s) => {
          return (
            <DndProvider backend={HTML5Backend}>
              {/*   eslint-disable-next-line no-restricted-globals */}
              <div key={status} className={"col-wrapper"}>
                <h2 className={"col-header"}>{s.status.toUpperCase()}</h2>
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
        <TextForm onSubmit={() => {}} placeholder="Add Column..." />
      </div>
    </div>
  );
};

export default ProductivityView;
