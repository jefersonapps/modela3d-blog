import { Post } from "../db/actions";

export async function getPost({
  postId,
  userId,
}: {
  postId?: string | null;
  userId?: string | null;
}): Promise<Post[] | null> {
  if (!postId || !userId) {
    console.warn("No postId or userId provided.");
    return null;
  }

  const response = await fetch(
    `/api/posts/get-post?postId=${postId}&userId=${userId}`
  );

  if (!response.ok) {
    console.error("Failed to fetch post");
    return null;
  }

  const data: Post[] = await response.json();
  return data;
}
