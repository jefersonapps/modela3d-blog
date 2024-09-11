"use client";

import { useUser } from "@clerk/nextjs";
import { PostUserInfo } from "./post-user-info";
import { ContentPreview } from "./content-preview";
import { PostActions } from "./post-actions";
import { PostBottomActions } from "./post-bottom-actions";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../http/get-posts";
import { PostSkeleton } from "./skeletons/post-skeleton";
import { getPostsForUnauthenticatedUser } from "../http/get-posts-for-unauthenticated-user";
import { Card } from "@/components/ui/card";
import { Post } from "../db/actions";
import { Pin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import z from "zod";
import { useCallback } from "react";
import { getTotalOfPosts } from "../http/get-total-of-posts";
import { PaginationControls } from "./list-posts/pagination-controls";

const perPage = 10;

const fixedPost: Post = {
  id: "fixed-post",
  author: "Jeferson Leite",
  authorId: "fixed-author",
  content:
    "🚀 Bem-vindo ao blog do **Modela 3D!** Compartilhe experiências, publique ***trechos de código*** e ***curta*** os posts da comunidade. Vamos criar juntos! 🎉",
  slug: "fixed-post",
  userImageUrl: "https://github.com/jefersonapps.png",
  createdAt: null,
  likes: {
    likedByCurrentUser: false,
    likesCount: 0,
  },
};

export function ListPosts() {
  const { isLoaded, user } = useUser();
  const searchParams = useSearchParams();

  const { data: totalOfPosts, isLoading: isLoadingTotalOfPosts } = useQuery({
    queryKey: ["totalOfPosts"],
    queryFn: () => getTotalOfPosts(),
    enabled: true,
    staleTime: Infinity,
  });

  const page = z.coerce.number().parse(searchParams.get("page") ?? "1");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", user?.id, page],
    queryFn: () =>
      getPosts({ userId: user?.id, page: page, pageSize: perPage }),
    enabled: !!user?.id && isLoaded,
    staleTime: Infinity,
  });

  const {
    data: postsForUnauthenticatedUser,
    isLoading: isLoadingUnauthenticatedPosts,
  } = useQuery({
    queryKey: ["postsForUnauthenticatedUser", page],
    queryFn: () =>
      getPostsForUnauthenticatedUser({ page: page, pageSize: perPage }),
    enabled: !user?.id && isLoaded,
    staleTime: Infinity,
  });

  const lastPage = Math.ceil(
    (totalOfPosts && totalOfPosts[0].count / perPage) || 1
  );

  return (
    <div className="space-y-4">
      {isLoaded && (
        <Card className="space-y-2 bg-white dark:bg-zinc-900 p-4 rounded-md border-t-4 border-t-emerald-400 dark:border-t-emerald-700">
          <div className="flex justify-between">
            <PostUserInfo post={{ ...fixedPost, createdAt: new Date() }} />
            <div className="flex items-center gap-2 h-fit">
              <Pin className="size-4" />
              <span className="text-sm font-semibold">Fixado</span>
            </div>
          </div>
          <ContentPreview post={fixedPost} />
        </Card>
      )}
      {(isLoadingPosts || isLoadingUnauthenticatedPosts || !isLoaded) && (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Renderizar posts de usuários autenticados */}
      {!isLoadingPosts && isLoaded && user?.id && (
        <div className="space-y-4">
          {posts?.map((post) => (
            <Card
              key={post.id}
              className="space-y-2 bg-white dark:bg-zinc-900 p-4 rounded-md"
            >
              <div className="flex justify-between">
                <PostUserInfo post={post} />
                <PostActions post={post} />
              </div>
              <ContentPreview post={post} />
              <Separator />
              <PostBottomActions post={post} />
            </Card>
          ))}
        </div>
      )}

      {/* Renderizar posts para usuários não autenticados */}
      {!isLoadingUnauthenticatedPosts && isLoaded && !user?.id && (
        <div className="space-y-4">
          {postsForUnauthenticatedUser?.map((post) => (
            <Card
              key={post.id}
              className="space-y-2 bg-white dark:bg-zinc-900 p-4 rounded-md"
            >
              <div className="flex justify-between">
                <PostUserInfo post={post} />
                <PostActions post={post} />
              </div>
              <ContentPreview post={post} />
              <Separator />
              <PostBottomActions post={post} />
            </Card>
          ))}
        </div>
      )}

      <PaginationControls
        createQueryString={createQueryString}
        page={page}
        lastPage={lastPage}
        isLoadingTotalOfPosts={isLoadingTotalOfPosts}
      />
    </div>
  );
}
