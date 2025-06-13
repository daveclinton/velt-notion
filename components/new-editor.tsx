"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { TipTapEditorExtensions } from "@/components/editor-components/extentions-editor";
import TextMenu from "./bubble-menu/TextMenu";
import { useCommentAnnotations } from "@veltdev/react";
import { useEffect } from "react";
import { highlightComments } from "@veltdev/tiptap-velt-comments";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export default function Editor({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) {
  const annotations = useCommentAnnotations();
  const editor = useEditor({
    extensions: TipTapEditorExtensions,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm pl-[32px] sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none dark:prose-invert",
      },
    },
    content: initialContent,
    onUpdate: ({ editor }) => {
      try {
        const htmlContent = editor.getHTML();
        onChange(htmlContent);
      } catch (error) {
        console.error("Failed to get editor content:", error);
      }
    },
  });
  useEffect(() => {
    if (editor && annotations && annotations.length > 0) {
      try {
        highlightComments(editor, annotations);
      } catch (error) {
        console.error("Error highlighting comments:", error);
      }
    }
  }, [editor, annotations]);
  return (
    <div>
      <TextMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
