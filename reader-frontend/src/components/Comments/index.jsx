import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import CommentForm from '@components/Comments/CommentForm';
import styles from './comments.module.css';
import CommentItem from '@components/Comments/CommentItem';

const Comments = () => {
  const { blogId } = useParams();
  const [comments, setComments] = useState([]);
  const [isDirty, setIsDirty] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}/comments`,
          {
            method: 'GET',
          },
        );
        if (!response.ok) {
          throw new Error('Issue loading comments');
        }

        const data = await response.json();
        console.log(data.comments);
        setComments(data.comments ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsDirty(false);
      }
    }

    fetchComments();
  }, [blogId, isDirty]);

  return (
    <div>
      <hr />
      <h2>Comments</h2>
      <CommentForm setIsDirty={setIsDirty} isDirty={isDirty} />
      <div className={styles.comments}>
        {comments.map((comment) => (
          <CommentItem data={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
