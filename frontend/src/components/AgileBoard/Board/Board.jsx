import React, { useState } from "react";

import { useDispatch } from "react-redux";

// local
import Item from "../Item/Item";
import DropBoard from "../DropBoard/DropBoard";
import Column from "../Column/Column";
import TextForm from "../TextForm/TextForm";
import styles from "./styles.module.scss";

const Board = (props) => {
  return (
    <div className={styles.container}>
      {props.statuses.map((s) => {
        return (
          <div>
            {/*   eslint-disable-next-line no-restricted-globals */}
            <div key={status} className={styles.colWrapper}>
              <h2 className={styles.colHeader}>{s.status.toUpperCase()}</h2>
              <DropBoard onDrop={props.onDrop} statusId={s.statusId}>
                <Column>
                  {s.itemIds
                    .map((itemId) => props.items.find((item) => item.id === itemId))
                    .map((item, index) => {
                      return (
                        <Item
                          key={item.id}

                          item={item}
                          itemId={item.id}

                          status={s}
                          statusId={s.statusId}
                          statusIndex={index}

                          moveItem={props.moveItem}
                          deleteItem={props.deleteItem}
                        />
                      );
                    })}

                </Column>
              </DropBoard>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Board;

{/* <Column>
                    {props.items
                      .filter((i) => i.status === s.status)
                      .map((item, index) => (
                        <Item
                          key={item.id}
                          item={item}
                          index={index}
                          moveItem={props.moveItem}
                          status={s}
                        />
                      ))}
                    <TextForm onSubmit={props.addItem} status={s.status} />
                  </Column> */
}
