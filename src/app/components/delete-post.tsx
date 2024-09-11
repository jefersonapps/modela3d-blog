import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../http/delete-post";
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

interface DeletePostProps {
  postId?: string | null;
}

export function DeletePost({ postId }: DeletePostProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync: handleDeletePost, isPending: deleting } = useMutation({
    mutationFn: async () => {
      if (!user?.id || !postId) return;
      await deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });

  const confirmDelete = async () => {
    await handleDeletePost();
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

        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
          </DialogHeader>

          <p>
            Você tem certeza que deseja excluir esta postagem? Essa ação não
            pode ser desfeita.
          </p>

          <DialogFooter>
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
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
