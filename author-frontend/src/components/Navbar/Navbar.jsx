import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn, logout } from '@utils/auth.js';
import styles from './navbar.module.css';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    function checkLoggedIn() {
      setLoggedIn(isLoggedIn());
    }

    checkLoggedIn();
  });

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span>Blogs</span>
        </div>
        <nav></nav>
      </div>
      <div className={styles.right}>
        {loggedIn ? (
          <Link onClick={() => handleLogout()}>Logout</Link>
        ) : (
          <Link to='/login'>Log In</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
