import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EditorProps } from "@tiptap/pm/view";
import { createElement, CSSProperties } from "react";
import { MouseEvent } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TipTapEditorProps: EditorProps = {
  attributes: {
    class: "prose-lg prose-headings:font-display focus:outline-none",
  },
};

type TipTapViewerProps = {
  style?: CSSProperties;
  className?: string;
  html?: string;
};

export const TipTapPreviewViewer = ({
  className,
  style,
  html,
}: TipTapViewerProps) => {
  return html
    ? createElement("div", {
        dangerouslySetInnerHTML: { __html: html },
        className: `ProseMirror ${className}`,
        style,
      })
    : null;
};

type Options = {
  // eslint-disable-next-line no-unused-vars
  callback?: ((...args: never[]) => unknown) | null;
  noPreventDefault?: boolean;
};

export const preventBubbling = (
  event: MouseEvent<HTMLElement>,
  options?: Options
) => {
  if (options?.noPreventDefault !== true) event.preventDefault();

  event.stopPropagation();

  // Perform any additional logic based on the options/callback if needed.
  if (options?.callback) options.callback();
};
