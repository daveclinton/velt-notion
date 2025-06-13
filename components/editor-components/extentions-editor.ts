import HorizontalRule from "@tiptap/extension-horizontal-rule";

import Dropcursor from "@tiptap/extension-dropcursor";
import History from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";
import { TiptapExtensions } from "./extensions";
import { TiptapVeltComments } from "@veltdev/tiptap-velt-comments";

export const TipTapEditorExtensions = [
  ...TiptapExtensions,
  TiptapVeltComments,
  History.configure({
    depth: 20,
  }),
  Dropcursor.configure({
    color: "#7dd3fc",
    width: 2,
  }),
  HorizontalRule,
  Placeholder.configure({
    placeholder: ({ node }: any) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }

      return "Press '/' for commands, or enter some text...";
    },
  }),
];
