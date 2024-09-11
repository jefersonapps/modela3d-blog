import { UnauthenticatedPosts } from "../db/actions";

export async function getPostsForUnauthenticatedUser({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const response = await fetch(
    `/api/posts/unauthenticated?page=${page}&pageSize=${pageSize}`
  );
  const data: UnauthenticatedPosts[] = await response.json();
  return data;
}
