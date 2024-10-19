import { NextResponse } from "next/server";
import { getTotalOfUserPosts } from "@/app/db/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId");
  if (!userId) {
    return Response.json(
      { message: "Invalid or missing userId" },
      { status: 400 }
    );
  }
  const total = await getTotalOfUserPosts(userId);
  console.log(total);
  return NextResponse.json(total);
}
