import Editor from '@components/Editor';
import styles from './commentItem.module.css';

const CommentItem = ({ data }) => {
  return (
    <div className={styles.container}>
      <div className={styles.username}>@{data.username.username}: </div>
      <div className={styles.commentContainer}>
        <Editor color='white' editable={false} initialMarkdown={data.body} />
      </div>
      <div className={styles.footer}></div>
    </div>
  );
};

export default CommentItem;
