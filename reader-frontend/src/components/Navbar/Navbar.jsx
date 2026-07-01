import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { isLoggedIn, logout } from '@utils/auth.js';
import styles from './navbar.module.css';
import { useAuth } from '@contexts/AuthContext.jsx';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { username } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function checkLoggedIn() {
      setLoggedIn(isLoggedIn());
    }

    checkLoggedIn();
  });

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    navigate('/login', { viewTransition: true });
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span>Easy</span>
        </div>
        <nav></nav>
      </div>
      <div className={styles.right}>
        {loggedIn ? (
          <span>
            Username: {username}{' '}
            <Link onClick={() => handleLogout()}>Logout</Link>
          </span>
        ) : username ? (
          <>
            <span>
              Username: {username} <Link to='/signup'>Create your account</Link>
            </span>
          </>
        ) : (
          <span>
            <Link to='/login' viewTransition>
              Log In
            </Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
