"use client";

import Image from "next/image";
import { Post, UnauthenticatedPosts } from "../db/actions";
import { formatDateString } from "../utils/helpers";

interface PostUserInfoProps {
  post: Post | UnauthenticatedPosts;
}

export function PostUserInfo({ post }: PostUserInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={post?.userImageUrl || ""}
        alt={`Foto de ${post?.author}`}
        width={30}
        height={30}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-md font-semibold text-zinc-900 dark:text-zinc-300 capitalize">
          {post?.author}
        </span>
        <span className="text-xs text-gray-500">
          {formatDateString(post?.createdAt || null)}
        </span>
      </div>
    </div>
  );
}
