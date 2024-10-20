export async function getTotalOfUserPosts({
  userId,
  searchQuery,
}: {
  userId: string;
  searchQuery: string;
}) {
  const response = await fetch(
    `/api/posts/total-user-posts?userId=${userId}&searchQuery=${searchQuery}`
  );

  const data: { count: number }[] = await response.json();
  return data;
}
