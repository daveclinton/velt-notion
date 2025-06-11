"use client";

import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { getDocumentById, updateDocument } from "@/lib/data";

const DocumentIdPage = () => {
  const params = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  // Fetch document using mock utility
  useEffect(() => {
    const doc = getDocumentById(params.documentId);
    setDocument(doc);
    setLoading(false);
  }, [params.documentId]);

  // Update document content using mock utility
  const onChange = (content: string) => {
    if (document) {
      updateDocument(params.documentId, { content });
    }
  };

  if (loading) {
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

  if (!document) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
