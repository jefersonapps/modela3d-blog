import { toggleLikeComment } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { commentId, authorId } = await req.json();

    await toggleLikeComment(commentId, authorId);

    return NextResponse.json(
      { message: "Comment like toggled successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error occurred while toggling like on comment!", err },
      { status: 400 }
    );
  }
}
