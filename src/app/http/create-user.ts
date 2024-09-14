export async function createUser(
  userName?: string | null,
  userId?: string | null
): Promise<void> {
  if (!userName || !userId) {
    throw new Error("User name or user ID is not provided");
  }
  const response = await fetch("/api/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create a user");
  }

  return response.json();
}
