import { useState } from 'react';

import Editor from '@components/Editor';
import styles from './commentForm.module.css';
import { authFetch } from '@utils/auth.js';
import { useParams } from 'react-router';
import { useAuth } from '@contexts/AuthContext.jsx';
import UsernameSignUp from '@components/UsernameSignUp';

const CommentForm = ({ setIsDirty, isDirty }) => {
  const { blogId } = useParams();

  const [comment, setComment] = useState('');
  const [focus, setFocus] = useState(false);
  const [openUsernameSignUp, setOpenUsernameSignUp] = useState(false);

  const { usernameId } = useAuth();

  const handleComment = async (e) => {
    e.preventDefault();

    if (comment.trim() === '') return;
    // check if user has some login credentials
    if (usernameId === null) {
      setOpenUsernameSignUp(true);
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
      <UsernameSignUp
        open={openUsernameSignUp}
        setOpen={setOpenUsernameSignUp}
      />
    </div>
  );
};

export default CommentForm;
