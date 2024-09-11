import { NextResponse } from "next/server";
import { getTotalOfPosts } from "@/app/db/actions";

export async function GET() {
  const posts = await getTotalOfPosts();
  return NextResponse.json(posts);
}
