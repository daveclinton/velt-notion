"use client";

import React, { useRef } from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { MessageSquarePlus, MoreHorizontal } from "lucide-react";
import DropdownStyle from "../editor-components/DropdownStyle";
import DropdownNode from "../editor-components/DropdownNode";
import Marks from "../editor-components/Marks";
import { TextSelection } from "prosemirror-state";
import "tippy.js/animations/scale-subtle.css";

import DropdownLinkInput from "../editor-components/DropdownLinkInput";
import {
  TiptapVeltCommentConfig,
  triggerAddComment,
} from "@veltdev/tiptap-velt-comments";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NodeTypeEnum } from "../editor-components/data";

const TextMenu = ({ editor }: { editor: Editor | null }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  const handleAddCommentClick = () => {
    if (editor && editor.state.selection && !editor.state.selection.empty) {
      const config: TiptapVeltCommentConfig = {};
      triggerAddComment(editor, config);
    }
  };
  const hasSelection = editor.state.selection && !editor.state.selection.empty;

  return (
    <React.Fragment>
      <BubbleMenu
        className="text-menu-shadow z-[999999] bg-background rounded-md cursor-auto max-w-[95vw] overflow-hidden"
        editor={editor}
        tippyOptions={{
          popperOptions: {
            modifiers: [
              { name: "eventListeners", options: { scroll: true } },
              {
                name: "preventOverflow",
                options: {
                  boundary: "viewport",
                  padding: 8,
                },
              },
            ],
          },
          duration: 100,
          animation: "scale-subtle",
          maxWidth: "95vw",
        }}
        pluginKey={"TextMenu"}
        shouldShow={({ editor }) => {
          const selection = editor.state.selection;
          const isTextSelection = selection instanceof TextSelection;

          if (
            isTextSelection &&
            selection.ranges[0].$from.pos === selection.ranges[0].$to.pos
          ) {
            return false;
          }

          if (isTextSelection) {
            return (
              editor.isActive("heading") ||
              (!editor.isActive("figure") &&
                editor.isActive(NodeTypeEnum.blockquote)) ||
              (!editor.isActive("figure") &&
                editor.isActive(NodeTypeEnum.bulletList)) ||
              (!editor.isActive("figure") &&
                editor.isActive(NodeTypeEnum.orderedList)) ||
              (!editor.isActive("figure") &&
                editor.isActive(NodeTypeEnum.taskList)) ||
              editor.isActive(NodeTypeEnum.paragraph) ||
              editor.isActive(NodeTypeEnum.codeBlock)
            );
          }
          return false;
        }}
      >
        <div
          ref={containerRef}
          className="cursor-auto z-10 w-full relative overflow-hidden"
        >
          {containerRef.current && (
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              {/* Primary controls - always visible */}
              <div className="flex items-center shrink-0">
                <DropdownNode
                  container={containerRef.current}
                  editor={editor}
                />
                <div className="bg-accent w-[1px] h-6 shrink-0 mx-1" />
                <Marks editor={editor} />
              </div>

              {/* Secondary controls - hidden on very small screens */}
              <div className="hidden xs:flex items-center shrink-0">
                <div className="bg-accent w-[1px] h-6 shrink-0 mx-1" />
                <DropdownLinkInput
                  container={containerRef.current}
                  editor={editor}
                />
              </div>

              {/* Tertiary controls - hidden on small screens */}
              <div className="hidden sm:flex items-center shrink-0">
                <div className="bg-accent w-[1px] h-6 shrink-0 mx-1" />
                <div className="flex items-center px-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddCommentClick}
                    disabled={!hasSelection}
                    className={cn(
                      "h-8 px-2 text-xs font-medium transition-all duration-200 whitespace-nowrap",
                      hasSelection
                        ? "text-foreground hover:bg-accent hover:text-accent-foreground"
                        : "text-muted-foreground cursor-not-allowed opacity-50"
                    )}
                    title={
                      hasSelection
                        ? "Add comment to selection"
                        : "Select text to add comment"
                    }
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
                    <span className="hidden md:inline">Comment</span>
                  </Button>
                </div>
              </div>

              {/* Style controls - hidden on mobile */}
              <div className="hidden md:flex items-center shrink-0">
                <div className="bg-accent w-[1px] h-6 shrink-0 mx-1" />
                <DropdownStyle
                  container={containerRef.current}
                  editor={editor}
                />
              </div>

              {/* Overflow indicator for small screens */}
              <div className="flex sm:hidden items-center shrink-0 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  title="More options available on larger screens"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </BubbleMenu>
    </React.Fragment>
  );
};

export default TextMenu;
