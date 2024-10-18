"use client";
import { useState, useCallback, FormEvent } from "react";
import { slugifySentences } from "@/app/utils/helpers";
import { useUser } from "@clerk/nextjs";

import { Post } from "../db/actions";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../http/create-post";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getUser } from "../http/get-user";
import { toast } from "sonner";
import { ContentDialog } from "./content-dialog";

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
        toast.success("Postagem criada com sucesso");
      }, 1000);
    },
    onError: () => toast.error("Erro ao criar postagem"),
    retry: 3,
    retryDelay: 1000,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleCreatePost();
  };

  return (
    <ContentDialog
      placeholder="Compartilhe sua experiência..."
      dialogTitle="Nova Postagem"
      submitButtonText="Publicar"
      content={content}
      onChangeContent={onChangeContent}
      onSubmit={handleSubmit}
      publishing={publishing}
      isDialogOpen={open}
      setIsDialogOpen={setOpen}
    />
  );
}
