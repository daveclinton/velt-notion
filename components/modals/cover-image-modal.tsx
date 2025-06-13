"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { useDocumentActions } from "@/lib/document-store";
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgeStore";
import { toast } from "sonner";

export const CoverImageModal = () => {
  const params = useParams();
  const coverImage = useCoverImage();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateDocument } = useDocumentActions();
  const { edgestore } = useEdgeStore();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      try {
        const uploadOptions: any = {};
        if (coverImage.url) {
          uploadOptions.replaceTargetUrl = coverImage.url;
        }

        const res = await edgestore.publicFiles.upload({
          file,
          options: uploadOptions,
          onProgressChange: (progress) => {
            console.log("Upload progress:", progress);
          },
        });

        const updatedDoc = updateDocument(params.documentId as string, {
          coverImage: res.url,
        });

        if (!updatedDoc) {
          throw new Error("Failed to update document");
        }

        toast.success("Cover image uploaded successfully!");
        onClose();
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload cover image. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
        {isSubmitting && (
          <div className="text-center text-sm text-muted-foreground">
            Uploading...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
