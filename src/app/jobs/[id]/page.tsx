"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    resumeLink: "",
    coverNote: "",
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data.job);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // pre-fill name and email if user is logged in
  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, fullName: user.name, email: user.email }));
    }
  }, [user]);

  async function handleApply() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!form.fullName || !form.phone || !form.education) {
      setError("Please fill in all required fields");
      return;
    }
    setApplying(true);
    setError("");

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id, ...form }),
    });
    const data = await res.json();
    if (res.ok) {
      setApplied(true);
      setShowApply(false);
    } else {
      setError(data.error || "Something went wrong");
    }
    setApplying(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-8 py-16">
          <div className="h-8 bg-gray-100 rounded w-2/3 animate-pulse mb-4" />
          <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse mb-8" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-8 py-16 text-center">
          <p className="text-gray-500">Job not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-xl border border-gray-100 flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: job.bg || "#f3f4f6",
              color: job.color || "#1a1a1a",
            }}
          >
            {job.initials || job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {job.title}
            </h1>
            <p className="text-gray-500 text-sm">
              {job.company} · {job.location}
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="tag-fulltime">{job.jobType}</span>
              {job.workMode === "Remote" && (
                <span className="tag-remote">Remote</span>
              )}
              {job.workMode === "Hybrid" && (
                <span className="tag-fulltime">Hybrid</span>
              )}
              <span className="text-xs border border-gray-200 px-3 py-1 rounded-full text-gray-500">
                {job.experience}
              </span>
              <span className="text-xs border border-gray-200 px-3 py-1 rounded-full text-gray-500">
                {job.category}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-semibold text-gray-900">{job.salary}</p>
            <p className="text-xs text-gray-400 mt-1">per annum</p>
          </div>
        </div>

        <div className="section-divider mb-8" />

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-base font-semibold mb-3">About the role</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-3">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((r: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span style={{ color: "#FF6B00" }} className="mt-0.5">
                    ✓
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="section-divider mb-8" />

        {/* Apply section */}
        {applied ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-green-700 font-semibold text-sm">
              Application submitted successfully!
            </p>
            <p className="text-green-600 text-xs mt-1 mb-4">
              You can track your application status from your dashboard.
            </p>
            <Link href="/dashboard">
              <button className="btn-orange text-xs px-5 py-2">
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : user?.role === "admin" ? (
          // admin sees a message instead of apply button
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-orange-700 text-sm font-medium">
              You are logged in as an admin.
            </p>
            <p className="text-orange-600 text-xs mt-1">
              Admins cannot apply for jobs. Switch to a user account to apply.
            </p>
          </div>
        ) : showApply ? (
          // full application form
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-base font-semibold mb-1">
              Apply for {job.title}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              {job.company} · {job.location}
            </p>

            <div className="space-y-4">
              {/* Personal details */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Personal Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-300"
                      placeholder="Anand Bhingardive"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-300"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Education
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Highest Qualification *
                  </label>
                  <select
                    value={form.education}
                    onChange={(e) =>
                      setForm({ ...form, education: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-300 bg-white"
                  >
                    <option value="">Select qualification</option>
                    <option>10th / SSC</option>
                    <option>12th / HSC</option>
                    <option>Diploma</option>
                    <option>
                      Bachelor's Degree (B.E / B.Tech / BCA / BCS)
                    </option>
                    <option>Bachelor's Degree (B.Com / BBA / BA)</option>
                    <option>Master's Degree (M.E / M.Tech / MCA)</option>
                    <option>Master's Degree (MBA / MCA / MA)</option>
                    <option>PhD</option>
                  </select>
                </div>
              </div>

              {/* Experience */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Experience
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Total Work Experience
                  </label>
                  <select
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-300 bg-white"
                  >
                    <option value="">Select experience</option>
                    <option>Fresher (0 years)</option>
                    <option>Less than 1 year</option>
                    <option>1–2 years</option>
                    <option>2–4 years</option>
                    <option>4–6 years</option>
                    <option>6–10 years</option>
                    <option>10+ years</option>
                  </select>
                </div>
              </div>

              {/* Resume */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Resume
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Resume Link{" "}
                    <span className="text-gray-400 font-normal">
                      (Google Drive / LinkedIn / Dropbox)
                    </span>
                  </label>
                  <input
                    value={form.resumeLink}
                    onChange={(e) =>
                      setForm({ ...form, resumeLink: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-300"
                    placeholder="https://drive.google.com/your-resume"
                  />
                </div>
              </div>

              {/* Cover note */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Cover Note
                </p>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Why are you a good fit?{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={form.coverNote}
                    onChange={(e) =>
                      setForm({ ...form, coverNote: e.target.value })
                    }
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-300 resize-none"
                    placeholder="Briefly introduce yourself and explain why you're the right person for this role..."
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-orange disabled:opacity-60"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  onClick={() => {
                    setShowApply(false);
                    setError("");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          // default — show apply button
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/auth/login">
                  <button className="btn-orange text-base px-8 py-3">
                    Sign in to Apply
                  </button>
                </Link>
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/auth/register" style={{ color: "#FF6B00" }}>
                    Register free
                  </Link>
                </p>
              </>
            ) : (
              <button
                onClick={() => setShowApply(true)}
                className="btn-orange text-base px-8 py-3"
              >
                Apply Now
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
