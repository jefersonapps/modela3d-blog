import { Post } from "../db/actions";

export async function getPosts({
  userId,
  page,
  pageSize,
  searchQuery,
}: {
  userId?: string;
  page: number;
  pageSize: number;
  searchQuery?: string;
}) {
  const response = await fetch(
    `/api/posts/${userId}?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`
  );
  const data: Post[] = await response.json();
  return data;
}
