import { BiHeart, BiSolidHeart } from 'react-icons/bi';

import Editor from '@components/Editor';
import styles from './commentItem.module.css';
import { useAuth } from '@contexts/AuthContext.jsx';

const CommentItem = ({ comment, onCommentUpdate }) => {
  const { usernameId } = useAuth();
  const handleLike = async () => {
    if (!usernameId) return;

    try {
      const params = new URLSearchParams();
      if (usernameId) params.set('usernameId', usernameId);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${comment.blogId}/comments/${comment.id}/like?${params}`,
        {
          method: 'POST',
          body: JSON.stringify({
            usernameId,
            commentId: comment.id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response);
      if (!response.ok) throw new Error('Issues liking the comment.');

      const data = await response.json();
      onCommentUpdate(data.comment);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.username}>@{comment.username.username}: </div>
      <div className={styles.commentContainer}>
        <Editor color='white' editable={false} initialMarkdown={comment.body} />
      </div>
      <div className={styles.footer}>
        <div className={styles.heartContainer}>
          <button className={styles.heartButton} onClick={handleLike}>
            {comment.likedByUser ? <BiSolidHeart /> : <BiHeart />}
          </button>
          <span>{comment._count.commentLikes}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
