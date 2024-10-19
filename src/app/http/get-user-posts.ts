import { Post } from "../db/actions";

export async function getUserPosts({
  userId,
  page,
  pageSize,
  searchQuery,
}: {
  userId?: string | null;
  page?: number;
  pageSize?: number;
  searchQuery?: string | null;
}): Promise<Post[] | null> {
  console.log("userId", userId);
  console.log("page", page);
  console.log("pageSize", pageSize);
  console.log("searchQuery", searchQuery);

  if (!userId || !page || !pageSize) {
    console.warn("No userId or page or pageSize provided.");
    return null;
  }

  const response = await fetch(
    `/api/posts/get-user-posts?userId=${userId}&page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`
  );

  console.log("response", response);

  if (!response.ok) {
    console.error("Failed to fetch posts");
    return null;
  }

  const data: Post[] = await response.json();

  console.log("data", data);
  return data;
}
