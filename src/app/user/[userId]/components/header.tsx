import { clerkClient } from "@clerk/nextjs/server";
import { UserInfo } from "./user-info";

export async function Header({ userId }: { userId: string }) {
  const user = await clerkClient.users.getUser(userId);

  const {
    fullName = "",
    emailAddresses = [],
    imageUrl = "",
    createdAt = Date.now(),
  } = user;

  return (
    <UserInfo
      createdAt={createdAt}
      emailAddress={emailAddresses[0].emailAddress || ""}
      fullName={fullName || ""}
      imageUrl={imageUrl}
      userId={userId}
    />
  );
}
