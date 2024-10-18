export async function getTotalOfUserPosts({ userId }: { userId: string }) {
  const response = await fetch(`/api/posts/total-user-posts?userId=${userId}`);
  const data: { count: number }[] = await response.json();
  return data;
}
