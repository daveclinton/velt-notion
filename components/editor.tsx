"use client";

import React from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File) => {
    const response = { url: "Hello" };
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: (() => {
      if (!initialContent) return undefined;
      try {
        return JSON.parse(initialContent);
      } catch (error) {
        console.error("Failed to parse initial content:", error);
        return undefined;
      }
    })(),
    uploadFile: handleUpload,
  });

  const handleChange = () => {
    try {
      const content = JSON.stringify(editor.document, null, 2);
      onChange(content);
    } catch (error) {
      console.error("Failed to stringify content:", error);
    }
  };

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleChange}
      />
    </div>
  );
};

export default Editor;
