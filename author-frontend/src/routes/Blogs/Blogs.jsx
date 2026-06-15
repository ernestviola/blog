import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authFetch } from '@utils/auth.js';
import styles from './blogs.module.css';

import { BiHeart } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi';

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
          console.log(data.blogs);
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
      <ul className={styles.blogs}>
        {blogs.map((blog) => (
          <li key={blog.id} className={styles.blogItem}>
            <div>
              <div className={styles.blogStat}>
                <BiHeart className={styles.heart} />
                <span>{blog.likes}</span>
              </div>
              <div className={styles.blogStat}>
                <BsEye className={styles.eye} />
                <span>{blog.views}</span>
              </div>
            </div>
            <div className={styles.content}>
              <h2 className={styles.title}>{blog.title}</h2>
              <p>Author: {blog.user.username.username}</p>
              <p>
                Last Updated:{' '}
                {new Date(blog.updated).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span>Status: {blog.published ? 'Published' : 'Hidden'}</span>

            <Link className={styles.editButton} to={`/blogs/${blog.id}/edit`}>
              <BiEdit className={styles.edit} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
