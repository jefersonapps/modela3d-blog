import { deleteComment } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { commentId } = await req.json();

  try {
    await deleteComment(commentId);
    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error occured!", err },
      { status: 400 }
    );
  }
}
