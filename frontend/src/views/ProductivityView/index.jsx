import React, { useState } from "react";
import Item from "../../components/AgileBoard/Item";
import DropWrapper from "../../components/AgileBoard/DropWrapper";
import Col from "../../components/AgileBoard/Col";
import { data, statuses } from "../../components/AgileBoard/data";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';

const ProductivityView = () => {
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
    <div className={"row"}>
      {statuses.map((s) => {
        return (
          <DndProvider backend={HTML5Backend}>
            {/* eslint-disable-next-line no-restricted-globals */}
            <div key={status} className={"col-wrapper"}>
              <h2 className={"col-header"}>{s.status.toUpperCase()}</h2>
              <DropWrapper onDrop={onDrop} status={s.status}>
                <Col>
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
                </Col>
              </DropWrapper>
            </div>
          </DndProvider>
        );
      })}
    </div>
  );
};

export default ProductivityView;
