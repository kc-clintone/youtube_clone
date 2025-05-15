"use client";

import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react"
import {
  UserButton,
  SignInButton,
  SignedIn,
  SignedOut
} from "@clerk/nextjs";

export const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Sudio"
              href="/studio"
              labelIcon={<ClapperboardIcon className="size-4"/>}
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="text-sm px-4 py-2 font-medium text-blue-600 hover:text-blue-400 border-blue-500/20 rounded-md shadow-none"
          >
            <UserCircleIcon />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  )
}
