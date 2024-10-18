export async function deleteComment(
  commentId: string
): Promise<{ message: string }> {
  const response = await fetch("/api/comments/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  const data = await response.json();
  return data;
}
