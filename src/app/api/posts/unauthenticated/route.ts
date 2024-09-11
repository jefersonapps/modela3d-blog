import { NextResponse } from "next/server";
import { getPostsForUnauthenticatedUser } from "@/app/db/actions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

  const posts = await getPostsForUnauthenticatedUser({ page, pageSize });
  return NextResponse.json(posts);
}
