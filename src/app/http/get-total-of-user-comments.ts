export async function getTotalOfUserComments({
  userId,
  searchQuery,
}: {
  userId: string;
  searchQuery: string;
}) {
  const response = await fetch(
    `/api/comments/user/total?userId=${userId}&searchQuery=${searchQuery}`
  );

  const data: { count: number }[] = await response.json();
  return data;
}
