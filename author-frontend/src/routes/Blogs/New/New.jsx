import Editor from '@components/Editor';
import { useState, useEffect } from 'react';
import styles from './new.module.css';

const New = () => {
  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    document.title = 'New Blog';
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          className={styles.titleInput}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder='Untitled'
        />
      </div>

      <div className={styles.body}>
        <Editor onChange={setMarkdown} />
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerButtons}>
          <div className={styles.left}>
            <button className={styles.delete} title='Delete'>
              Delete
            </button>
          </div>
          <div className={styles.right}>
            <button
              className={styles.save}
              title='Save'
              onClick={() => console.log({ title, markdown })}
            >
              Save
            </button>
            <button className={styles.publish} title='Publish'>
              Publish
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default New;
