"use client";

import { signOut } from "next-auth/react";
export default function Logout() {
  return (
    <div
      className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
      onClick={() => signOut()}
    >
      Logout
    </div>
  );
}
