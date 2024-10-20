import { PaginationControls } from "@/app/components/list-posts/pagination-controls";
import { PER_PAGE } from "@/app/constants/constants";
import { getTotalOfUserComments } from "@/app/http/get-total-of-user-comments";
import { getUserCommentsWithParentAndPost } from "@/app/http/get-user-comments-with-parent-and-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { PostSkeleton } from "@/app/components/skeletons/post-skeleton";
import { PostItem } from "@/app/components/post-item";
import { CommentItem } from "@/app/components/comment-item";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function ListUserComments({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: totalOfComments, isLoading: isLoadingTotalOfComments } =
    useQuery({
      queryKey: ["totalOfUserComments", userId, searchQuery],
      queryFn: () => getTotalOfUserComments({ userId, searchQuery }),
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

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: [
      "user-comments-with-parent-and-post",
      userId,
      page,
      searchQuery,
      user?.id,
    ],
    queryFn: () =>
      getUserCommentsWithParentAndPost({
        loggedUserId: user?.id,
        userId,
        page: page,
        pageSize: PER_PAGE,
        searchQuery,
      }),
    enabled: (!!userId && !!page) || !!user?.id,
    retry: 3,
    retryDelay: 1000,
    staleTime: Infinity,
  });

  const lastPage = Math.ceil(
    (totalOfComments && totalOfComments[0].count / PER_PAGE) || 1
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

  const resetComments = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    queryClient.invalidateQueries({
      queryKey: ["user-comments-with-parent-and-post", userId, page, user?.id],
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Pesquise por comentários..."
            className="pl-8 h-11"
          />
        </div>
        <Button type="submit">
          <span>Buscar</span>
        </Button>
      </form>
      {comments?.length === 0 && (
        <div className="text-zinc-500 h-40 flex flex-col items-center justify-center leading-relaxed">
          <p className="text-xl font-bold text-center">
            {searchQuery === ""
              ? "Este usuário ainda não comentou em nenhuma postagem."
              : "Comentário não encontrado."}
          </p>
          <Button variant="customLink" onClick={() => resetComments()}>
            Ver todos os comentários
          </Button>
        </div>
      )}

      {comments && comments.length > 0 && (
        <>
          {isLoadingComments && (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoadingComments && (
            <div className="space-y-4">
              {comments?.map((comment) => {
                return (
                  <div key={comment.comment.id}>
                    <PostItem post={comment.post} />
                    <div className="h-10 border-l-2 border-zinc-400 dark:border-zinc-600 flex items-center px-4 ml-[31px]">
                      <Link
                        href={`${origin}/post/${comment.postId}`}
                        className="text-[#2d8cf0]"
                      >
                        Ver todos os comentários
                      </Link>
                    </div>
                    <Card className="px-4 bg-white dark:bg-zinc-900">
                      {comment.parentComment && (
                        <>
                          <CommentItem
                            key={comment.parentComment.id}
                            comment={comment.parentComment}
                            userId={userId}
                            userImageUrl={comment.parentComment.userImageUrl}
                            displayName={comment.parentComment.author}
                          />
                          <div className="flex gap-2 pl-0">
                            <div className="flex items-center justify-center">
                              <div className="h-px w-5 bg-white"></div>
                            </div>
                            Resposta
                          </div>
                        </>
                      )}
                      <div
                        data-should-indent={!!comment.parentComment}
                        className="data-[should-indent=true]:pl-7"
                      >
                        <CommentItem
                          key={comment.comment.id}
                          comment={comment.comment}
                          userId={userId}
                          displayName={comment.comment.author}
                        />
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          <PaginationControls
            createQueryString={createQueryString}
            page={page}
            lastPage={lastPage}
            isLoadingTotalOfPosts={isLoadingTotalOfComments}
          />
        </>
      )}
    </div>
  );
}
