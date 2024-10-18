import { Comment } from "../db/actions";

export async function updateComment(
  commentId: string,
  content: string
): Promise<Comment> {
  const response = await fetch("/api/comments/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId, content }),
  });

  if (!response.ok) {
    throw new Error("Failed to update comment");
  }

  const data = await response.json();
  return data;
}
