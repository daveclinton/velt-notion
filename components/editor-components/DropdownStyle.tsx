import { Editor } from "@tiptap/react";
import { CaretSortIcon } from "@radix-ui/react-icons";

import { RefObject } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colors } from "./data";

interface DropdownStyleProps {
  editor: Editor;
  container?: RefObject<HTMLDivElement>["current"];
}

const DropdownStyle: React.FC<DropdownStyleProps> = ({ editor }) => {
  const currentTextColor = editor.getAttributes("textStyle").color;
  const currentHighlightColor = editor.getAttributes("highlight").color;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="shrink-0 hover:bg-accent border-none shadow-[none] ring-0 rounded-none py-1 px-2 flex items-center gap-2"
          type="button"
        >
          <span
            className="w-5 h-5 flex items-center justify-center rounded-sm select-none font-semibold"
            style={{
              color: currentTextColor || "inherit",
              background: currentHighlightColor || "transparent",
            }}
          >
            A
          </span>
          <CaretSortIcon className="h-4 w-4 opacity-50 text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="overflow-hidden z-[9999] max-h-[500px] p-0 w-48"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="max-h-[500px] overflow-y-auto p-1">
          <DropdownMenuLabel className="text-xs font-normal py-1 px-2">
            TEXT COLOR
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().unsetColor().run();
            }}
            className="cursor-pointer flex gap-2 items-center"
          >
            <span className="p-1 border rounded-sm w-6 h-6 text-sm flex items-center justify-center border-gray-300 font-semibold">
              A
            </span>
            Default
          </DropdownMenuItem>
          {colors.map(({ label, value }, idx) => (
            <DropdownMenuItem
              key={`color-${idx}`}
              onClick={() => {
                editor.chain().focus().setColor(value).run();
              }}
              className="cursor-pointer flex gap-2 items-center"
            >
              <span
                className="p-1 border rounded-sm w-6 h-6 text-sm flex items-center justify-center border-gray-300 font-semibold"
                style={{
                  color: value,
                }}
              >
                A
              </span>
              {label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs font-normal py-1 px-2">
            BACKGROUND
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
            }}
            className="cursor-pointer flex gap-2 items-center"
          >
            <span className="p-1 border rounded-sm w-6 h-6 text-sm flex items-center justify-center border-gray-300 font-semibold">
              A
            </span>
            Default
          </DropdownMenuItem>
          {colors.map(({ label, value }, idx) => (
            <DropdownMenuItem
              key={`background-${idx}`}
              onClick={() => {
                editor.commands.setHighlight({ color: value });
              }}
              className="cursor-pointer flex gap-2 items-center"
            >
              <span
                className="p-1 border rounded-sm w-6 h-6 text-sm flex items-center justify-center border-gray-300 font-semibold"
                style={{
                  background: value,
                }}
              >
                A
              </span>
              {label}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownStyle;
