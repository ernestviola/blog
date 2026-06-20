import { getUsernameId, isLoggedIn } from '@utils/auth.js';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usernameId, setUsernameId] = useState(getUsernameId());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const refreshAuth = () => {
    setUsernameId(getUsernameId());
    setLoggedIn(isLoggedIn());
  };

  return (
    <AuthContext.Provider value={{ usernameId, loggedIn, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
