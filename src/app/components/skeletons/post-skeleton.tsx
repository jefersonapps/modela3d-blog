import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <div className="space-y-2 bg-white dark:bg-zinc-900 p-4 rounded-md">
      <div className="flex gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
      <Separator />
      <Skeleton className="h-10 w-[112px]" />
    </div>
  );
}
