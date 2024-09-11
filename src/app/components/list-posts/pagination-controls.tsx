import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface PaginationControlsProps {
  page: number;
  lastPage: number;
  isLoadingTotalOfPosts: boolean;
  createQueryString: (name: string, value: string) => string;
}

export function PaginationControls({
  page,
  lastPage,
  isLoadingTotalOfPosts,
  createQueryString,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChangePage = (page: number) => {
    router.push(pathname + "?" + createQueryString("page", page.toString()));
  };

  return (
    <div className="flex gap-2 justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={page === 1}
              className="select-none"
              size="icon"
              variant="outline"
              onClick={() => handleChangePage(1)}
            >
              <ChevronsLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Primeira página</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={page === 1}
              className="select-none"
              size="icon"
              variant="outline"
              onClick={() => handleChangePage(page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Página anterior</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={isLoadingTotalOfPosts || page >= lastPage}
              className="select-none"
              size="icon"
              variant="outline"
              onClick={() => handleChangePage(page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Próxima página</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={isLoadingTotalOfPosts || page >= lastPage}
              className="select-none"
              size="icon"
              variant="outline"
              onClick={() => handleChangePage(lastPage)}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Última página</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
