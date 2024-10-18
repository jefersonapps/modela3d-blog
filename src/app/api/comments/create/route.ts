import { createComment } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    postId,
    parentCommentId,
    parentCommentAuthor,
    parentCommentAuthorId,
    content,
    author,
    authorId,
    userImageUrl,
    createdAt,
  } = await req.json();

  try {
    await createComment({
      content,
      author,
      authorId,
      userImageUrl,
      createdAt,
      postId,
      parentCommentId,
      parentCommentAuthor,
      parentCommentAuthorId,
    });
    return NextResponse.json({ message: "Post created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}
