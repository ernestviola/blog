import Editor from '@components/Editor';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './edit.module.css';
import { authFetch } from '@utils/auth.js';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@components/Loading';
import Toast from '@components/Toast';

const Edit = () => {
  const navigate = useNavigate();

  const { blogId } = useParams();

  const [markdown, setMarkdown] = useState(null);
  const [published, setPublished] = useState(null);
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const dialogRef = useRef(null);
  const openDialog = () => {
    dialogRef.current.showModal();
    dialogRef.current.focus();
  };
  const closeDialog = () => dialogRef.current.close();

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
        setPublished(data.blog.published);
      } catch (error) {
        console.log(error);
        navigate('/login');
      }
    }

    fetchBlogData();
  }, [blogId, navigate]);

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
        // lets make a toast

        addToast('Saved');
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
        `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            published: !published,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPublished(data.blog.published);
        addToast(data.blog.published ? 'Hidden' : 'Published');
      } else {
        throw new Error('Issues saving the post.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('There was a problem deleting the post.');
      }

      return navigate('/blogs', { viewTransition: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addToast = (status) => {
    const id = crypto.randomUUID();
    const currentToasts = [...toasts];
    setToasts([
      ...currentToasts,
      {
        id,
        status,
      },
    ]);
  };

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (markdown === null && title === null) {
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
        <div className={styles.footer}>
          <div className={styles.footerButtons}>
            <div className={styles.left}>
              <button
                onClick={openDialog}
                className={styles.delete}
                title='Delete'
                disabled={loading}
              >
                Delete
              </button>
            </div>
            <div className={styles.right}>
              <button
                className={styles.save}
                title='Save'
                onClick={handleSave}
                disabled={loading}
              >
                Save
              </button>
              <button
                className={styles.publish}
                title='Publish'
                onClick={handlePublish}
                disabled={loading}
              >
                {published ? 'Publish' : 'Hide'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <dialog ref={dialogRef} className={styles.deleteDialog}>
        <h2>Are you sure you want to delete?</h2>
        <div className={styles.deleteDialogButtons}>
          <button onClick={closeDialog} className={styles.cancel}>
            Cancel
          </button>
          <button className={styles.delete} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </dialog>
    </>
  );
};

export default Edit;
