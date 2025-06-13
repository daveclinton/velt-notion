"use client";

import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";
import { useMemo, useEffect, useCallback } from "react";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";
import React from "react";
import { useDocument, useDocumentActions } from "@/lib/document-store";

const DocumentIdPage = () => {
  const params = useParams<{ documentId: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { updateDocument } = useDocumentActions();

  const document = useDocument(params.documentId);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  useEffect(() => {
    if (
      document &&
      user &&
      document.userId !== user.id &&
      !document.isPublished
    ) {
      toast.error("You don't have permission to view this document");
      router.push("/documents");
    }
  }, [document, user, router]);

  useEffect(() => {
    if (!isAuthenticated && document && !document.isPublished) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, document, router]);

  const onChange = useCallback(
    (content: string) => {
      if (!params.documentId) return;
      if (document && user && document.userId === user.id) {
        try {
          const updatedDoc = updateDocument(params.documentId, { content });
          if (!updatedDoc) {
            toast.error("Failed to update document");
          }
        } catch (error) {
          console.error("Failed to update document:", error);
          toast.error("Failed to save changes");
        }
      }
    },
    [params.documentId, document, user, updateDocument]
  );

  // Show loading skeleton while document is being fetched
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-4 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  // Document not found
  if (document === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <h2 className="text-lg font-medium">Document not found</h2>
        <p className="text-sm text-muted-foreground">
          The document you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
      </div>
    );
  }

  const canEdit = user && document.userId === user.id;
  const isPreview = !canEdit || document.isPublished;

  return (
    <div className="pb-40">
      <Cover preview={isPreview} url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview={isPreview} initialData={document} />
        <Editor
          editable={(canEdit && !isPreview) as boolean | undefined}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
