"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Post, UnauthenticatedPosts } from "../db/actions";
import { UpdatePostDialog } from "./update-post-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Ellipsis } from "lucide-react";
import { DeletePost } from "./delete-post";

interface PostActionsProps {
  post: Post | UnauthenticatedPosts;
}

export const PostActions = ({ post }: PostActionsProps) => {
  const { user } = useUser();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center space-x-2">
      {post.authorId === user?.id && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full" size="icon">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-fit">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeletePost postId={post.id} />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      )}

      {dialogOpen && (
        <UpdatePostDialog
          postId={post.id}
          currentContent={post.content}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};
