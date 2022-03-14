
import { useDispatch, useSelector } from "react-redux";

import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// local
import App from "../../components/AgileBoard/App/App";
import Board from "../../components/AgileBoard/Board/Board";
import Momentum from "../../components/Momentum/Momentum";
import styles from "./styles.module.scss";

interface IRootState {
  app : {
    viewMode : 'app' | 'board' | 'momentum'
  }
}

const ProductivityView = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector((state: IRootState) => state.app.viewMode);


  const appMode = () => {
    dispatch({ type: "MANAGE VIEW", payload: { viewMode: 'app' } });
  }

  const boardMode = () => {
    dispatch({ type: "MANAGE VIEW", payload: { viewMode: 'board' } });
  }

  const momentumMode = () => {
    dispatch({ type: "MANAGE VIEW", payload: { viewMode: 'momentum' } });
  }
  

  const renderProductivityTools = () => {
    switch(viewMode){
      case 'board' :
        return <App/>;
      case 'momentum' : 
        return <Momentum/>;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftside}>
        <IconButton className={styles.homeButton} onClick={appMode}>
          <HomeIcon className={styles.home} />
        </IconButton>
        <Button variant="text" color="primary" onClick={boardMode}>Board</Button>
        <Button variant="text" color="primary" onClick={momentumMode}>Momentum</Button>

      </div>
      <div className={styles.main}>
        {renderProductivityTools()}
      </div>
    </div>
  );
};

export default ProductivityView;
