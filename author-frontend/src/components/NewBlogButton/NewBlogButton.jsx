import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '@utils/auth.js';

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
    <button onClick={handleNewPost} disabled={loading}>
      New Blog
    </button>
  );
};

export default NewBlogButton;
