"use client";
import { useState, useCallback, FormEvent } from "react";
import { slugifySentences } from "@/app/utils/helpers";
import { useUser } from "@clerk/nextjs";

import Image from "next/image";
import { Post } from "../db/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../http/create-post";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MarkdownEditor } from "./markdown-editor";
import { getUser } from "../http/get-user";

export function CreatePost() {
  const { isLoaded, user } = useUser();
  const [content, setContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const queryClient = useQueryClient();

  const onChangeContent = useCallback((value: string) => {
    setContent(value);
  }, []);

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["username"],
    queryFn: () => getUser({ userId: user?.id }),
    enabled: !!user?.id && isLoaded,
    staleTime: Infinity,
  });

  const displayName =
    (userData ? userData[0]?.userName : undefined) ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Anônimo";

  const createNewPost = async () => {
    if (!user?.id || !content || isLoadingUser) return;

    const postData: Post = {
      content,
      author: displayName,
      authorId: user.id,
      slug: slugifySentences(user.username + content.slice(0, 10)),
      userImageUrl: user?.imageUrl,
    };
    createPost(postData);
  };

  const { mutateAsync: handleCreatePost, isPending: publishing } = useMutation({
    mutationFn: createNewPost,
    onSuccess: () => {
      router.replace(
        pathname + "?" + createQueryString("page", (1).toString())
      );
      setOpen(false);
      setContent("");
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["posts", user?.id] });
        queryClient.invalidateQueries({ queryKey: ["totalOfPosts"] });
      }, 1000);
    },
    retry: 3,
    retryDelay: 1000,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleCreatePost();
  };

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

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full px-4 py-2 text-start">
                  {user && user.username ? (
                    <span>
                      <span className="capitalize">{user.fullName}</span>,
                      compartilhe sua experiência...
                    </span>
                  ) : (
                    <span>Compartilhe sua experiência...</span>
                  )}
                </button>
              </DialogTrigger>

              <DialogContent className="w-full md:max-w-6xl bg-card p-3 md:p-4 rounded-md">
                <DialogHeader>
                  <DialogTitle>Nova Postagem</DialogTitle>
                </DialogHeader>
                <form
                  className="flex flex-col w-full space-y-4"
                  onSubmit={handleSubmit}
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
                      Publicar
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
}
