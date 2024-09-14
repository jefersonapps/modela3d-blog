export async function getUser({ userId }: { userId?: string }) {
  const response = await fetch(`/api/user/${userId}`);
  const data = await response.json();
  return data;
}
