import { useState } from "react";
import { useDispatch } from "react-redux";
import _, { filter } from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


//local
import Board from "../Board/Board";


const data = [
  {
    id: 1,
    title: "Human Interest Form",
    content: "a",
  },
  {
    id: 2,
    title: "Purchase present",
    content: "b",
  },
  {
    id: 3,
    title: "Invest in investments",
    content: "c",
  },
  {
    id: 4,
    title: "Daily reading",
    content: "d",
  },
];

const dataStatuses = [
  {
    statusId : 1,
    status: "open",
    icon: "⭕️",
    color: "#EB5A46",
    itemIds: [],
  },
  {
    statusId : 2, 
    status: "in progress",
    icon: "🔆️",
    color: "#00C2E0",
    itemIds: [1, 2, 3, 4],
  },
  {
    statusId : 3, 
    status: "in review",
    icon: "📝",
    color: "#C377E0",
    itemIds: [],
  },
  {
    statusId : 4,
    status: "done",
    icon: "✅",
    color: "#3981DE",
    itemIds: [],
  },
];

const App = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState(data);
  const [statuses, setStatuses] = useState(dataStatuses);

  // onDrop is for inter-column
  const onDrop = (item, monitor, destStatusId) => {
      moveItem(item.id, destStatusId, 0 )
  };

  const moveItem = (itemId, destStatusId, statusIndex) => {
    setStatuses((prevStatuses) => {
      const newStatuses = prevStatuses.map(s => {
        const filteredIds = s.itemIds.filter(id => id !== itemId);

        let newIds; 
        s.statusId=== destStatusId
        ? newIds = [...filteredIds.slice(0, statusIndex), itemId, ...filteredIds.slice(statusIndex)]
        : newIds = filteredIds; 
        
        return { ...s, itemIds : newIds}
      })

      return newStatuses;
    })

  };

  const addItem = (newTitle, newStatus) => {
    let randomId = Math.floor(Math.random() * 200000) + 5;

    setItems((prevState) => {
      const newItems = prevState.concat({
        id: randomId,
        status: newStatus,
        title: newTitle,
        content: newTitle,
      });
      return [...newItems];
    });
  };

  const deleteItem = (item) => {
    setItems((prevState) => {
      const newItems = prevState.filter((i) => i.id !== item.id);

      return [...newItems];
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Board
        items={items}
        statuses={statuses}
        moveItem={moveItem}
        addItem={addItem}
        deleteItem={deleteItem}
        onDrop={onDrop}
      />
    </DndProvider>
  );
};

export default App;
