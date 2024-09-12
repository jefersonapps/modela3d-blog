import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../http/update-post";
import { MarkdownEditor } from "./markdown-editor";

interface UpdatePostDialogProps {
  postId?: string | null;
  currentContent: string;
  onClose: () => void;
}

export function UpdatePostDialog({
  postId,
  currentContent,
  onClose,
}: UpdatePostDialogProps) {
  const [newContent, setNewContent] = useState<string>(currentContent);
  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdatePost, isPending: updating } = useMutation({
    mutationFn: async () => {
      if (postId && newContent) {
        await updatePost(postId, newContent);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating post:", error);
    },
  });

  const handleSubmit = async () => {
    await handleUpdatePost();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full md:max-w-6xl bg-card p-3 md:p-4 rounded-md">
        <DialogHeader>
          <DialogTitle>Editar Postagem</DialogTitle>
        </DialogHeader>

        <MarkdownEditor content={newContent} onChangeContent={setNewContent} />

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={updating || !newContent}
            className="font-semibold relative"
          >
            {updating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
