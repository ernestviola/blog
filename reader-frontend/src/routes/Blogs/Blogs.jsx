import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { authFetch } from '@utils/auth.js';
import styles from './blogs.module.css';

import { BiHeart } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import Loading from '@components/Loading';

const Home = () => {
  const navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get('title');

  useEffect(() => {
    document.title = 'All Blogs';
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (title) params.set('title', title);
        params.set('page', page);

        const response = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/blogs?${params.toString()}`,
          {
            method: 'GET',
          },
        );

        if (!response.ok) {
          throw new Error('Issues getting the blogs.');
        }

        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        // network error try again
        setBlogs([]);
        console.error(error);
      } finally {
        setLoading(false);
        setFirstLoad(false);
        window.scrollTo(0, 0);
      }
    }

    const timeout = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate, title, page]);

  if (firstLoad)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <BiSearch className={styles.searchIcon} />
          <input
            type='text'
            className={styles.search}
            placeholder='search'
            value={title ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setSearchParams(value ? { title: value } : {});
              setPage(1);
            }}
          />
        </div>
      </div>
      {!loading && (
        <ul className={styles.blogs}>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <Link
                className={styles.blogItem}
                to={`/blogs/${blog.id}`}
                viewTransition
              >
                <div>
                  <div className={styles.blogStat}>
                    <BiHeart className={styles.heart} />
                    <span>{blog._count.blogLikes}</span>
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
      )}
      <div className={styles.pages}>
        <div className={styles.paginationControls}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={styles.turnPage}
          >
            <BiLeftArrow />
          </button>
          {page}
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className={styles.turnPage}
          >
            <BiRightArrow />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
