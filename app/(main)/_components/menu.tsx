// app/(main)/_components/menu.tsx
"use client";

import { useRouter } from "next/navigation";
import { archiveDocument } from "@/lib/data";
import { useAuthStore } from "@/lib/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
  documentId: string;
}

export const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const onArchive = () => {
    const success = archiveDocument(documentId);

    toast.promise(Promise.resolve(success), {
      loading: "Moving to trash...",
      success: success ? "Note moved to trash!" : "Failed to archive note.",
      error: "Failed to archive note.",
    });

    if (success) {
      router.push("/documents");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.name || "Anonymous"}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
