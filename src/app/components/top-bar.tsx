import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/favicon.ico";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { CustomUserButton } from "./signed-in";

export function TopBar() {
  return (
    <nav className="w-full py-4 border-b-[1px] mb-4 text-center flex items-center justify-between sticky top-0 bg-card z-10 ">
      <Link
        href="/"
        className="flex gap-4 items-center text-lg md:text-xl font-extrabold text-primary"
      >
        <Image width={40} src={logo} alt="Logo do Modela 3D" /> Modela 3D | Blog
      </Link>

      <div className="flex items-center gap-2">
        <ModeToggle />
        {/*-- if user is signed out --*/}
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="flex items-center gap-2">
              <CircleUser /> <span className="font-semibold">Entrar</span>
            </Button>
          </SignInButton>
        </SignedOut>
        {/*-- if user is signed in --*/}
        <CustomUserButton />
      </div>
    </nav>
  );
}
