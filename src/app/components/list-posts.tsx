"use client";

import { useUser } from "@clerk/nextjs";
import { PostUserInfo } from "./post-user-info";
import { ContentPreview } from "./content-preview";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts } from "../http/get-posts";
import { Card } from "@/components/ui/card";
import { Post } from "../db/actions";
import { ListRestart, Pin, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { useCallback, useRef, useState } from "react";
import { getTotalOfPosts } from "../http/get-total-of-posts";
import { PaginationControls } from "./list-posts/pagination-controls";
import { createUser } from "../http/create-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostItem } from "./post-item";
import { PER_PAGE } from "../constants/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { PostSkeleton } from "./skeletons/post-skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const fixedPost: Post = {
  id: "fixed-post",
  author: "Jeferson Leite",
  authorId: "user_2m4QjJwzcIB9aSLIOl2ipvehLkV",
  content:
    "🚀 Bem-vindo ao blog do **Modela 3D!** Compartilhe experiências, publique ***trechos de código*** e ***curta*** os posts da comunidade. Vamos criar juntos! 🎉",
  slug: "fixed-post",
  userImageUrl:
    "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybTRRalFZOTJLVmtOR3V1QjV2cWVQRGtVMTcifQ",
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
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: totalOfPosts, isLoading: isLoadingTotalOfPosts } = useQuery({
    queryKey: ["totalOfPosts", searchQuery],
    queryFn: () => getTotalOfPosts({ searchQuery }),
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
        pageSize: PER_PAGE,
        searchQuery,
      }),
    enabled: true,
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

  const lastPage = Math.ceil(
    (totalOfPosts && totalOfPosts[0].count / PER_PAGE) || 1
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

  const resetPosts = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    queryClient.invalidateQueries({
      queryKey: ["posts", user?.id, page],
    });
  };

  return (
    <div className="space-y-4 pt-4">
      {isLoaded ? (
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
      ) : (
        <div className="space-y-2 h-[126.59px] bg-white dark:bg-zinc-900 p-4 rounded-md">
          <div className="flex gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => resetPosts()}>
                <ListRestart />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Recarregar postagens</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>

      {isLoadingPosts && (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoadingPosts && (
        <div className="space-y-4">
          {posts?.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {posts?.length === 0 && (
        <div className="text-zinc-500 h-40 flex flex-col items-center justify-center leading-relaxed">
          <p className="text-xl font-bold text-center">
            {searchQuery === ""
              ? "Não há publicações recentes."
              : "Nenhuma publicação encontrada."}
          </p>
          <Button variant="customLink" onClick={() => resetPosts()}>
            Ver todas as postagens
          </Button>
        </div>
      )}

      {posts && posts?.length > 0 && (
        <PaginationControls
          createQueryString={createQueryString}
          page={page}
          lastPage={lastPage}
          isLoadingTotalOfPosts={isLoadingTotalOfPosts}
        />
      )}
    </div>
  );
}
