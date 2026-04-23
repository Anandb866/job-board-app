"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const statusColors: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-yellow-50 text-yellow-700 border-yellow-200",
  shortlisted: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            My Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Hi {user.name}, here are all your job applications
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-gray-600 font-medium mb-1">
              No applications yet
            </p>
            <p className="text-gray-400 text-sm mb-5">
              Start applying to jobs to track them here
            </p>
            <Link href="/jobs">
              <button className="btn-orange">Browse Jobs</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app: any) => (
              <div
                key={app._id}
                className="border border-gray-200 rounded-xl p-5 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {app.jobId?.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {app.jobId?.company} · {app.jobId?.location} ·{" "}
                    {app.jobId?.salary}
                  </p>
                  {app.coverNote && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1 italic">
                      "{app.coverNote}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border font-medium capitalize ${statusColors[app.status]}`}
                  >
                    {app.status}
                  </span>
                  <p className="text-xs text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
