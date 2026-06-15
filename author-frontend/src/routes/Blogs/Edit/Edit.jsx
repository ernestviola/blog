import Editor from '@components/Editor';
import { useState, useEffect } from 'react';
import styles from './edit.module.css';
import { authFetch } from '@utils/auth.js';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@components/Loading';

const Edit = () => {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState(null);
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const { blogId } = useParams();

  useEffect(() => {
    document.title = 'New Blog';
  }, []);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const response = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`,
          {
            method: 'GET',
          },
        );

        if (!response.ok) {
          throw new Error('Issues retrieving the blog');
        }

        const data = await response.json();
        setTitle(data.blog.title ?? '');
        setMarkdown(data.blog.body ?? '');
      } catch (error) {
        console.log(error);
      }
    }

    fetchBlogData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            body: markdown,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) navigate('/blogs', { viewTransition: true });
      } else {
        throw new Error('Issues saving the post.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            body: markdown,
            published: true,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) navigate('/blogs', { viewTransition: true });
      } else {
        throw new Error('Issues saving the post.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (markdown === null && title === null) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          className={styles.titleInput}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder='Untitled'
        />
      </div>

      <div className={styles.body}>
        <Editor onChange={setMarkdown} initialMarkdown={markdown} />
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerButtons}>
          <div className={styles.left}>
            <button className={styles.delete} title='Delete' disabled={loading}>
              Delete
            </button>
          </div>
          <div className={styles.right}>
            <button
              className={styles.save}
              title='Save'
              onClick={() => handleSave()}
              disabled={loading}
            >
              Save
            </button>
            <button
              className={styles.publish}
              title='Publish'
              onClick={() => handlePublish()}
              disabled={loading}
            >
              Publish
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Edit;
