"use client";

import { Card } from "@/components/ui/card";
import { useDocumentStore, useDocumentActions } from "@/lib/document-store";
import { useAuthStore } from "@/lib/auth-store";
import { Clock, FileText, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export default function RecentlyVisited() {
  const documents = useDocumentStore((state) => state.getDocuments());
  const { createDocument } = useDocumentActions();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const recentDocuments = documents
    .filter((doc) => !doc.isArchived)
    .slice(0, 5);

  const handleCreateNew = async () => {
    if (!user?.id) return;

    setIsCreating(true);
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
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-muted-foreground text-lg font-medium">
          Recently visited
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {recentDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            title={doc.title}
            icon={doc.icon}
            coverImage={doc.coverImage}
          />
        ))}

        {/* Add New Card */}
        <Card
          className="flex-shrink-0 w-64 h-40 bg-card border-border hover:bg-accent transition-colors cursor-pointer group"
          onClick={handleCreateNew}
        >
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-3 group-hover:bg-muted/80 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-foreground font-medium text-center">
              {isCreating ? "Creating..." : "New"}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface DocumentCardProps {
  title: string;
  icon?: string;
  coverImage?: string;
  id: string;
}

function DocumentCard({ title, icon, coverImage, id }: DocumentCardProps) {
  return (
    <Link href={`/documents/${id}`}>
      <Card className="flex-shrink-0 w-64 h-40 bg-card border-border hover:bg-accent transition-colors cursor-pointer overflow-hidden group">
        <div className="h-full flex flex-col">
          {/* Cover Image Section */}
          <div className="flex-1 relative bg-muted">
            {coverImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={coverImage || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="256px"
                  crossOrigin="anonymous"
                />
                {icon && (
                  <div className="absolute top-2 left-2 w-8 h-8 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-lg">{icon}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {icon ? (
                  <span className="text-3xl">{icon}</span>
                ) : (
                  <FileText className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Title Section */}
          <div className="p-4 bg-card">
            <h3 className="text-foreground font-medium text-sm leading-tight line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}
