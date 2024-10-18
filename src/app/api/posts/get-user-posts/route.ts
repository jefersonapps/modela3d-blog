import { getPostsOfUser } from "@/app/db/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const userId = searchParams.get("userId");
  const pageSize = searchParams.get("pageSize");
  const searchQuery = searchParams.get("searchQuery");

  if (!page || !userId || !pageSize) {
    return Response.json(
      { message: "Invalid or missing userId or postId" },
      { status: 400 }
    );
  }
  const post = await getPostsOfUser({
    page: parseInt(page),
    userId,
    pageSize: parseInt(pageSize),
    searchQuery,
  });

  return NextResponse.json(post);
}
