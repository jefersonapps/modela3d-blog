export async function toggleLikePost(postId: string, userId: string) {
  const response = await fetch("/api/posts/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, authorId: userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to like the post");
  }

  return data;
}
