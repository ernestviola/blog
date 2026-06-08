import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '@utils/auth.js';
import styles from './blogs.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    document.title = 'Your Blogs';
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/blogs`,
          {
            method: 'GET',
          },
          navigate,
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBlogs(data.blogs);
        }
      } catch {
        // network error try again
        setBlogs([]);
      }
    }

    fetchData();

    return () => {
      setBlogs([]);
    };
  }, [navigate]);

  return (
    <div>
      <h1>Blogs</h1>
      <div className={styles.blogs}>
        {blogs && blogs.map((blog) => <>{blog}</>)}
      </div>
    </div>
  );
};

export default Home;
