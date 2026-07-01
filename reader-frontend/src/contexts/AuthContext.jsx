import { getUsername, getUsernameId, isLoggedIn } from '@utils/auth.js';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usernameId, setUsernameId] = useState(getUsernameId());
  const [username, setUsername] = useState(getUsername());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const refreshAuth = () => {
    setUsernameId(getUsernameId());
    setLoggedIn(isLoggedIn());
    setUsername(getUsername());
  };

  return (
    <AuthContext.Provider
      value={{ username, usernameId, loggedIn, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
