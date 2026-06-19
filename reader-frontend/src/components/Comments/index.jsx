import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import CommentForm from '@components/Comments/CommentForm';
import styles from './comments.module.css';
import CommentItem from '@components/Comments/CommentItem';

const Comments = () => {
  const { blogId } = useParams();
  const [comments, setComments] = useState([]);

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
        setComments(data.comments ?? []);
      } catch (error) {
        console.log(error);
      }
    }

    fetchComments();
  }, [blogId]);

  return (
    <div>
      <hr />
      <h2>Comments</h2>
      <CommentForm />
      <div className={styles.comments}>
        {comments.map((comment) => (
          <CommentItem data={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
