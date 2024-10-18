export async function toggleLikeComment(commentId: string, userId: string) {
  const response = await fetch("/api/comments/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId, authorId: userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to like the comment");
  }

  return data;
}
