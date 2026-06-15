import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '@utils/auth.js';
import styles from './navbar.module.css';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

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
          <Link onClick={() => handleLogout()}>Logout</Link>
        ) : (
          <Link to='/login' viewTransition>
            Log In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
