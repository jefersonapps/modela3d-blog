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
import { updateComment } from "../http/update-comment";
import { MarkdownEditor } from "./markdown-editor";
import { toast } from "sonner";

interface UpdateCommentDialogProps {
  commentId?: string | null;
  userId?: string;
  currentContent: string;
  onClose: () => void;
}

export function UpdateCommentDialog({
  commentId,
  userId,
  currentContent,
  onClose,
}: UpdateCommentDialogProps) {
  const [newContent, setNewContent] = useState<string>(currentContent);
  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdateComment, isPending: updating } = useMutation(
    {
      mutationFn: async () => {
        if (commentId && newContent) {
          await updateComment(commentId, newContent);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["comments"],
        });

        queryClient.invalidateQueries({
          queryKey: ["user-comments-with-parent-and-post", userId],
        });

        onClose();
        toast.success("Comentário editado com sucesso");
      },
      onError: () => {
        toast.error("Erro ao editar commentagem, tente novamente.");
      },
    }
  );

  const handleSubmit = async () => {
    await handleUpdateComment();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full md:max-w-6xl bg-card p-3 md:p-4 rounded-md">
        <DialogHeader>
          <DialogTitle>Editar Commentagem</DialogTitle>
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
