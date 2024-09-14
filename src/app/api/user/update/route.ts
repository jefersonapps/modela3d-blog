import { updateUser } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { userId, userName } = await req.json();

    if (!userId || !userName) {
      return NextResponse.json(
        { message: "Missing userId or userName" },
        { status: 400 }
      );
    }

    await updateUser(userId, userName);

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating user", error: err },
      { status: 500 }
    );
  }
}
