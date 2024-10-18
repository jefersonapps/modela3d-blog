import { NextResponse } from "next/server";
import { getUser } from "@/app/db/actions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.pathname.split("/")[3];

  if (typeof userId === "string") {
    try {
      const posts = await getUser(userId);
      return NextResponse.json(posts);
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { message: "Error fetching user" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }
}
