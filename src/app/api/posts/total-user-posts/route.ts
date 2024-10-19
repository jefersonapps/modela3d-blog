import { NextRequest, NextResponse } from "next/server";
import { getTotalOfUserPosts } from "@/app/db/actions";

export async function GET(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return Response.json(
      { message: "Invalid or missing userId" },
      { status: 400 }
    );
  }
  const total = await getTotalOfUserPosts(userId);
  return NextResponse.json(total);
}
