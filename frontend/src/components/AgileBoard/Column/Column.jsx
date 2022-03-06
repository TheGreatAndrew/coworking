import React from "react";

const Column = ({ isOver, children }) => {
    return (
        <div className={`col`}>
            {children}
        </div>
    );
};

export default Column;