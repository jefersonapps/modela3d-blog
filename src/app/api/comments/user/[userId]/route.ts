import { NextResponse } from "next/server";
import { getCommentsWithParentAndPostByUserId } from "@/app/db/actions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.pathname.split("/")[4];

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }

  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
  const searchQuery = url.searchParams.get("searchQuery") || "";

  try {
    const comments = await getCommentsWithParentAndPostByUserId({
      userId,
      page,
      pageSize,
      searchQuery,
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
