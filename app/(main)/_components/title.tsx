"use client";

import { useRef, useState } from "react";
import { updateDocument } from "@/lib/data";
import { useAuthStore } from "@/lib/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface TitleProps {
  initialData: Document;
}

interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  icon?: string;
  parentDocumentId?: string;
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("Please sign in to edit the title.");
      return;
    }

    setTitle(e.target.value);
    const updatedDoc = updateDocument(initialData.id, {
      title: e.target.value || "Untitled",
    });

    if (!updatedDoc) {
      toast.error("Failed to update title.");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-5 w-20 rounded-md" />;
};
