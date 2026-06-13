import Editor from '@components/Editor';
import { useState, useEffect } from 'react';
import styles from './new.module.css';
import { authFetch } from '@utils/auth.js';
import { useNavigate } from 'react-router-dom';

const New = () => {
  const navigate = useNavigate();

  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'New Blog';
  }, []);

  const handleSave = async () => {
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
        <Editor onChange={setMarkdown} />
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerButtons}>
          <div className={styles.left}>
            <button className={styles.delete} title='Delete'>
              Delete
            </button>
          </div>
          <div className={styles.right}>
            <button
              className={styles.save}
              title='Save'
              onClick={() => handleSave()}
            >
              Save
            </button>
            <button className={styles.publish} title='Publish'>
              Publish
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default New;
