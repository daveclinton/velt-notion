"use client";

import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { useDocument, useDocumentActions } from "@/lib/document-store";
import { useSetDocument } from "@veltdev/react";
import { useCoverImage } from "@/hooks/use-cover-image";

const DocumentIdPage = () => {
  const params = useParams<{ documentId: string }>();
  const document = useDocument(params.documentId);
  const { updateDocument } = useDocumentActions();
  const { url } = useCoverImage();

  const Editor = useMemo(
    () => dynamic(() => import("@/components/new-editor"), { ssr: false }),
    []
  );

  const onChange = (content: string) => {
    if (document) {
      updateDocument(params.documentId, { content });
    }
  };

  useSetDocument(params?.documentId, {
    documentName: document?.title || "Untitled",
  });

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

  if (document === null || !document) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor />
      </div>
    </div>
  );
};

export default DocumentIdPage;
