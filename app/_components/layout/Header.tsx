"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { FileCode, Github, LogOut, User } from "lucide-react";
import Link from "next/link";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface HeaderProps {
  user?: User;
}

export default function Header({ user }: HeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/docs-generator" className="flex items-center gap-3">
            <FileCode />
            <div>
              <h1 className="text-xl font-bold text-white">
                AI Docs Generator
              </h1>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <User className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-white font-medium">
                  {user.name || user.email}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
