import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../http/delete-comment";
import { useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";

interface DeleteCommentProps {
  commentId?: string | null;
}

export function DeleteComment({ commentId }: DeleteCommentProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync: handleDeleteComment, isPending: deleting } = useMutation(
    {
      mutationFn: async () => {
        if (!user?.id || !commentId) return;
        await deleteComment(commentId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
        queryClient.invalidateQueries({
          queryKey: ["user-comments-with-parent-and-post"],
        });
        setOpen(false);
        toast.success("Comentário excluído com sucesso");
      },
      onError: () => {
        toast.error("Erro ao excluir commentagem, tente novamente.");
      },
    }
  );

  const confirmDelete = async () => {
    await handleDeleteComment();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          disabled={deleting}
          variant="ghost"
          className="flex justify-start items-center gap-1 text-primary w-full rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </Button>

        <DialogContent className="bg-card w-[90%] md-w-auto rounded-md">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
          </DialogHeader>

          <p>
            Você tem certeza que deseja excluir este comentário? Essa ação não
            pode ser desfeita.
          </p>

          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              className="font-semibold relative"
            >
              {deleting && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              Excluir
            </Button>
            <Button
              className="!ml-0"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
