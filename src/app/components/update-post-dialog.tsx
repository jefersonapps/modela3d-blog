import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MdEditor, config } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import PT_BR from "../utils/locale/pt-br";
import { useCurrentTheme } from "../hooks/use-current-theme";
import { Spinner } from "@/components/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../http/update-post";

config({
  editorConfig: {
    languageUserDefined: {
      "pt-br": PT_BR,
    },
  },
});

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
  const theme = useCurrentTheme();
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
      <DialogContent className="sm:max-w-full md:max-w-6xl w-full bg-card">
        <DialogHeader>
          <DialogTitle>Editar Postagem</DialogTitle>
        </DialogHeader>

        <MdEditor
          modelValue={newContent}
          onChange={(value) => setNewContent(value)}
          theme={theme}
          language="pt-br"
          className="rounded-md"
          toolbarsExclude={[
            "image",
            "link",
            "save",
            "fullscreen",
            "pageFullscreen",
            "catalog",
            "htmlPreview",
            "github",
          ]}
        />

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
