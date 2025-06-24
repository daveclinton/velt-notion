import { RefObject, useState } from "react";
import { type Editor } from "@tiptap/core";
import {
  ArrowTopRightIcon,
  CheckIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { preventBubbling } from "@/lib/utils";

interface DropdownLinkInputProps {
  editor: Editor;
  container?: RefObject<HTMLDivElement>["current"];
}

const DropdownLinkInput: React.FC<DropdownLinkInputProps> = ({ editor }) => {
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenChange = (open: boolean) => setIsOpen(open);

  const setLink = () => {
    if (input.trim()) {
      editor.commands.setLink({ href: input.trim(), target: "_blank" });
      setInput("");
      setIsOpen(false);
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setLink();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="gap-2 shrink-0 hover:bg-accent border-none shadow-[none] ring-0 rounded-none py-1 px-2 flex items-center"
          type="button"
        >
          <ArrowTopRightIcon />
          Link
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="bottom" sideOffset={4}>
        <div
          onClick={preventBubbling}
          onKeyDown={handleKeyDown}
          className="flex gap-2 w-full min-w-[300px] p-1"
        >
          <Input
            onChange={(e) => setInput(e.target.value)}
            value={editor.getAttributes("link").href ?? input}
            placeholder="Paste link"
            className="rounded-none focus-visible:ring-0 border-none bg-transparent flex-1"
            autoFocus
          />
          {editor.isActive("link") ? (
            <button
              type="button"
              onClick={unsetLink}
              className="w-[36px] h-[36px] p-2 hover:bg-accent cursor-pointer border-l flex items-center justify-center"
              title="Remove link"
            >
              <Cross1Icon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              className="w-[36px] h-[36px] p-2 hover:bg-accent cursor-pointer border-l flex items-center justify-center"
              onClick={setLink}
              title="Set link"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownLinkInput;
