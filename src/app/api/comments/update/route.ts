import { updateComment } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { commentId, content } = await req.json();

    if (!commentId || !content) {
      return NextResponse.json(
        { message: "Missing commentId or content" },
        { status: 400 }
      );
    }

    await updateComment(commentId, content);

    return NextResponse.json(
      { message: "Comment updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating comment", error: err },
      { status: 500 }
    );
  }
}
