import { getCommentsByPostId } from "@/app/db/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const postId = searchParams.get("postId");

  if (!userId || !postId) {
    return Response.json(
      { message: "Invalid or missing userId or postId" },
      { status: 400 }
    );
  }
  const comments = await getCommentsByPostId(postId, userId);

  return Response.json({ comments });
}
