import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Post, UnauthenticatedPosts } from "../db/actions";
import { Heart } from "phosphor-react";
import { toggleLikePost } from "../http/like-post";

export function PostBottomActions({
  post,
}: {
  post: Post | UnauthenticatedPosts;
}) {
  const { user } = useUser();
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
    if (!user || !user.id || liking || !post.id) return;

    setLiking(true);

    try {
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      await toggleLikePost(post.id, user.id);
    } catch (error) {
      console.error("Error liking post:", error);

      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLiking(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleToggleLike}
      className="flex items-center space-x-2 px-3"
    >
      <Heart
        data-liked={liked}
        size={20}
        weight={liked ? "fill" : "regular"}
        className="text-zinc-500 data-[liked=true]:text-rose-500"
      />

      <span
        data-liked={liked}
        className="font-semibold text-zinc-500 data-[liked=true]:text-rose-500"
      >
        Curtir ({likesCount})
      </span>
    </Button>
  );
}
