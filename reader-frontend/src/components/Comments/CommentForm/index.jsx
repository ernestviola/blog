import { useRef, useState } from 'react';

import Editor from '@components/Editor';
import styles from './commentForm.module.css';
import { authFetch, isLoggedIn } from '@utils/auth.js';
import { useParams } from 'react-router';
import { useAuth } from '@contexts/AuthContext.jsx';

const CommentForm = ({ setIsDirty, isDirty }) => {
  const { blogId } = useParams();
  const dialogRef = useRef();
  const [comment, setComment] = useState('');
  const [focus, setFocus] = useState(false);

  const { usernameId } = useAuth();

  const handleComment = async (e) => {
    e.preventDefault();

    // check if user has some login credentials
    if (!isLoggedIn() && !usernameId) {
      showDialog();
      return;
    }

    // comment section
    if (isLoggedIn()) {
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
              body: comment,
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
    } else if (usernameId) {
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

  // function hideDialog() {
  //   dialogRef.current.close();
  // }

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
