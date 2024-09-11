export async function deletePost(postId: string): Promise<{ message: string }> {
  const response = await fetch("/api/posts/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: postId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  const data = await response.json();
  return data;
}
