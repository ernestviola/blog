import { useRef } from 'react';

import Editor from '@components/Editor';
import styles from './commentForm.module.css';

const CommentForm = () => {
  const dialogRef = useRef();

  const handleComment = () => {
    // check if user is logged in OR has a username uuid
    // if not then open dialog to create a username
    // if so then submit the comment
  };

  function showDialog() {
    dialogRef.current.showModal();
  }
  function hideDialog() {
    dialogRef.current.close();
  }
  return (
    <div className={styles.container}>
      <div className={styles.commentForm}>
        <Editor />
        <button>Submit</button>
        <dialog ref={dialogRef}>
          <h2>
            Create a username in order to leave a comment. Sign up with that
            username to keep your username!
          </h2>
          <input type='text' placeholder='username' aria-label='username' />
          <button>Submit</button>
        </dialog>
      </div>
    </div>
  );
};

export default CommentForm;
