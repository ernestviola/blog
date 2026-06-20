import { BiHeart } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';

import Editor from '@components/Editor';
import styles from './commentItem.module.css';

const CommentItem = ({ data }) => {
  console.log(data);
  return (
    <div className={styles.container}>
      <div className={styles.username}>@{data.username.username}: </div>
      <div className={styles.commentContainer}>
        <Editor color='white' editable={false} initialMarkdown={data.body} />
      </div>
      <div className={styles.footer}>
        <div className={styles.heartContainer}>
          <button className={styles.heartButton}>
            <BiHeart />
          </button>
          <span>{data._count.commentLikes}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
