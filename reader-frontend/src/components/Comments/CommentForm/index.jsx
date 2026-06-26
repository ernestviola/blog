import { useRef, useState, useCallback } from 'react';

import Editor from '@components/Editor';
import styles from './commentForm.module.css';
import {
  authFetch,
  getUsernameId,
  isLoggedIn,
  setUserFields,
} from '@utils/auth.js';
import { useParams } from 'react-router';
import { useAuth } from '@contexts/AuthContext.jsx';
import Toast from '@components/Toast';

const CommentForm = ({ setIsDirty, isDirty }) => {
  const { blogId } = useParams();
  const dialogRef = useRef();
  const [comment, setComment] = useState('');
  const [focus, setFocus] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [toasts, setToasts] = useState([]);

  const { usernameId, refreshAuth } = useAuth();

  const handleComment = async (e) => {
    e.preventDefault();

    if (comment.trim() === '') return;
    // check if user has some login credentials
    if (usernameId === null) {
      showDialog();
      return;
    }
    // useAuthFetch to send
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: comment.trim(),
            usernameId: usernameId,
          }),
        },
      );
      if (!response.ok) {
        throw new Error('Issues making a comment.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDirty(true);
    }
  };

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
  }

  const addToast = useCallback((status) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, status }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className={styles.container}>
      <form
        className={styles.commentForm}
        onSubmit={(e) => handleComment(e)}
        onClick={() => setFocus(true)}
      >
        <div className={styles.editor}>
          <Editor
            onChange={setComment}
            isDirty={isDirty}
            setIsDirty={setIsDirty}
            color='white'
            focus={focus}
            setFocus={setFocus}
          />
        </div>
        <button
          type='submit'
          className={`${styles.commentButton} ${styles.button}`}
          disabled={comment.trim() === ''}
        >
          Comment
        </button>
      </form>
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
            <button
              type='submit'
              className={`${styles.button} ${styles.submit}`}
            >
              Submit
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default CommentForm;
