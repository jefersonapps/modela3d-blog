import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Comment } from "../db/actions";
import { UpdateCommentDialog } from "./update-comment-dialog";
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
import { DeleteComment } from "./delete-comment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CommentActionsProps {
  comment: Comment;
}

export const CommentActions = ({ comment }: CommentActionsProps) => {
  const { user } = useUser();

  const [dialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center space-x-2">
      {comment.authorId === user?.id && (
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="hover:no-underline"
                    size="icon"
                  >
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Opções</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-fit">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteComment commentId={comment.id} />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      )}

      {dialogOpen && (
        <UpdateCommentDialog
          commentId={comment.id}
          currentContent={comment.content}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};
