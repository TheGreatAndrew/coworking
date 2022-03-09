

// local 
import styles from './styles.module.scss'


const Column = ({ isOver, children }) => {
    return (
        <div className={styles.col}>
            {children}
        </div>
    );
};

export default Column;