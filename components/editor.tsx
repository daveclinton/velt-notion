"use client";

import React, { useEffect, useState, useCallback } from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  TextAlignButton,
  useCreateBlockNote,
  AddCommentButton,
} from "@blocknote/react";
import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";
import {
  useAddCommentAnnotation,
  useVeltInitState,
  useCommentUtils,
} from "@veltdev/react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

function useVeltBlockNoteComments(editor: BlockNoteEditor | null) {
  const { addCommentAnnotation } = useAddCommentAnnotation();
  const isVeltInitialized = useVeltInitState();
  const commentUtils = useCommentUtils();

  const [selectedText, setSelectedText] = useState("");
  const [showCommentButton, setShowCommentButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!editor || !isVeltInitialized) return;

    const handleSelectionChange = () => {
      try {
        const selection = window.getSelection();
        const selectedText = selection?.toString() || "";

        if (selectedText.trim().length > 0) {
          setSelectedText(selectedText.trim());

          // Get selection position for button placement
          const range = selection?.getRangeAt(0);
          if (range) {
            const rect = range.getBoundingClientRect();
            setButtonPosition({
              x: Math.min(rect.right + 10, window.innerWidth - 300), // Prevent overflow
              y: Math.max(rect.top - 10, 10), // Prevent negative positioning
            });
            setShowCommentButton(true);
          }
        } else {
          setSelectedText("");
          setShowCommentButton(false);
        }
      } catch (error) {
        console.error("Selection error:", error);
        setShowCommentButton(false);
      }
    };

    // Listen to document selection changes
    document.addEventListener("selectionchange", handleSelectionChange);

    // Also listen to click events to hide button when clicking elsewhere
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".velt-comment-button-container")) {
        // Small delay to allow selection to update first
        setTimeout(() => {
          const selection = window.getSelection();
          if (!selection || selection.toString().trim().length === 0) {
            setShowCommentButton(false);
            setSelectedText("");
          }
        }, 100);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [editor, isVeltInitialized]);

  const addComment = useCallback(async () => {
    if (!selectedText || !isVeltInitialized) return;

    try {
      const annotationId = `comment-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const context = {
        selectedText: selectedText,
        timestamp: Date.now(),
        selectionLength: selectedText.length,
      };

      // Use the hook instead of direct client method
      await addCommentAnnotation({
        annotationId,
        context,
      });

      window.getSelection()?.removeAllRanges();
      setSelectedText("");
      setShowCommentButton(false);

      console.log(
        "Comment added successfully for:",
        selectedText.substring(0, 50) + "..."
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }, [selectedText, isVeltInitialized, addCommentAnnotation]);

  const hideCommentButton = useCallback(() => {
    setShowCommentButton(false);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  }, []);

  // Keyboard shortcut for adding comments (Cmd/Ctrl + M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "m" && selectedText) {
        e.preventDefault();
        addComment();
      }
      // Escape key to hide comment button
      if (e.key === "Escape" && showCommentButton) {
        hideCommentButton();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedText, addComment, showCommentButton, hideCommentButton]);

  return {
    selectedText,
    showCommentButton,
    buttonPosition,
    addComment,
    hideCommentButton,
    isVeltInitialized,
    commentUtils, // You can use this for additional comment utilities if needed
  };
}

// Floating Comment Button Component
function FloatingCommentButton({
  show,
  position,
  onAddComment,
  onCancel,
  selectedText,
}: {
  show: boolean;
  position: { x: number; y: number };
  onAddComment: () => void;
  onCancel: () => void;
  selectedText: string;
}) {
  if (!show) return null;

  return (
    <div
      className="velt-comment-button-container fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: "280px",
      }}
    >
      <Button
        size="sm"
        onClick={onAddComment}
        className="h-7 px-2 bg-blue-600 hover:bg-blue-700 text-white text-xs"
      >
        <MessageCircle className="h-3 w-3 mr-1" />
        Comment
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCancel}
        className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
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

  const { isVeltInitialized } = useVeltBlockNoteComments(editor);

  if (!isVeltInitialized) {
    return (
      <div className="relative">
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          onChange={handleChange}
        />
        <div className="absolute top-2 right-2 text-sm text-gray-500">
          Initializing comments...
        </div>
      </div>
    );
  }

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={handleChange}
      formattingToolbar={false}
      comments
    >
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key={"blockTypeSelect"} />
            <FileCaptionButton key={"fileCaptionButton"} />
            <FileReplaceButton key={"replaceFileButton"} />

            <BasicTextStyleButton
              basicTextStyle={"bold"}
              key={"boldStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"italic"}
              key={"italicStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"underline"}
              key={"underlineStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"strike"}
              key={"strikeStyleButton"}
            />

            <BasicTextStyleButton
              key={"codeStyleButton"}
              basicTextStyle={"code"}
            />

            <TextAlignButton
              textAlignment={"left"}
              key={"textAlignLeftButton"}
            />
            <TextAlignButton
              textAlignment={"center"}
              key={"textAlignCenterButton"}
            />
            <TextAlignButton
              textAlignment={"right"}
              key={"textAlignRightButton"}
            />

            <ColorStyleButton key={"colorStyleButton"} />

            <CreateLinkButton key={"createLinkButton"} />
            <AddCommentButton key={"addCommentButton"} />
          </FormattingToolbar>
        )}
      />
    </BlockNoteView>
  );
};

export default Editor;
