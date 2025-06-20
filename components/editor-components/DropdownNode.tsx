"use client";

import { Editor } from "@tiptap/react";
import { RefObject } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnumNodesTypeLabel, nodes, NodeType, NodeTypeEnum } from "./data";

interface SelectNodeProps {
  editor: Editor;
  container?: RefObject<HTMLDivElement>["current"];
}

const DropdownNode: React.FC<SelectNodeProps> = ({ editor }) => {
  let currentNode: NodeType | undefined = undefined;

  if (!editor.isActive("figure")) {
    if (editor.isActive(NodeTypeEnum.blockquote)) {
      currentNode = NodeTypeEnum.blockquote;
    } else if (editor.isActive("heading")) {
      const headingLevel = {
        1: NodeTypeEnum.h1,
        2: NodeTypeEnum.h2,
        3: NodeTypeEnum.h3,
      } as const;
      const selectedLevel = editor.state.selection.$head.parent.attrs.level;
      currentNode =
        headingLevel[selectedLevel as keyof typeof headingLevel] || undefined;
    } else if (editor.isActive(NodeTypeEnum.bulletList)) {
      currentNode = NodeTypeEnum.bulletList;
    } else if (editor.isActive(NodeTypeEnum.orderedList)) {
      currentNode = NodeTypeEnum.orderedList;
    } else if (editor.isActive(NodeTypeEnum.taskList)) {
      currentNode = NodeTypeEnum.taskList;
    } else if (editor.isActive(NodeTypeEnum.paragraph)) {
      currentNode = NodeTypeEnum.paragraph;
    } else if (editor.isActive(NodeTypeEnum.codeBlock)) {
      currentNode = NodeTypeEnum.codeBlock;
    }
  }

  const handleClick = (type: NodeType) => {
    const { commands } = editor;

    switch (type) {
      case NodeTypeEnum.paragraph:
        commands.setParagraph();
        break;

      case NodeTypeEnum.h1:
        commands.setHeading({ level: 1 });
        break;

      case NodeTypeEnum.h2:
        commands.setHeading({ level: 2 });
        break;

      case NodeTypeEnum.h3:
        commands.setHeading({ level: 3 });
        break;

      case NodeTypeEnum.taskList:
        commands.toggleTaskList();
        break;

      case NodeTypeEnum.bulletList:
        commands.toggleBulletList();
        break;

      case NodeTypeEnum.orderedList:
        commands.toggleOrderedList();
        break;

      case NodeTypeEnum.codeBlock:
        commands.toggleCodeBlock();
        break;

      case NodeTypeEnum.blockquote:
        commands.setBlockquote();
        break;

      default:
        break;
    }
  };

  const getCurrentNodeLabel = () => {
    return currentNode ? EnumNodesTypeLabel[currentNode] : "Text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="shrink-0 hover:bg-accent border-none shadow-[none] ring-0 rounded-none py-1 px-2 flex items-center gap-2"
          type="button"
        >
          <span className="h-5 flex items-center justify-center rounded-sm select-none">
            {getCurrentNodeLabel()}
          </span>
          <CaretSortIcon className="h-4 w-4 opacity-50 text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[9999]"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs font-normal py-1 px-2">
          Turn into
        </DropdownMenuLabel>
        {nodes.map((node, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => handleClick(node.type)}
            className="cursor-pointer flex justify-between items-center"
          >
            <span>{node.label}</span>
            {currentNode === node.type && <CheckIcon className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownNode;
