"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide the subtle admin link if we are already on the login page
  const isAuthPage = pathname.includes("/login") || pathname.includes("/auth-popup/");

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-white/5">

      {/* Logo */}
      <Link href="/" className="text-xl font-semibold tracking-wide hover:text-gray-300 transition-colors">
        FundCircle
      </Link>

      {/* Right side navigation */}
      <ul className="flex items-center gap-6 text-sm">

        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
        ) : status === "authenticated" ? (
          <>
            {/* Admin Controls - Only visible to you */}
            <li>
              <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium transition">
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-5 py-2 rounded-full border border-red-400/40 text-red-300 hover:bg-red-500/10 transition font-semibold"
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            {/* Public View - No big login button, just a stealth admin link */}
            {!isAuthPage && (
              <li>
                <Link href="/login" className="text-gray-600 hover:text-gray-400 transition text-xs font-medium uppercase tracking-widest">
                  Admin
                </Link>
              </li>
            )}
          </>
        )}

      </ul>
    </nav>
  );
};

export default Navbar;