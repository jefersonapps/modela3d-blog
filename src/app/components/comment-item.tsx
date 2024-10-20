import { FormEvent, useEffect, useState } from "react";
import { Comment } from "../db/actions";
import { useClerk, useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../http/create-comment";
import { toggleLikeComment } from "../http/like-comment";
import { toast } from "sonner";
import { PostUserInfo } from "./post-user-info";
import { slugifySentences } from "../utils/helpers";
import { ContentPreview } from "./content-preview";
import { Button } from "@/components/ui/button";
import { Heart } from "phosphor-react";
import { CustomContentDialog } from "./content-dialog";
import { CommentActions } from "./comment-actions";

export function CommentItem({
  comment,
  userId,
  userImageUrl,
  displayName,
}: {
  comment: Comment;
  userId?: string;
  userImageUrl?: string;
  displayName: string;
}) {
  const { user } = useUser();

  const { openSignIn } = useClerk();
  const queryClient = useQueryClient();

  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState<Comment>(comment);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    setCurrentComment(comment);
  }, [comment]);

  const { mutateAsync: handleCreateComment, isPending: publishing } =
    useMutation({
      mutationFn: async () => {
        if (
          !userId ||
          !userImageUrl ||
          !displayName ||
          !currentComment.id ||
          !replyContent
        )
          return;

        await createComment({
          postId: currentComment.postId,
          parentCommentId: currentComment.id,
          parentCommentAuthorId: currentComment.authorId,
          parentCommentAuthor: currentComment.author,
          content: replyContent,
          author: displayName,
          authorId: userId,
          userImageUrl: userImageUrl,
        });
      },
      onSettled: () => {
        setReplyContent("");
        setIsReplyDialogOpen(false);
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["comments", currentComment.postId],
          });
        }, 1000);
      },
    });

  const { mutateAsync: handleToggleLike, isPending: liking } = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        openSignIn();
      }
      if (!user?.id || liking || !comment?.id) return;

      setCurrentComment((prev) => {
        const liked = !currentComment.likes?.likedByCurrentUser;
        return {
          ...prev,
          likes: {
            likedByCurrentUser: liked,
            likesCount: liked
              ? (currentComment.likes?.likesCount || 0) + 1
              : (currentComment.likes?.likesCount || 0) - 1,
          },
        };
      });

      if (currentComment.id) {
        await toggleLikeComment(currentComment.id, user.id);
      }
    },
    onError: () => {
      toast.error("Erro ao curtir comentário, tente novamente.");

      setCurrentComment((prev) => {
        return {
          ...prev,
          likes: {
            likedByCurrentUser: !currentComment.likes?.likedByCurrentUser,
            likesCount: (currentComment.likes?.likesCount || 0) - 1,
          },
        };
      });
    },
  });

  const onReplySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreateComment();
  };

  return (
    <div className="py-4 animate-fade-down animate-duration-[400ms] animate-delay-100 animate-ease-out">
      <PostUserInfo
        post={{
          author: currentComment.author,
          createdAt: currentComment.createdAt,
          userImageUrl: currentComment.userImageUrl,
          authorId: currentComment.authorId,
          content: currentComment.content,
          slug: slugifySentences(
            currentComment.author + currentComment.content.slice(0, 10)
          ),
        }}
      />
      <div className="my-2">
        <ContentPreview
          post={{
            author: currentComment.author,
            createdAt: currentComment.createdAt,
            userImageUrl: currentComment.userImageUrl,
            authorId: currentComment.authorId,
            content: currentComment.parentCommentAuthor
              ? `[@${currentComment.parentCommentAuthor}](${origin}/user/${currentComment.parentCommentAuthorId}) ${currentComment.content}`
              : currentComment.content,
            slug: slugifySentences(
              currentComment.author + currentComment.content.slice(0, 10)
            ),
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => handleToggleLike()}
          data-liked={currentComment.likes?.likedByCurrentUser || false}
          className="flex items-center space-x-2 px-3 text-zinc-500 data-[liked=true]:text-rose-500"
        >
          <Heart
            size={20}
            weight={
              currentComment.likes?.likedByCurrentUser ? "fill" : "regular"
            }
          />

          <span className="font-semibold">
            Curtir ({currentComment.likes?.likesCount})
          </span>
        </Button>

        <CustomContentDialog
          content={replyContent}
          submitButtonText="Enviar"
          dialogTitle="Responder"
          isDialogOpen={isReplyDialogOpen}
          onChangeContent={setReplyContent}
          onSubmit={onReplySubmit}
          publishing={publishing}
          setIsDialogOpen={setIsReplyDialogOpen}
        >
          <Button variant="ghost" className="text-zinc-500">
            <span className="font-semibold">Responder</span>
          </Button>
        </CustomContentDialog>

        {currentComment.authorId === user?.id && (
          <CommentActions comment={comment} userId={userId} />
        )}
      </div>
    </div>
  );
}
