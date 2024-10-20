import { Card } from "@/components/ui/card";
import { PostUserInfo } from "./post-user-info";
import { PostActions } from "./post-actions";
import { ContentPreview } from "./content-preview";
import { Separator } from "@/components/ui/separator";
import { PostBottomActions } from "./post-bottom-actions";
import { Post } from "../db/actions";

export function PostItem({
  post,
  detailed,
}: {
  post: Post;
  detailed?: boolean;
}) {
  return (
    <Card className="space-y-2 bg-white dark:bg-zinc-900 p-4 rounded-md">
      <div className="flex justify-between">
        <PostUserInfo post={post} />
        <PostActions post={post} />
      </div>
      <ContentPreview post={post} />
      <Separator />
      <PostBottomActions post={post} detailed={detailed} />
    </Card>
  );
}
