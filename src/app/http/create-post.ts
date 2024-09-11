import { Post } from "../db/actions";

export async function createPost(postData: Post): Promise<Post> {
  const response = await fetch("/api/posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  const data: Post = await response.json();
  return data;
}
