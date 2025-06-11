"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useAuthStore } from "@/lib/auth-store";
import { useDocumentActions, Document } from "@/lib/document-store";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PublishProps {
  initialData: Document;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { publishDocument, updateDocument } = useDocumentActions();

  const url = `${origin}/preview/${initialData.id}`;

  const onPublish = () => {
    if (!user) {
      toast.error("Please sign in to publish a note.");
      return;
    }

    setIsSubmitting(true);

    const updatedDoc = publishDocument(initialData.id);

    toast.promise(Promise.resolve(updatedDoc), {
      loading: "Publishing...",
      success: updatedDoc ? "Note published!" : "Failed to publish note.",
      error: "Failed to publish note.",
    });

    setIsSubmitting(false);
  };

  const onUnpublish = () => {
    if (!user) {
      toast.error("Please sign in to unpublish a note.");
      return;
    }

    setIsSubmitting(true);

    const updatedDoc = updateDocument(initialData.id, { isPublished: false });

    toast.promise(Promise.resolve(updatedDoc), {
      loading: "Unpublishing...",
      success: updatedDoc ? "Note unpublished!" : "Failed to unpublish note.",
      error: "Failed to unpublish note.",
    });

    setIsSubmitting(false);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse w-4 h-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                disabled
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
