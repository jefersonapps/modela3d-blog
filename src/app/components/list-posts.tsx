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
import { Pin, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { useCallback, useRef, useState } from "react";
import { getTotalOfPosts } from "../http/get-total-of-posts";
import { PaginationControls } from "./list-posts/pagination-controls";
import { createUser } from "../http/create-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState<string>("");

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
    queryKey: ["posts", user?.id, page, searchQuery],
    queryFn: () =>
      getPosts({
        userId: user?.id,
        page: page,
        pageSize: perPage,
        searchQuery,
      }),
    enabled: !!user?.id && isLoaded,
    staleTime: Infinity,
  });

  useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const userName = user?.fullName
        ? user.fullName
        : String(user?.emailAddresses);
      return createUser(userName, user?.id);
    },
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

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchInputRef.current) {
      setSearchQuery(searchInputRef.current.value);
      router.replace(
        pathname + "?" + createQueryString("page", (1).toString())
      );
    }
  };

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
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Pesquise por postagens ou usuários..."
            className="pl-8 h-11"
          />
        </div>
        <Button type="submit">
          <span>Buscar</span>
        </Button>
      </form>
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
