"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useDocumentActions, useDocument } from "@/lib/document-store";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useEdgeStore } from "@/lib/edgeStore";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const params = useParams();
  const coverImage = useCoverImage();
  const { updateDocument } = useDocumentActions();
  const { edgestore } = useEdgeStore();
  const document = useDocument(params.documentId as string);
  const coverImageUrl = url || document?.coverImage;

  const onRemove = async () => {
    if (!coverImageUrl || !params.documentId) {
      toast.error("No cover image to remove");
      return;
    }

    try {
      if (coverImageUrl.startsWith("http")) {
        await edgestore.publicFiles.delete({
          url: coverImageUrl,
        });
      }
      const updatedDoc = updateDocument(params.documentId as string, {
        coverImage: undefined,
      });

      if (!updatedDoc) {
        throw new Error("Failed to update document");
      }

      toast.success("Cover image removed!");
    } catch (error) {
      console.error("Error removing cover image:", error);
      try {
        const updatedDoc = updateDocument(params.documentId as string, {
          coverImage: undefined,
        });

        if (updatedDoc) {
          toast.success("Cover image removed!");
        } else {
          toast.error("Failed to remove cover image.");
        }
      } catch (docError) {
        toast.error("Failed to remove cover image.");
      }
    }
  };

  const onReplace = () => {
    if (coverImageUrl) {
      coverImage.onReplace(coverImageUrl);
    } else {
      coverImage.onOpen();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !coverImageUrl && "h-[12vh]",
        coverImageUrl && "bg-muted"
      )}
    >
      {!!coverImageUrl && (
        <Image
          src={coverImageUrl}
          fill
          alt="Cover"
          className="object-cover"
          priority={true}
          onError={(e) => {
            console.error("Image load error:", e);
          }}
        />
      )}
      {!preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 transition-opacity duration-200">
          <Button
            onClick={onReplace}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {coverImageUrl ? "Change cover" : "Add cover"}
          </Button>
          {coverImageUrl && (
            <Button
              onClick={onRemove}
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
