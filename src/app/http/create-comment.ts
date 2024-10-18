import { Comment } from "../db/actions";

export async function createComment(comment: Comment) {
  const response = await fetch("/api/comments/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  if (!response.ok) {
    console.error(
      "Failed to create comment:",
      response.status,
      response.statusText
    );

    return;
  }

  const data = await response.json();
  return data;
}
