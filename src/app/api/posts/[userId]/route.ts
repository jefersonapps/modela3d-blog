import { NextResponse } from "next/server";
import { getAllPosts } from "@/app/db/actions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.pathname.split("/")[3];
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
  const searchQuery = url.searchParams.get("searchQuery");

  if (typeof userId === "string") {
    try {
      const posts = await getAllPosts({ userId, page, pageSize, searchQuery });
      return NextResponse.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json(
        { message: "Error fetching posts" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }
}
