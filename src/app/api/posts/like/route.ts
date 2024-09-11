import { toggleLike } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { postId, authorId } = await req.json();

    await toggleLike(postId, authorId);

    return NextResponse.json(
      { message: "Like toggled successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error occurred while toggling like!", err },
      { status: 400 }
    );
  }
}
