import Image from "next/image";
import { Post } from "../db/actions";
import { formatDateString } from "../utils/helpers";
import z from "zod";
import Link from "next/link";

const emailSchema = z.string().email();

interface PostUserInfoProps {
  post: Post;
}

export function PostUserInfo({ post }: PostUserInfoProps) {
  const isEmail = emailSchema.safeParse(post?.author).success;
  return (
    <div className="flex items-center gap-4">
      <Link href={`/user/${post.authorId}`}>
        <Image
          src={post.userImageUrl}
          alt={`Foto de ${post?.author}`}
          width={30}
          height={30}
          className="rounded-full"
        />
      </Link>
      <div className="flex flex-col">
        <Link href={`/user/${post.authorId}`}>
          <span
            data-capitalize={!isEmail}
            className="text-md font-semibold text-zinc-900 dark:text-zinc-300 data-[capitalize=true]:capitalize"
          >
            {post.author}
          </span>
        </Link>
        <span className="text-xs text-gray-500">
          {formatDateString(post.createdAt || null)}
        </span>
      </div>
    </div>
  );
}
