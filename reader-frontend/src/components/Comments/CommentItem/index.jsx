import Editor from '@components/Editor';
import styles from './commentItem.module.css';

const CommentItem = ({ data }) => {
  return (
    <div className={styles.container}>
      <div>{data.username.username}: </div>
      <Editor color='white' editable={false} initialMarkdown={data.body} />
    </div>
  );
};

export default CommentItem;
