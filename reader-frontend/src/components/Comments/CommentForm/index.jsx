import { useRef, useState } from 'react';

import Editor from '@components/Editor';
import styles from './commentForm.module.css';
import { getUsernameId, isLoggedIn } from '@utils/auth.js';

const CommentForm = () => {
  const dialogRef = useRef();
  const [comment, setComment] = useState('');

  const handleComment = (e) => {
    e.preventDefault();

    // check if user has some login credentials
    if (!isLoggedIn() && !getUsernameId()) {
      showDialog();
      return;
    }

    // comment section
    if (isLoggedIn()) {
      // useAuthFetch to send
    } else if (getUsernameId()) {
      // useFetch with the usernameId
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();

    // try to send the username
  };

  function showDialog() {
    dialogRef.current.showModal();
  }

  function hideDialog() {
    dialogRef.current.close();
  }

  return (
    <div className={styles.container}>
      <form className={styles.commentForm} onSubmit={(e) => handleComment(e)}>
        <Editor onChange={setComment} />
        <button type='submit'>Submit</button>
      </form>
      <dialog ref={dialogRef}>
        <form onSubmit={(e) => handleUsernameSubmit(e)}>
          <h2>
            Create a username in order to leave a comment. Sign up with that
            username to keep your username!
          </h2>
          <input type='text' placeholder='username' aria-label='username' />
          <button>Submit</button>
        </form>
      </dialog>
    </div>
  );
};

export default CommentForm;
