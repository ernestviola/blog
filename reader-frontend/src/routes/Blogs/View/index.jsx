import Editor from '@components/Editor';
import { useState, useEffect, useCallback } from 'react';
import styles from './view.module.css';
import { authFetch } from '@utils/auth.js';
import { useNavigate, useParams } from 'react-router';
import Loading from '@components/Loading';
import Toast from '@components/Toast';
import BackButton from '@components/BackButton';
import Comments from '@components/Comments';

const View = () => {
  const navigate = useNavigate();

  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.title = blog?.title ?? '';
  }, [blog]);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`,
          {
            method: 'GET',
          },
        );

        if (!response.ok) {
          throw new Error('Issues retrieving the blog');
        }

        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, [blogId, navigate]);

  const addToast = useCallback((status) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, status }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (blog === null) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.toasts}>
          {toasts.map((toast) => {
            return (
              <Toast
                key={toast.id}
                color='#55ff'
                id={toast.id}
                removeToast={removeToast}
                msUntilRemoval={1000}
              >
                {toast.status}
              </Toast>
            );
          })}
        </div>

        <div className={styles.header}>
          <BackButton />
        </div>
        <div className={styles.body}>
          <h1>{blog.title}</h1>
          <Editor editable={false} initialMarkdown={blog.body} />
        </div>
        <div className={styles.footer}>
          <Comments />
        </div>
      </div>
    </>
  );
};

export default View;
