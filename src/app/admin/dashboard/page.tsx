"use client";

import React from "react";
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

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) router.push("/");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    async function load() {
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/jobs?limit=100"),
        fetch("/api/applications"),
      ]);
      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();
      setJobs(jobsData.jobs || []);
      setApplications(appsData.applications || []);
      setLoading(false);
    }
    load();
  }, [user]);

  async function deleteJob(id: string) {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j._id !== id));
    setDeleting(null);
  }

  async function updateStatus(appId: string, status: string) {
    await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status } : a)),
    );
  }

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage job listings and applications
            </p>
          </div>
          <Link href="/admin/post-job">
            <button className="btn-orange">+ Post a Job</button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="font-serif text-3xl mb-1">{jobs.length}</p>
            <p className="text-xs text-gray-400">Active listings</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="font-serif text-3xl mb-1">{applications.length}</p>
            <p className="text-xs text-gray-400">Total applications</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="font-serif text-3xl mb-1">
              {applications.filter((a) => a.status === "shortlisted").length}
            </p>
            <p className="text-xs text-gray-400">Shortlisted</p>
          </div>
        </div>

        {/* Jobs table */}
        <div className="mb-10">
          <h2 className="text-base font-semibold mb-4">Job Listings</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-sm">No jobs posted yet.</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Job
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Location
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Type
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Posted
                    </th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-400">
                          {job.company} · {job.salary}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">
                        {job.city}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {job.workMode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {new Date(job.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => deleteJob(job._id)}
                          disabled={deleting === job._id}
                          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                        >
                          {deleting === job._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Applications table */}
        <div>
          <h2 className="text-base font-semibold mb-4">Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-sm">No applications yet.</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Applicant
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Job
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Education
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Resume
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Applied
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: any) => {
                    const isExpanded = expandedApp === app._id;
                    return (
                      <React.Fragment key={app._id}>
                        <tr
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-gray-900">
                              {app.fullName || app.userId?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {app.phone || app.userId?.email}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-gray-700">{app.jobId?.title}</p>
                            <p className="text-xs text-gray-400">
                              {app.jobId?.company}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-500">
                            {app.education || "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            {app.resumeLink ? (
                              <a
                                href={app.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium underline"
                                style={{ color: "#FF6B00" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Resume
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs">
                            {new Date(app.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                          <td
                            className="px-5 py-3.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              value={app.status}
                              onChange={(e) => updateStatus(app._id, e.target.value)}
                              className={`text-xs border rounded-lg px-2 py-1.5 outline-none font-medium ${statusColors[app.status]}`}
                            >
                              {[
                                "applied",
                                "reviewed",
                                "shortlisted",
                                "rejected",
                              ].map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        
                        {/* Expanded row — cover note */}
                        {isExpanded && app.coverNote && (
                          <tr className="bg-orange-50 border-b border-gray-100">
                            <td colSpan={6} className="px-5 py-3">
                              <p className="text-xs font-semibold text-gray-500 mb-1">
                                Cover Note:
                              </p>
                              <p className="text-xs text-gray-600 leading-relaxed italic">
                                "{app.coverNote}"
                              </p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}