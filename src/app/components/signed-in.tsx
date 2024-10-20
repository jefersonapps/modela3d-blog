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
import { User2, UserCircle } from "lucide-react";
import { SignOut } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../http/update-user";
import { getUser } from "../http/get-user";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export const CustomUserButton = () => {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | undefined>("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutateAsync: updateUserName, isPending: updating } = useMutation({
    mutationFn: () => updateUser({ userId: user?.id, userName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["username"] });
      setIsUserDialogOpen(false);
      toast.success("Nome de usuário atualizado com sucesso");
    },
    onError: () => {
      setUserName(user?.fullName ?? user?.primaryEmailAddress?.emailAddress);
      toast.error("Erro ao atualizar nome de usuário");
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUserName();
  };

  const { data: userData } = useQuery({
    queryKey: ["username"],
    queryFn: () => getUser({ userId: user?.id }),
    enabled: !!user?.id && isLoaded,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (userData && userData[0]?.userName) {
      setUserName(userData[0].userName);
    }
  }, [userData]);

  if (!isLoaded) return null;

  if (!user?.id) return null;

  const displayName =
    (userData ? userData[0]?.userName : undefined) ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Anônimo";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="py-6 px-2 flex items-center gap-4 min-w-[30px]"
        >
          <span className="font-semibold text-base hidden md:block">
            {displayName}
          </span>
          <Image
            alt={user?.primaryEmailAddress?.emailAddress ?? "Perfil"}
            src={user?.imageUrl}
            width={30}
            height={30}
            className="rounded-full min-w-[30px] min-h-[30px]"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-fit" align="end">
          <DropdownMenuGroup>
            <Link href={`/user/${user?.id}`}>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start px-2"
              >
                <Image
                  alt={user?.primaryEmailAddress?.emailAddress ?? "Perfil"}
                  src={user?.imageUrl}
                  width={30}
                  height={30}
                  className="rounded-full mr-2 h-4 w-4"
                />
                <span>Meu perfil</span>
              </Button>
            </Link>

            <DropdownMenuItem asChild>
              <Dialog
                open={isUserDialogOpen}
                onOpenChange={setIsUserDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start px-2"
                  >
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Nome de usuário</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-[95%] md:max-w-xl bg-card p-3 md:p-4 rounded-md">
                  <DialogHeader>
                    <DialogTitle>Editar nome de usuário</DialogTitle>
                  </DialogHeader>
                  <form
                    className="flex flex-col w-full space-y-4"
                    onSubmit={handleSubmit}
                  >
                    <Label htmlFor="username">Nome</Label>
                    <Input
                      type="text"
                      id="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full rounded-md border-2 border-zinc-300 p-4 text-sm"
                    />
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={updating || !userName}
                        className="font-semibold relative"
                      >
                        {updating && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Spinner />
                          </div>
                        )}
                        Salvar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => openUserProfile()} asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Perfil Clerk</span>
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
