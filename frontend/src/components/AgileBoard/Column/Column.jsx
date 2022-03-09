

// local 
import styles from './styles.module.scss'


const Column = ({ isOver, children }) => {
    const className = isOver ? styles.highlightRegion : "";

    return (
        <div className={className}>
            <div className={styles.col}>
            {children}
            </div>
        </div>
    );
};

export default Column;