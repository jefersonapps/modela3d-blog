"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import { SignOut } from "phosphor-react";
import { Button } from "@/components/ui/button";

export const CustomUserButton = () => {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();

  if (!isLoaded) return null;

  if (!user?.id) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="py-6 px-4 flex items-center gap-4">
          <span className="font-semibold text-base">
            {user?.fullName
              ? user.fullName
              : user?.primaryEmailAddress?.emailAddress}
          </span>
          <Image
            alt={user?.primaryEmailAddress?.emailAddress ?? "Perfil"}
            src={user?.imageUrl}
            width={30}
            height={30}
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-fit" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => openUserProfile()} asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              asChild
              onClick={() => signOut(() => router.push("/"))}
            >
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start"
              >
                <SignOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
