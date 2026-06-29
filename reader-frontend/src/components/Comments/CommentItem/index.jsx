import { BiHeart, BiSolidHeart } from 'react-icons/bi';

import Editor from '@components/Editor';
import styles from './commentItem.module.css';
import { useAuth } from '@contexts/AuthContext.jsx';
import { useState } from 'react';
import UsernameSignUp from '@components/UsernameSignUp';
import { authFetch } from '@utils/auth.js';

const CommentItem = ({ comment }) => {
  const { usernameId } = useAuth();
  const [liked, setLiked] = useState(comment?.likedByUser ?? false);
  const [likeCount, setLikeCount] = useState(comment?._count?.commentLikes);
  const [openUsernameSignUp, setOpenUsernameSignUp] = useState(false);

  const handleLike = async () => {
    if (!usernameId) {
      setOpenUsernameSignUp(true);
      return;
    }
    const likedPrevState = liked;
    setLiked(!liked);
    // if true then subtract
    if (likedPrevState) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }

    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${comment.blogId}/comments/${comment.id}/like`,
        {
          method: liked ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        setLiked(likedPrevState);
        throw new Error('Issues liking the comment.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.username}>@{comment.username.username} </div>
        <span>
          {new Date(comment.added).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
      <div className={styles.commentContainer}>
        <Editor color='white' editable={false} initialMarkdown={comment.body} />
      </div>
      <div className={styles.footer}>
        <div className={styles.heartContainer}>
          <button className={styles.heartButton} onClick={handleLike}>
            {liked ? <BiSolidHeart /> : <BiHeart />}
          </button>
          <span>{likeCount}</span>
        </div>
      </div>
      <UsernameSignUp
        open={openUsernameSignUp}
        setOpen={setOpenUsernameSignUp}
      />
    </div>
  );
};

export default CommentItem;
