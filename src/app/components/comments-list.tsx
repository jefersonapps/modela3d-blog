import { useClerk, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../http/get-user";
import { Comment, Post } from "../db/actions";
import {
  buildCommentTree,
  CommentWithChildren,
  slugifySentences,
} from "../utils/helpers";
import { createComment } from "../http/create-comment";
import { PostUserInfo } from "./post-user-info";
import { Button } from "@/components/ui/button";
import { ContentDialog, CustomContentDialog } from "./content-dialog";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ContentPreview } from "./content-preview";
import { Heart } from "phosphor-react";
import { toast } from "sonner";
import { toggleLikeComment } from "../http/like-comment";
import { CommentActions } from "./comment-actions";

export function CommentsList({
  comments,
  post,
}: {
  comments?: Comment[];
  post: Post;
}) {
  const { isLoaded, user } = useUser();
  const queryClient = useQueryClient();

  const [content, setContent] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

  const { mutateAsync: handleCreateComment, isPending: publishing } =
    useMutation({
      mutationFn: async () => {
        if (!user?.id || !post.id || isLoadingUser) return;

        await createComment({
          postId: post.id,
          parentCommentId: null,
          parentCommentAuthorId: null,
          content,
          author: displayName,
          authorId: user.id,
          userImageUrl: user.imageUrl,
          parentCommentAuthor: null,
        });
      },
      onSettled: () => {
        setIsDialogOpen(false);
        setContent("");
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["comments", post.id],
          });
        }, 1000);
      },
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleCreateComment();
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <ContentDialog
          dialogTitle="Comentar"
          content={content}
          onChangeContent={setContent}
          onSubmit={handleSubmit}
          publishing={publishing}
          placeholder="Comente sobre a publicação..."
          submitButtonText="Enviar"
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
      <div>
        <span className="font-semibold text-zinc-500">Comentários</span>
      </div>
      <div>
        {comments && (
          <CommentTree
            comments={comments}
            userId={user?.id}
            userImageUrl={user?.imageUrl}
            displayName={displayName}
          />
        )}
      </div>
    </div>
  );
}

function CommentTree({
  comments,
  userId,
  userImageUrl,
  displayName,
}: {
  comments: Comment[];
  userId?: string;
  userImageUrl?: string;
  displayName: string;
}) {
  const URL = `${origin}`;

  const [currentComments, setCurrentComments] = useState<Comment[]>(comments);

  useEffect(() => {
    setCurrentComments(comments);
  }, [comments]);

  const commentTree = buildCommentTree(currentComments);

  return (
    <div>
      {commentTree.length > 0 &&
        commentTree.map((comment) => (
          <CommentNode
            key={comment.id}
            comment={comment}
            displayName={displayName}
            userId={userId}
            userImageUrl={userImageUrl}
            level={0}
            URL={URL}
            setCurrentComments={setCurrentComments}
          />
        ))}
      {commentTree.length === 0 && (
        <div className="text-zinc-500 h-40 flex flex-col items-center justify-center leading-relaxed">
          <p className="text-xl font-bold text-center">
            Ainda não há nenhum comentário.
          </p>
          <p className="text-center">Seja o primeiro a comentar.</p>
        </div>
      )}
    </div>
  );
}

