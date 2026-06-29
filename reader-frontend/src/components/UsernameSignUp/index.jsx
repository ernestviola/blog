import { useState, useRef, useCallback, useEffect } from 'react';
import Toast from '@components/Toast';
import { setUserFields } from '@utils/auth.js';
import styles from './UsernameSignUp.module.css';
import { useAuth } from '@contexts/AuthContext.jsx';

const UsernameSignUp = ({ open, setOpen }) => {
  const dialogRef = useRef();

  const [newUsername, setNewUsername] = useState('');
  const [toasts, setToasts] = useState([]);
  const { usernameId, refreshAuth } = useAuth();

  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    }
  }, [open]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (usernameId) return;
    setToasts([]);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/username`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: newUsername }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setUserFields(data);
        refreshAuth();
        hideDialog();
      } else if (response.status === 400 || response.status === 409) {
        const data = await response.json();

        addToast(data.fieldErrors.username);
      } else {
        // 500 error
        throw new Error('Issues creating the username. Try again.');
      }
    } catch (error) {
      console.log(error);
    }
    // try to send the username
  };

  function showDialog() {
    dialogRef.current.showModal();
  }

  function hideDialog() {
    dialogRef.current.close();
    setOpen(false);
  }

  const addToast = useCallback((status) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, status }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.toasts}>
        {toasts.map((toast) => {
          return (
            <Toast
              key={toast.id}
              color='#7f1d1d'
              id={toast.id}
              removeToast={removeToast}
            >
              {toast.status}
            </Toast>
          );
        })}
      </div>
      <form onSubmit={(e) => handleUsernameSubmit(e)}>
        <div>
          <h2>Create a username!</h2>
          <ol>
            <li>Create a username in order to leave a comment.</li>{' '}
            <li>Sign up with that username to keep your username!</li>
          </ol>
        </div>
        <input
          className={styles.input}
          type='text'
          placeholder='username'
          aria-label='username'
          value={newUsername}
          onChange={(e) => {
            setNewUsername(e.target.value);
          }}
        />
        <div className={styles.dialogButtons}>
          <button
            onClick={() => hideDialog()}
            className={`${styles.button} ${styles.cancel}`}
            type='button'
          >
            Cancel
          </button>
          <button type='submit' className={`${styles.button} ${styles.submit}`}>
            Submit
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default UsernameSignUp;
