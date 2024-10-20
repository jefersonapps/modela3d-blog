import { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { MarkdownEditor } from "./markdown-editor";
import { Spinner } from "@/components/spinner";
import { useClerk, useUser } from "@clerk/nextjs";

type ContentDialogProps = {
  dialogTitle: string;
  placeholder: string;
  submitButtonText: string;
  content: string;
  onChangeContent: (content: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  publishing: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
};

export const ContentDialog = ({
  dialogTitle,
  placeholder,
  submitButtonText,
  content,
  onChangeContent,
  onSubmit,
  publishing,
  isDialogOpen,
  setIsDialogOpen,
}: ContentDialogProps) => {
  const { isLoaded, user } = useUser();

  return (
    <>
      {isLoaded && user?.id && (
        <div className="w-full">
          <Card className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-md">
            <Image
              src={user?.imageUrl || ""}
              alt={`Foto de ${user?.username}`}
              width={40}
              height={40}
              className="rounded-full"
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl px-4 py-2 text-start">
                  {user && user.username ? (
                    <span>
                      <span className="capitalize">{user.fullName}</span>,{" "}
                      <span className="lowercase">{placeholder}</span>
                    </span>
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </button>
              </DialogTrigger>

              <DialogContent className="w-full md:max-w-6xl bg-card p-3 md:p-4 rounded-md">
                <DialogHeader>
                  <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                <form
                  className="flex flex-col w-full space-y-4"
                  onSubmit={onSubmit}
                >
                  <MarkdownEditor
                    content={content}
                    onChangeContent={onChangeContent}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={publishing || !content}
                      className="font-semibold relative"
                    >
                      {publishing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Spinner />
                        </div>
                      )}
                      {submitButtonText}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      )}
    </>
  );
};

type CustomContentDialogProps = {
  dialogTitle: string;
  children: ReactNode;
  submitButtonText: string;
  content: string;
  onChangeContent: (content: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  publishing: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
};

export const CustomContentDialog = ({
  dialogTitle,
  children,
  submitButtonText,
  content,
  onChangeContent,
  onSubmit,
  publishing,
  isDialogOpen,
  setIsDialogOpen,
}: CustomContentDialogProps) => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const handleOpenChange = (isOpen: boolean) => {
    if (!user?.id) {
      openSignIn();
    } else {
      setIsDialogOpen(isOpen);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-full md:max-w-6xl bg-card p-3 md:p-4 rounded-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col w-full space-y-4" onSubmit={onSubmit}>
          <MarkdownEditor content={content} onChangeContent={onChangeContent} />
          <DialogFooter>
            <Button
              type="submit"
              disabled={publishing || !content}
              className="font-semibold relative"
            >
              {publishing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
