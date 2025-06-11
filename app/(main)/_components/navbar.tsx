"use client";

import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";
import { Menu } from "./menu";
import { Publish } from "./publish";
import { useDocument } from "@/lib/document-store";
import {
  VeltCommentTool,
  VeltPresence,
  VeltSidebarButton,
} from "@veltdev/react";
import { Banner } from "./banner";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams<{ documentId: string }>();
  const document = useDocument(params.documentId);

  // Show loading skeleton while document is being fetched
  if (document === undefined) {
    return (
      <nav
        className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full
        flex items-center justify-between"
      >
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  // Document not found
  if (!document) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <VeltPresence />
            <div className="toolbar flex">
              <VeltSidebarButton />
              <VeltCommentTool />
            </div>
            <Publish initialData={document} />
            <Menu documentId={document.id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document.id} />}
    </>
  );
};
