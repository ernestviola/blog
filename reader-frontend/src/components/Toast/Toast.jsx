import styles from './toast.module.css';
import { useState, useEffect, useCallback } from 'react';

const Toast = ({ id, removeToast, color, msUntilRemoval = null, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 10);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleRemove = useCallback(() => {
    setMounted(false);

    setTimeout(() => {
      removeToast(id);
    }, 300);
  }, [removeToast, id]);

  useEffect(() => {
    let timeout;

    if (msUntilRemoval) {
      timeout = setTimeout(() => {
        handleRemove();
      }, msUntilRemoval);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [msUntilRemoval, handleRemove]);
  return (
    <div
      style={{ backgroundColor: color }}
      className={`${styles.toast} ${mounted ? styles.toastAnimation : ''}`}
      onClick={handleRemove}
    >
      {children}
    </div>
  );
};

export default Toast;
