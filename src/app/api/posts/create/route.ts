import { createPost } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userImageUrl, content, author, authorId, slug } = await req.json();

  try {
    await createPost({
      content,
      author,
      authorId,
      slug,
      userImageUrl,
    });
    return NextResponse.json({ message: "Post created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}
