"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <div className="relative select-none" ref={menuRef}>
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 px-4 py-2 
                   bg-slate-800 hover:bg-slate-700 
                   rounded-xl transition-all duration-200"
      >
        {/* Avatar Bubble */}
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                        flex items-center justify-center text-white text-sm font-bold shadow-md"
        >
          {session.user.name?.charAt(0).toUpperCase() || <UserIcon size={18} />}
        </div>

        {/* Name (hidden on very small screens) */}
        <span className="text-white text-sm font-semibold hidden sm:block">
          {session.user.name}
        </span>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div
          className="
            absolute right-0 mt-3 w-64
            bg-slate-800 border border-slate-700 backdrop-blur
            rounded-xl shadow-xl z-50 overflow-hidden
            animate-fade-in
          "
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm font-semibold text-white">
              {session.user.name}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {session.user.email}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: "/login",
              })
            }
            className="
              w-full flex items-center gap-2 px-4 py-3
              text-red-400 hover:text-red-300
              hover:bg-slate-700 transition-colors duration-150
            "
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
