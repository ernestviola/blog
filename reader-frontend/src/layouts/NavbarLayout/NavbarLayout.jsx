import Navbar from '@components/Navbar';
import { Outlet } from 'react-router';
import styles from './navbarLayout.module.css';

export default function NavbarLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
