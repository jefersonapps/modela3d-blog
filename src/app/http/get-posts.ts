import { Post } from "../db/actions";

export async function getPosts({
  userId,
  page,
  pageSize,
}: {
  userId?: string;
  page: number;
  pageSize: number;
}) {
  const response = await fetch(
    `/api/posts/${userId}?page=${page}&pageSize=${pageSize}`
  );
  const data: Post[] = await response.json();
  return data;
}
