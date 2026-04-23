"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";

const cities = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Pune",
  "Chennai",
];
const categories = [
  "IT & Software",
  "Banking & Finance",
  "Education",
  "Healthcare",
  "Logistics",
  "E-commerce",
];
const workModes = ["On-site", "Remote", "Hybrid"];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const category = searchParams.get("category") || "";
  const workMode = searchParams.get("workMode") || "";
  const page = parseInt(searchParams.get("page") || "1");

  // fetch jobs whenever url params change
  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (city) params.set("city", city);
      if (category) params.set("category", category);
      if (workMode) params.set("workMode", workMode);
      params.set("page", String(page));

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    }
    load();
  }, [q, city, category, workMode, page]);

  // debounce — wait 400ms after user stops typing, then update URL
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("page");
      router.push(`/jobs?${params.toString()}`);
    }, 400),
    [searchParams],
  );

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  }

  function clearFilters() {
    setInputValue("");
    router.push("/jobs");
  }

  const hasFilters = q || city || category || workMode;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="px-8 py-8 max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex flex-1 border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-2xl relative">
            <input
              className="search-input flex-1"
              type="text"
              value={inputValue}
              onChange={handleSearchInput}
              placeholder="Job title, skill, or company..."
              autoFocus
            />
            {/* loading spinner inside search box */}
            {loading && inputValue && (
              <div className="absolute right-20 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              </div>
            )}
            <button
              className="btn-orange rounded-none px-6"
              onClick={() => debouncedSearch(inputValue)}
            >
              Search →
            </button>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-gray-600 px-4"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="w-56 shrink-0">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                City
              </p>
              <div className="space-y-1.5">
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateFilter("city", city === c ? "" : c)}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      city === c
                        ? "bg-orange-50 text-orange-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Category
              </p>
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      updateFilter("category", category === c ? "" : c)
                    }
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      category === c
                        ? "bg-orange-50 text-orange-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Work Mode
              </p>
              <div className="space-y-1.5">
                {workModes.map((m) => (
                  <button
                    key={m}
                    onClick={() =>
                      updateFilter("workMode", workMode === m ? "" : m)
                    }
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      workMode === m
                        ? "bg-orange-50 text-orange-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Job list */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                {loading ? "Searching..." : `${total} jobs found`}
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-50 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-gray-500 text-sm">
                  No jobs found. Try different filters.
                </p>
              </div>
            ) : (
              <>
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={{
                      id: job._id,
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      salary: job.salary,
                      exp: job.experience,
                      tags: [
                        job.workMode === "Remote" ? "Remote" : job.jobType,
                      ],
                      isNew:
                        new Date(job.createdAt) >
                        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                      initials:
                        job.initials || job.company.slice(0, 2).toUpperCase(),
                      color: job.color || "#1a1a1a",
                      bg: job.bg || "#f3f4f6",
                    }}
                  />
                ))}

                {totalPages > 1 && (
                  <div className="flex gap-2 mt-8 justify-center">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateFilter("page", String(i + 1))}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          page === i + 1
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
