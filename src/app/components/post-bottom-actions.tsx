import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Post, UnauthenticatedPosts } from "../db/actions";
import { Chat, Heart } from "phosphor-react";
import { toggleLikePost } from "../http/like-post";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../http/get-comments";
import Link from "next/link";
import { CommentsList } from "./comments-list";

export function PostBottomActions({
  post,
  detailed,
}: {
  post: Post | UnauthenticatedPosts;
  detailed?: boolean;
}) {
  const { user } = useUser();

  const { openSignIn } = useClerk();
  const [liking, setLiking] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(() => {
    if (post !== undefined && "likes" in post) {
      const likes = post.likes;
      if (likes && "likedByCurrentUser" in likes) {
        return likes.likedByCurrentUser;
      }
      return false;
    }
    return false;
  });

  const [likesCount, setLikesCount] = useState<number>(
    post?.likes?.likesCount ?? 0
  );

  const handleToggleLike = async () => {
    if (!user?.id) {
      openSignIn();
    }
    if (!user?.id || liking || !post.id) return;

    setLiking(true);

    try {
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      await toggleLikePost(post.id, user.id);
    } catch (err) {
      console.error(err);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
      toast.error("Erro ao curtir postagem, tente novamente.");
    } finally {
      setLiking(false);
    }
  };

  const { data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      getComments({ postId: post.id, userId: user?.id || "anonymous" }),
    enabled: !!post.id,
  });

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={handleToggleLike}
          data-liked={liked}
          className="flex items-center space-x-2 px-3 text-zinc-500 data-[liked=true]:text-rose-500"
        >
          <Heart size={20} weight={liked ? "fill" : "regular"} />

          <span className="font-semibold">Curtir ({likesCount})</span>
        </Button>

        {!detailed && (
          <Link href={`/post/${post.id}`}>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-3 text-zinc-500"
            >
              <Chat size={20} weight="regular" />

              <span className="font-semibold">Comentários</span>
            </Button>
          </Link>
        )}
      </div>
      {detailed && <CommentsList comments={comments} post={post} />}
    </div>
  );
}
