import { PaginationControls } from "@/app/components/list-posts/pagination-controls";
import { PostItem } from "@/app/components/post-item";
import { PostSkeleton } from "@/app/components/skeletons/post-skeleton";
import { PER_PAGE } from "@/app/constants/constants";
import { getTotalOfUserPosts } from "@/app/http/get-total-of-user-posts";
import { getUserPosts } from "@/app/http/get-user-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import z from "zod";

export function ListUserPosts({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: totalOfPosts, isLoading: isLoadingTotalOfPosts } = useQuery({
    queryKey: ["totalOfUserPosts", userId],
    queryFn: () => getTotalOfUserPosts({ userId }),
    enabled: !!userId,
    retry: 3,
    retryDelay: 1000,
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
    queryKey: ["user-posts", userId, page, searchQuery, user?.id],
    queryFn: () =>
      getUserPosts({
        loggedUserId: user?.id || "anonymous",
        userId: userId,
        page: page,
        pageSize: PER_PAGE,
        searchQuery,
      }),
    enabled: (!!userId && !!page) || !!user?.id,
    retry: 3,
    retryDelay: 1000,
    staleTime: Infinity,
  });

  console.log(posts);

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
  return (
    <div className="space-y-4 mt-4">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Pesquise por postagens..."
            className="pl-8 h-11"
          />
        </div>
        <Button type="submit">
          <span>Buscar</span>
        </Button>
      </form>
      {isLoadingPosts && (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {posts?.length === 0 && (
        <div className="text-zinc-500 h-40 flex flex-col items-center justify-center leading-relaxed">
          <p className="text-xl font-bold text-center">
            {searchQuery === ""
              ? "Este usuário ainda não fez nenhuma postagem."
              : "Nenhuma publicação encontrada."}
          </p>
        </div>
      )}

      {!isLoadingPosts && (
        <div className="space-y-4">
          {posts?.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {posts && posts.length > 0 && (
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
