"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <>
      <div className="tricolor" />
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "#FF6B00" }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2L9.8 6.5H14.5L10.7 9.3L12.2 14L8 11.2L3.8 14L5.3 9.3L1.5 6.5H6.2L8 2Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="font-serif text-xl tracking-tight">
            Job<span style={{ color: "#FF6B00" }}>Setu</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/companies"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Companies
          </Link>
          <Link
            href="/salaries"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Salary Insights
          </Link>

          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                {user.role === "admin" ? "Admin Panel" : "My Applications"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Logout
              </button>
              {user.role === "admin" && (
                <Link href="/admin/post-job">
                  <button className="btn-orange">Post a Job</button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Sign In
              </Link>
              <Link href="/auth/register">
                <button className="btn-orange">Get Started</button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
