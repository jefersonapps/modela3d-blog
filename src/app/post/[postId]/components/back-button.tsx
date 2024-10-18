"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      className="flex items-center p-2 rounded-full bg-transparent text-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors"
    >
      <ArrowLeft />
    </Button>
  );
}
