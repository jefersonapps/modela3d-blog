import { Post } from "../db/actions";

export async function updatePost(
  postId: string,
  content: string
): Promise<Post> {
  const response = await fetch("/api/posts/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: postId, content }),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  const data = await response.json();
  return data;
}
