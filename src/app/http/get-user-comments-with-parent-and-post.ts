import { Comment, Post } from "../db/actions";

export async function getUserCommentsWithParentAndPost({
  userId,
  loggedUserId,
  page = 1,
  pageSize = 10,
  searchQuery = "",
}: {
  userId: string;
  loggedUserId?: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) {
  console.log("fez o fetch");
  const url = new URL(`/api/comments/user/${userId}`, window.location.origin);
  url.searchParams.append("page", String(page));
  url.searchParams.append("pageSize", String(pageSize));
  url.searchParams.append("loggedUserId", loggedUserId || "anonymous");

  if (searchQuery) {
    url.searchParams.append("searchQuery", searchQuery);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch user comments");
  }

  const data: {
    comment: Comment;
    parentComment: Comment | null;
    post: Post;
    postId: string;
  }[] = await response.json();

  return data;
}
