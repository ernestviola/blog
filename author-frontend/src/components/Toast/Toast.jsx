import styles from './toast.module.css';
import { IoIosClose } from 'react-icons/io';
import { useState, useEffect } from 'react';

const Toast = ({ removeToast, color, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 10);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <div
      style={{ backgroundColor: color }}
      className={`${styles.toast} ${mounted ? styles.toastAnimation : ''}`}
      onClick={removeToast}
    >
      <IoIosClose className={styles.closeBtn} /> {children}
    </div>
  );
};

export default Toast;
