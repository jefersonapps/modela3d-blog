import { getPostsOfUser } from "@/app/db/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const userId = searchParams.get("userId");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const searchQuery = searchParams.get("searchQuery");

  if (!page || !userId || !pageSize) {
    return Response.json(
      { message: "Invalid or missing userId or page or pageSize" },
      { status: 400 }
    );
  }
  const post = await getPostsOfUser({
    page,
    userId,
    pageSize,
    searchQuery,
  });

  return NextResponse.json(post);
}
