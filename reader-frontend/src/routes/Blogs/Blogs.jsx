import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { authFetch } from '@utils/auth.js';
import styles from './blogs.module.css';

import { BiHeart } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';

const Home = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get('title');

  useEffect(() => {
    document.title = 'Your Blogs';
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams();
        if (title) params.set('title', title);

        const response = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/blogs?${params.toString()}`,
          {
            method: 'GET',
          },
          navigate,
        );

        if (response.ok) {
          const data = await response.json();
          setBlogs(data.blogs);
        }
      } catch {
        // network error try again
        setBlogs([]);
      }
    }

    const timeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate, title]);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <BiSearch className={styles.searchIcon} />
          <input
            type='text'
            className={styles.search}
            placeholder='search'
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              setSearchParams(value ? { title: value } : {});
            }}
          />
        </div>
      </div>
      <ul className={styles.blogs}>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link className={styles.blogItem}>
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
                <p>Status: {blog.published ? 'Published' : 'Hidden'}</p>
                <p>Author: {blog.user.username.username}</p>
                <p>
                  Updated:{' '}
                  {new Date(blog.updated).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
