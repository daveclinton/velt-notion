"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { updateDocument } from "@/lib/data";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const CoverImageModal = () => {
  const params = useParams();
  const coverImage = useCoverImage();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        const updatedDoc = updateDocument(params.documentId as string, {
          coverImage: coverImage.url,
        });

        if (!updatedDoc) {
          throw new Error("Failed to update document");
        }

        toast.success("Cover image updated!");
        onClose();
      } catch (error) {
        toast.error("Failed to update cover image.");
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
      </DialogContent>
    </Dialog>
  );
};
