import styles from './navbar.module.css';

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span>Blogs</span>
        </div>
        <nav></nav>
      </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default Navbar;
