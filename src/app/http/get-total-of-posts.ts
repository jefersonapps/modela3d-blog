export async function getTotalOfPosts({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const response = await fetch(`/api/posts/total?searchQuery=${searchQuery}`);
  const data: { count: number }[] = await response.json();
  return data;
}
