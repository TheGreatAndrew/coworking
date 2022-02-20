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
}

const App: React.FC = () => {
  const isAuth = useSelector((state: IRootState) => state.auth.isLogged);

  return isAuth ? <ProductivityView /> : <AuthView />;

};

export default App;
