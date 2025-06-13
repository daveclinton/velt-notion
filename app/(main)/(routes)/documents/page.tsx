"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { useDocuments, useDocumentActions } from "@/lib/document-store";
import RecentlyVisited from "@/components/recently-visited";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const documents = useDocuments(user?.id || "");
  const { createDocument } = useDocumentActions();

  const onCreate = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const newDocument = createDocument(user.id, "");
      if (newDocument) {
        toast.success("New note created!");
        router.push(`/documents/${newDocument.id}`);
      } else {
        toast.error("Failed to create document");
      }
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create a new note");
    } finally {
      setIsLoading(false);
    }
  };

  if (documents.length > 0) {
    return (
      <div className="h-full p-8">
        <RecentlyVisited />

        <div className="max-w-7xl flex justify-between mx-auto">
          <div>
            <p className="text-sm text-muted-foreground mt-1">
              You have {documents.length} document
              {documents.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button onClick={onCreate} disabled={isLoading}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create a note"}
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state if no documents
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        alt="empty"
        height="300"
        priority
        width="300"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        alt="empty"
        height="300"
        priority
        width="300"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.name}&apos;s Notion
      </h2>
      <Button onClick={onCreate} disabled={isLoading}>
        <PlusCircle className="h-4 w-4 mr-2" />
        {isLoading ? "Creating..." : "Create a note"}
      </Button>
    </div>
  );
};

export default DocumentsPage;
