export async function getTotalOfPosts() {
  const response = await fetch("/api/posts/total");
  const data: { count: number }[] = await response.json();
  return data;
}
