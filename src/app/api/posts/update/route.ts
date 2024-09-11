import { updatePost } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { id, content } = await req.json();

    if (!id || !content) {
      return NextResponse.json(
        { message: "Missing id or content" },
        { status: 400 }
      );
    }

    await updatePost(content, id);

    return NextResponse.json(
      { message: "Post updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating post", error: err },
      { status: 500 }
    );
  }
}
