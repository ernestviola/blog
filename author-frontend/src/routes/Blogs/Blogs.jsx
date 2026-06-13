import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '@utils/auth.js';
import { BiHeart } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi';
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
      <h1>Blogs</h1>
      <ul className={styles.blogs}>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <div>
              <div>
                <BiHeart />
                <span>{blog.likes}</span>
              </div>
              <div>
                <BsEye />
                <span>{blog.views}</span>
              </div>
            </div>
            <h2>{blog.title}</h2>
            <span>{blog.user.username.username}</span>
            <span>
              {new Date(blog.updated).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <button>
              <BiEdit />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
