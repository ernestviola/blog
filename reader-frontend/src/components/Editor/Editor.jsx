import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Placeholder } from '@tiptap/extensions';
import styles from './editor.module.css';
import './tiptapGlobals.css';
import { useEffect } from 'react';

const Editor = ({
  color = 'black',
  editable = true,
  onChange,
  initialMarkdown = '',
  isDirty = false,
  setIsDirty = () => {
    return;
  },
}) => {
  const editor = useEditor({
    content: initialMarkdown,
    editable,
    contentType: 'markdown',
    extensions: [
      StarterKit,
      Markdown.configure({
        indentation: {
          style: 'space', // 'space' or 'tab'
          size: 2, // Number of spaces or tabs
        },
      }),
      Placeholder.configure({
        placeholder: 'Write some markdown...',
      }),
    ],

    onUpdate: ({ editor }) => {
      onChange?.(editor.getMarkdown());
    },
  });

  useEffect(() => {
    if (editable === false) return;
    function clearEditor() {
      editor.commands.clearContent();
      setIsDirty(false);
    }

    clearEditor();
  }, [editor, isDirty, setIsDirty]);

  if (!editor) return null;

  return (
    <EditorContent
      style={{ color }}
      className={styles.editor}
      editor={editor}
    />
  );
};

export default Editor;