function CommentNode({
  comment,
  userId,
  userImageUrl,
  displayName,
  level = 0,
  URL,
  setCurrentComments,
}: {
  comment: CommentWithChildren;
  userId?: string;
  userImageUrl?: string;
  displayName: string;
  level?: number;
  URL: string;
  setCurrentComments: Dispatch<SetStateAction<Comment[]>>;
}) {
  const { user } = useUser();

  const { openSignIn } = useClerk();
  const [showReplies, setShowReplies] = useState(false);
  const queryClient = useQueryClient();

  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { mutateAsync: handleCreateComment, isPending: publishing } =
    useMutation({
      mutationFn: async () => {
        if (
          !userId ||
          !userImageUrl ||
          !displayName ||
          !comment.id ||
          !replyContent
        )
          return;

        await createComment({
          postId: comment.postId,
          parentCommentId: comment.id,
          parentCommentAuthorId: comment.authorId,
          parentCommentAuthor: comment.author,
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
            queryKey: ["comments", comment.postId],
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

      setCurrentComments((prev) => {
        return prev.map((c) => {
          if (c.id === comment.id) {
            const liked = !comment.likes?.likedByCurrentUser;
            return {
              ...c,
              likes: {
                likedByCurrentUser: liked,
                likesCount: liked
                  ? (comment.likes?.likesCount || 0) + 1
                  : (comment.likes?.likesCount || 0) - 1,
              },
            };
          }
          return c;
        });
      });

      await toggleLikeComment(comment.id, user.id);
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["comments", comment.postId],
        });
      }, 1000);
    },
    onError: () => {
      toast.error("Erro ao curtir comentário, tente novamente.");

      setCurrentComments((prev) => {
        return prev.map((c) => {
          if (c.id === comment.id) {
            return {
              ...c,
              likes: {
                likedByCurrentUser: !comment.likes?.likedByCurrentUser,
                likesCount: (comment.likes?.likesCount || 0) - 1,
              },
            };
          }
          return c;
        });
      });
    },
  });

  const onReplySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreateComment();
  };

  const shouldIndent = level > 0 && level < 3;

  return (
    <div
      data-should-indent={shouldIndent}
      className="py-4 pl-0 data-[should-indent=true]:pl-4 data-[should-indent=true]:ml-3 animate-fade-down animate-duration-[400ms] animate-delay-100 animate-ease-out"
    >
      <PostUserInfo
        post={{
          author: comment.author,
          createdAt: comment.createdAt,
          userImageUrl: comment.userImageUrl,
          authorId: comment.authorId,
          content: comment.content,
          slug: slugifySentences(comment.author + comment.content.slice(0, 10)),
        }}
      />
      <div className="my-2">
        <ContentPreview
          post={{
            author: comment.author,
            createdAt: comment.createdAt,
            userImageUrl: comment.userImageUrl,
            authorId: comment.authorId,
            content: comment.parentCommentAuthor
              ? `[@${comment.parentCommentAuthor}](${origin}/user/${comment.parentCommentAuthorId}) ${comment.content}`
              : comment.content,
            slug: slugifySentences(
              comment.author + comment.content.slice(0, 10)
            ),
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => handleToggleLike()}
          data-liked={comment.likes?.likedByCurrentUser || false}
          className="flex items-center space-x-2 px-3 text-zinc-500 data-[liked=true]:text-rose-500"
        >
          <Heart
            size={20}
            weight={comment.likes?.likedByCurrentUser ? "fill" : "regular"}
          />

          <span className="font-semibold">
            Curtir ({comment.likes?.likesCount})
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

        {comment.authorId === user?.id && <CommentActions comment={comment} />}
      </div>

      {comment.children.length > 0 && (
        <div>
          <Button
            onClick={() => setShowReplies(!showReplies)}
            variant="link"
            className="hover:no-underline flex gap-2 pl-0"
          >
            <div className="flex items-center justify-center">
              <div className="h-px w-5 bg-white"></div>
            </div>
            {showReplies ? "Ocultar" : "Ver"} respostas (
            {comment.children.length})
          </Button>
          {showReplies &&
            comment.children.map((childComment) => (
              <div
                key={childComment.id}
                className="animate-fade-down animate-duration-[400ms] animate-delay-100 animate-ease-out"
              >
                <CommentNode
                  comment={childComment}
                  displayName={displayName}
                  userId={userId}
                  userImageUrl={userImageUrl}
                  level={level + 1}
                  URL={URL}
                  setCurrentComments={setCurrentComments}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
