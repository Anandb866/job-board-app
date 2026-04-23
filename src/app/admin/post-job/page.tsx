"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const COLORS = [
  { bg: "#FFF3E0", color: "#BF4500" },
  { bg: "#E8F5E9", color: "#1B5E20" },
  { bg: "#E3F2FD", color: "#0D47A1" },
  { bg: "#FCE4EC", color: "#880E4F" },
  { bg: "#F3E5F5", color: "#4A148C" },
  { bg: "#E0F7FA", color: "#006064" },
];

export default function PostJobPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    city: "",
    salary: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
    jobType: "Full-time",
    workMode: "On-site",
    category: "",
    description: "",
    requirements: "",
    initials: "",
    colorIndex: 0,
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading]);

  function set(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const chosen = COLORS[form.colorIndex];
    const payload = {
      ...form,
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      requirements: form.requirements.split("\n").filter((r) => r.trim()),
      initials: form.initials || form.company.slice(0, 2).toUpperCase(),
      bg: chosen.bg,
      color: chosen.color,
    };

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to post job");
    }
    setSaving(false);
  }

  if (authLoading || !user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-lg mx-auto px-8 py-20 text-center">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="text-xl font-semibold mb-2">
            Job posted successfully!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            It's now live on JobSetu.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setSuccess(false)}
              className="btn-outline-orange"
            >
              Post another
            </button>
            <Link href="/admin/dashboard">
              <button className="btn-orange">View Dashboard</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Post a Job</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to publish a new listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Job Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="e.g. Senior React Developer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Company *
              </label>
              <input
                required
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="e.g. Razorpay"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Location *
              </label>
              <input
                required
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="e.g. Bengaluru, Karnataka"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                City *
              </label>
              <select
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300 bg-white"
              >
                <option value="">Select city</option>
                {[
                  "Bengaluru",
                  "Mumbai",
                  "Delhi NCR",
                  "Hyderabad",
                  "Pune",
                  "Chennai",
                  "Kolkata",
                  "Ahmedabad",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Salary (display) *
              </label>
              <input
                required
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="e.g. ₹18–26 LPA"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Min Salary (₹)
              </label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={(e) => set("salaryMin", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="1800000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Max Salary (₹)
              </label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={(e) => set("salaryMax", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="2600000"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Experience *
              </label>
              <input
                required
                value={form.experience}
                onChange={(e) => set("experience", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="e.g. 3–6 yrs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Job Type
              </label>
              <select
                value={form.jobType}
                onChange={(e) => set("jobType", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300 bg-white"
              >
                {["Full-time", "Part-time", "Contract", "Internship"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Work Mode
              </label>
              <select
                value={form.workMode}
                onChange={(e) => set("workMode", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300 bg-white"
              >
                {["On-site", "Remote", "Hybrid"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Category *
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300 bg-white"
            >
              <option value="">Select category</option>
              {[
                "IT & Software",
                "Banking & Finance",
                "Education",
                "Healthcare",
                "Logistics",
                "E-commerce",
                "Marketing",
                "Operations",
                "Design",
                "Sales",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Job Description *
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300 resize-none"
              placeholder="Describe the role, responsibilities, team culture..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Requirements{" "}
              <span className="text-gray-400 font-normal">(one per line)</span>
            </label>
            <textarea
              value={form.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300 resize-none"
              placeholder={
                "3+ years of React experience\nStrong TypeScript skills\nExperience with REST APIs"
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Company Initials
              </label>
              <input
                value={form.initials}
                onChange={(e) =>
                  set("initials", e.target.value.slice(0, 3).toUpperCase())
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                placeholder="e.g. RZ"
                maxLength={3}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Logo Color
              </label>
              <div className="flex gap-2 mt-1">
                {COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => set("colorIndex", i)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${form.colorIndex === i ? "border-gray-800 scale-110" : "border-transparent"}`}
                    style={{ background: c.bg }}
                  />
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-orange disabled:opacity-60"
            >
              {saving ? "Posting..." : "Publish Job"}
            </button>
            <Link href="/admin/dashboard">
              <button type="button" className="btn-outline-orange">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
