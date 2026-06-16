import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '@utils/auth.js';

import { BiPlus } from 'react-icons/bi';

import styles from './newBlogButton.module.css';

const NewBlogButton = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleNewPost = async () => {
    try {
      // create the post.
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response);

      // redirect to edit with that post
      if (response.ok) {
        const data = await response.json();
        if (data.success)
          navigate(`/blogs/${data.blog.id}/edit`, { viewTransition: true });
      } else {
        throw new Error('Issues creating the post.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleNewPost}
      disabled={loading}
      className={styles.button}
      title='New Blog'
      aria-label='New Blog'
    >
      <BiPlus className={styles.plusIcon} />
      <span className={styles.buttonText}>New</span>
    </button>
  );
};

export default NewBlogButton;
