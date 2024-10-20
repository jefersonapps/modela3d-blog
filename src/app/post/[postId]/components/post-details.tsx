"use client";

import { PostItem } from "@/app/components/post-item";
import { PostSkeleton } from "@/app/components/skeletons/post-skeleton";
import { getPost } from "@/app/http/get-post";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export function PostDetails({ postId }: { postId: string }) {
  const { user } = useUser();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", postId],
    queryFn: () =>
      getPost({
        postId,
        userId: user?.id || "anonymous",
      }),
    enabled: !!postId || !!user?.id,
    staleTime: Infinity,
  });

  if (isLoadingPost) {
    return <PostSkeleton />;
  }

  if (!post) {
    return (
      <div className="text-center">
        <p>Publicação não encontrada.</p>
      </div>
    );
  }

  return <PostItem post={post[0]} detailed />;
}
