import { NextResponse } from "next/server";
import { getTotalOfPosts } from "@/app/db/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("searchQuery") || "";

  const posts = await getTotalOfPosts({ searchQuery });

  return NextResponse.json(posts);
}
