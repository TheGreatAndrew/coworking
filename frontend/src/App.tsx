import React from 'react';
import { useSelector } from 'react-redux';

// Local Imports
import ProductivityView from './views/ProductivityView/index';
import AppView from './views/AppView/index';
import AuthView from './views/AuthView/index';

interface IRootState {
  auth: {
    isLogged: boolean;
    id: string | null;
    username: string | null;
    image: string | null;
    token: string | null;
  };
  app : {
    viewMode : 'app' | 'productivity'
  }
}

const App: React.FC = () => {
  const isAuth = useSelector((state: IRootState) => state.auth.isLogged);
  const viewMode = useSelector((state: IRootState) => state.app.viewMode);

  return isAuth ? (viewMode == 'app' ? <AppView/> : <ProductivityView/>) : <AuthView />;

};

export default App;
