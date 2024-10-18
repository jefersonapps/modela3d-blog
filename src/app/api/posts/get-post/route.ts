import { getSinglePost } from "@/app/db/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");

  if (!postId || !userId) {
    return Response.json(
      { message: "Invalid or missing userId or postId" },
      { status: 400 }
    );
  }
  const post = await getSinglePost(postId, userId);

  return NextResponse.json(post);
}
