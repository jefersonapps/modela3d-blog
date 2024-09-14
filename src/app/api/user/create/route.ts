import { createUser } from "@/app/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userName, userId } = await req.json();

  try {
    await createUser(userName, userId);
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred", err },
      { status: 400 }
    );
  }
}
