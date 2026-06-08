import { useState, useEffect } from 'react';

const New = () => {
  const [markdown, setMarkdown] = useState('');
  const [title, setTitle] = useState('Untitled');

  useEffect(() => {
    document.title = 'New Blog';
  }, []);

  return (
    <div>
      <h1
        contentEditable={true}
        onInput={(e) => setTitle(e.currentTarget.textContent)}
      >
        Untitled
      </h1>
      <div>{/* delete button here */}</div>
      <div>
        <button onClick={() => console.log({ title, markdown })}>Save</button>
        <button>Publish</button>
      </div>
    </div>
  );
};

export default New;
