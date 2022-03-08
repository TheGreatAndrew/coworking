

// local 
import styles from './styles.module.scss'
import TextForm from "../TextForm/TextForm";


const Column = ({ isOver, children }) => {
    return (
        <div className={styles.col}>
            {children}
            <TextForm onSubmit={()=>{}} placeholder="Add card..." />
        </div>
    );
};

export default Column;