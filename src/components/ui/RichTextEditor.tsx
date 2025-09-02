
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

const RichTextEditor = ({ description, onChange }: { description: string, onChange: (richText: string) => void }) => {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false,
      }),
      Underline,
    ],
    content: description,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && description !== editor.getHTML()) {
      editor.commands.setContent(description);
    }
  }, [description, editor]);

  return (
    <div className="flex flex-col justify-stretch min-h-[250px]">
        <Toolbar editor={editor} content={description}/>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
