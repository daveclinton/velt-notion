"use client";

import { Card } from "@/components/ui/card";
import { useDocumentStore, useDocumentActions } from "@/lib/document-store";
import { useAuthStore } from "@/lib/auth-store";
import { FileText, PanelTopCloseIcon, Plus } from "lucide-react";
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <PanelTopCloseIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <h2 className="text-muted-foreground text-base sm:text-lg font-medium">
          Public Documents
        </h2>
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {recentDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              icon={doc.icon}
              coverImage={doc.coverImage}
              isMobile
            />
          ))}

          <Card
            className="flex-shrink-0 w-48 h-32 bg-card border-border hover:bg-accent transition-colors cursor-pointer group"
            onClick={handleCreateNew}
          >
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mb-2 group-hover:bg-muted/80 transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-foreground font-medium text-center text-sm">
                {isCreating ? "Creating..." : "New"}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Tablet and Desktop: Grid layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recentDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              icon={doc.icon}
              coverImage={doc.coverImage}
            />
          ))}

          <Card
            className="w-full h-40 bg-card border-border hover:bg-accent transition-colors cursor-pointer group"
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
    </div>
  );
}

interface DocumentCardProps {
  title: string;
  icon?: string;
  coverImage?: string;
  id: string;
  isMobile?: boolean;
}

function DocumentCard({
  title,
  icon,
  coverImage,
  id,
  isMobile = false,
}: DocumentCardProps) {
  const cardClasses = isMobile
    ? "flex-shrink-0 w-48 h-32 bg-card border-border hover:bg-accent transition-colors cursor-pointer overflow-hidden group"
    : "w-full h-40 bg-card border-border hover:bg-accent transition-colors cursor-pointer overflow-hidden group";

  return (
    <Link href={`/documents/${id}`}>
      <Card className={cardClasses}>
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
                  sizes={
                    isMobile
                      ? "192px"
                      : "(max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 192px, 160px"
                  }
                  crossOrigin="anonymous"
                />
                {icon && (
                  <div
                    className={`absolute top-2 left-2 ${
                      isMobile ? "w-6 h-6" : "w-8 h-8"
                    } bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center`}
                  >
                    <span className={isMobile ? "text-sm" : "text-lg"}>
                      {icon}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {icon ? (
                  <span className={isMobile ? "text-xl" : "text-3xl"}>
                    {icon}
                  </span>
                ) : (
                  <FileText
                    className={`${
                      isMobile ? "w-6 h-6" : "w-8 h-8"
                    } text-muted-foreground`}
                  />
                )}
              </div>
            )}
          </div>

          {/* Title Section */}
          <div className={`bg-card ${isMobile ? "p-3" : "p-4"}`}>
            <h3
              className={`text-foreground font-medium leading-tight line-clamp-2 ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              {title}
            </h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}
