import Editor from '@components/Editor';
import { useState, useEffect } from 'react';
import styles from './view.module.css';
import { useNavigate, useParams } from 'react-router';
import Loading from '@components/Loading';
import BackButton from '@components/BackButton';
import Comments from '@components/Comments';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { authFetch } from '@utils/auth.js';
import { useAuth } from '@contexts/AuthContext.jsx';
import UsernameSignUp from '@components/UsernameSignUp';

const View = () => {
  const navigate = useNavigate();

  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [openUsernameSignUp, setOpenUsernameSignUp] = useState(false);

  const { usernameId } = useAuth();

  useEffect(() => {
    document.title = blog?.title ?? '';
  }, [blog]);

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
        setBlog(data.blog);
        setLiked(data.blog.likedByUser);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBlogData();
  }, [blogId, navigate]);

  const handleBlogLike = async () => {
    if (usernameId === null) {
      setOpenUsernameSignUp(true);
      return;
    }
    const prevLikedState = liked;
    setLiked(!liked);
    // prevLikedState was false then add 1
    const newLikeCount = prevLikedState
      ? blog._count.blogLikes - 1
      : blog._count.blogLikes + 1;
    setBlog((prev) => ({
      ...prev,
      _count: { ...prev._count, blogLikes: newLikeCount },
    }));
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}/like`,
        {
          method: prevLikedState ? 'DELETE' : 'POST',
        },
      );

      if (!response.ok) {
        setLiked(prevLikedState);
        throw new Error('Issues liking the blog.');
      }
    } catch (error) {
      console.error(error);
      setLiked(prevLikedState);
    }
  };

  if (blog === null) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <BackButton />
        </div>
        <div className={styles.body}>
          <h1>{blog.title}</h1>

          <Editor editable={false} initialMarkdown={blog.body} color='white' />
        </div>
        <div className={styles.stats}>
          <button
            className={styles.blogStat}
            title='like'
            onClick={handleBlogLike}
          >
            {liked ? (
              <BiSolidHeart className={styles.heart} />
            ) : (
              <BiHeart className={styles.heart} />
            )}
            <span>{blog._count.blogLikes}</span>
          </button>
          <div className={styles.blogStat} title='views'>
            <BsEye className={styles.eye} />
            <span>{blog.views}</span>
          </div>
        </div>
        <div className={styles.footer}>
          <Comments />
        </div>
        <UsernameSignUp
          open={openUsernameSignUp}
          setOpen={setOpenUsernameSignUp}
        />
      </div>
    </>
  );
};

export default View;
