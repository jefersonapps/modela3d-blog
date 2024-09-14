interface User {
  userId?: string | null;
  userName?: string;
}
export async function updateUser({ userId, userName }: User): Promise<void> {
  if (!userName || !userId) {
    throw new Error("User name or user ID is not provided");
  }

  console.log(userId, userName);
  const response = await fetch("/api/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, userName }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  const data = await response.json();
  return data;
}
