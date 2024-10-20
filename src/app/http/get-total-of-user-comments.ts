export async function getTotalOfUserComments({ userId }: { userId: string }) {
  const response = await fetch(`/api/comments/user/total?userId=${userId}`);

  const data: { count: number }[] = await response.json();
  return data;
}
