import React from "react";
import Modal from "react-modal";

import styles from './styles.module.scss'

Modal.setAppElement("#root");

const AgileModal = ({ show, onClose, item, deleteItem }) => {

    const onDelete = () => {
        deleteItem(item.id)
    }

    return (
        <Modal
            appElement={document.getElementById('app')}
            isOpen={show}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <div className={styles.options}>
                <h1 style={{ flex: "1 90%" }}>{item.title}</h1>
                <button className={styles.closeButton} onClick={onDelete}>DELETE</button>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                
            </div>
            <div>
                <h2>Description</h2>
                <p>{item.content}</p>
                <h2>Status</h2>
                {/* <p>{item.icon} {`${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}`}</p> */}
            </div>
        </Modal>
    );
};

export default AgileModal;