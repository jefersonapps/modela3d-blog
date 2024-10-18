import { Comment } from "../db/actions";

interface CommentsResponse {
  comments: Comment[];
}

export async function getComments({
  userId,
  postId,
}: {
  userId?: string | null;
  postId?: string | null;
}) {
  if (!postId || !userId) {
    console.warn("No postId or userId provided.");
    return [];
  }
  const response = await fetch(
    `/api/comments/get?userId=${userId}&postId=${postId}`
  );
  const data: CommentsResponse = await response.json();
  return data.comments;
}
