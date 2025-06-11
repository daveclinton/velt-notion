"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { createDocument, Document, getDocuments } from "@/lib/data";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      try {
        const userDocs = getDocuments(user.id);
        setDocuments(userDocs);
      } catch (error) {
        console.error("Failed to load documents:", error);
        toast.error("Failed to load documents");
      }
    }
  }, [user?.id]);

  const onCreate = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const newDocument = createDocument(user.id, "Untitled");

      if (newDocument) {
        setDocuments((prev) => [...prev, newDocument]);
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

      {documents.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          You have {documents.length} document
          {documents.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default DocumentsPage;
