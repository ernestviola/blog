import Editor from '@components/Editor';
import styles from './commentItem.module.css';

const CommentItem = ({ data }) => {
  console.log(data);
  return (
    <div>
      <div>Username</div>
      <Editor color='white' editable={false} initialMarkdown={data.body} />
    </div>
  );
};

export default CommentItem;
