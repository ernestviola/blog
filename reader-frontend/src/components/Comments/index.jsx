import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import CommentForm from '@components/Comments/CommentForm';
import styles from './comments.module.css';
import CommentItem from '@components/Comments/CommentItem';
import { useAuth } from '@contexts/AuthContext.jsx';

const Comments = () => {
  const { blogId } = useParams();
  const [comments, setComments] = useState([]);
  const [isDirty, setIsDirty] = useState(true);

  const { usernameId } = useAuth();

  useEffect(() => {
    async function fetchComments() {
      try {
        const params = new URLSearchParams();
        if (usernameId) params.set('usernameId', usernameId);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}/comments?${params}`,
          {
            method: 'GET',
          },
        );
        if (!response.ok) {
          throw new Error('Issue loading comments');
        }

        const data = await response.json();
        setComments(data.comments ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsDirty(false);
      }
    }

    fetchComments();
  }, [blogId, isDirty, usernameId]);

  const handleCommentUpdate = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c)),
    );
  };

  return (
    <div>
      <hr />
      <h2>Comments</h2>
      <CommentForm setIsDirty={setIsDirty} isDirty={isDirty} />
      <div className={styles.comments}>
        {comments.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.id}
            onCommentUpdate={handleCommentUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
