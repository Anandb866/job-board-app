import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

const categories = [
  { icon: "💻", name: "IT & Software", count: "42,000" },
  { icon: "🏦", name: "Banking & Finance", count: "18,400" },
  { icon: "🎓", name: "Education", count: "11,200" },
  { icon: "🏥", name: "Healthcare", count: "9,600" },
  { icon: "📦", name: "Logistics", count: "7,800" },
  { icon: "🛒", name: "E-commerce", count: "14,300" },
];

const cities = [
  { flag: "🏙", name: "Bengaluru", count: "28,400" },
  { flag: "🌊", name: "Mumbai", count: "21,100" },
  { flag: "🏛", name: "Delhi NCR", count: "19,800" },
  { flag: "💎", name: "Hyderabad", count: "14,600" },
  { flag: "🌸", name: "Pune", count: "11,200" },
  { flag: "🎭", name: "Chennai", count: "9,400" },
];

const companies = [
  "Infosys",
  "TCS",
  "Wipro",
  "Razorpay",
  "Flipkart",
  "Swiggy",
  "Zomato",
  "HDFC Bank",
  "Meesho",
  "CRED",
  "PhonePe",
  "Ola",
];

const trending = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "Work from Home",
  "Fresher Jobs",
];

// this runs on the server — fetches real jobs from MongoDB
async function getFeaturedJobs() {
  try {
    await connectDB();
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    return JSON.parse(JSON.stringify(jobs));
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredJobs = await getFeaturedJobs();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="px-8 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-800 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-orange-100">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          1.2 Lakh+ new jobs this month across India
        </div>

        <h1 className="font-serif text-5xl leading-tight tracking-tight mb-5 max-w-xl">
          Find your next big{" "}
          <span style={{ color: "#FF6B00" }}>opportunity</span>
          <br />
          across <span style={{ color: "#138808" }}>Bharat</span>
        </h1>

        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
          From IT giants in Bengaluru to fintech startups in Mumbai — browse
          lakhs of verified jobs, apply directly, and get hired faster.
        </p>

        {/* Search — navigates to /jobs page */}
        <form action="/jobs" method="GET">
          <div className="flex max-w-lg border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <input
              name="q"
              className="search-input flex-1"
              type="text"
              placeholder="Role, skill, or company — e.g. React Developer, TCS..."
            />
            <button type="submit" className="btn-orange rounded-none px-6">
              Search →
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <span className="text-xs text-gray-400">Trending:</span>
          {trending.map((t) => (
            <Link key={t} href={`/jobs?q=${encodeURIComponent(t)}`}>
              <span className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-full hover:border-gray-300 cursor-pointer">
                {t}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex gap-7 mt-6">
          <p className="text-xs text-gray-500">
            <strong className="text-gray-900 font-semibold">1.2L+</strong> open
            roles
          </p>
          <p className="text-xs text-gray-500">
            <strong className="text-gray-900 font-semibold">18,000+</strong>{" "}
            companies
          </p>
          <p className="text-xs text-gray-500">
            <strong className="text-gray-900 font-semibold">Free</strong> to
            apply
          </p>
          <p className="text-xs text-gray-500">
            <strong className="text-gray-900 font-semibold">No login</strong> to
            browse
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Categories */}
      <section className="px-8 py-10">
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="text-base font-semibold">Browse by Category</h2>
          <Link
            href="/jobs"
            className="text-xs hover:underline"
            style={{ color: "#FF6B00" }}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/jobs?category=${encodeURIComponent(cat.name)}`}
            >
              <div className="cat-card">
                <div className="text-xl mb-2">{cat.icon}</div>
                <p className="text-xs font-semibold text-gray-800">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.count} jobs</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Featured Jobs — real data from MongoDB */}
      <section className="px-8 py-10">
        <div className="flex justify-between items-baseline mb-2">
          <h2 className="text-base font-semibold">Featured Jobs</h2>
          <Link
            href="/jobs"
            className="text-xs hover:underline"
            style={{ color: "#FF6B00" }}
          >
            View all →
          </Link>
        </div>

        {featuredJobs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">No jobs posted yet.</p>
          </div>
        ) : (
          <div>
            {featuredJobs.map((job: any) => (
              <JobCard
                key={job._id}
                job={{
                  id: job._id,
                  title: job.title,
                  company: job.company,
                  location: job.location,
                  salary: job.salary,
                  exp: job.experience,
                  tags: [job.workMode === "Remote" ? "Remote" : job.jobType],
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
          </div>
        )}
      </section>

      <div className="section-divider" />

      {/* Cities */}
      <section className="px-8 py-10">
        <h2 className="text-base font-semibold mb-5">Top Hiring Cities</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/jobs?city=${encodeURIComponent(city.name)}`}
            >
              <div className="city-card">
                <div className="text-lg mb-1.5">{city.flag}</div>
                <p className="text-xs font-semibold text-gray-800">
                  {city.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {city.count} jobs
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Companies */}
      <section className="px-8 py-10">
        <h2 className="text-base font-semibold mb-5">
          Trusted by India's best companies
        </h2>
        <div className="flex flex-wrap gap-2">
          {companies.map((name) => (
            <span
              key={name}
              className="border border-gray-200 rounded-lg px-4 py-2 text-xs font-semibold text-gray-500"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* How it works */}
      <section className="px-8 py-10">
        <h2 className="text-base font-semibold mb-8">How it works</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              n: "1",
              title: "Search & Filter",
              desc: "Search by role, skill, city, or salary. Filter by experience level, company type, or work mode.",
            },
            {
              n: "2",
              title: "Apply Directly",
              desc: "No middlemen. Apply directly to companies with your resume. Most companies respond within 3 working days.",
            },
            {
              n: "3",
              title: "Get Hired",
              desc: "Track applications, schedule interviews, and land your next role — all from one simple dashboard.",
            },
          ].map((step) => (
            <div key={step.n}>
              <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-xs font-semibold text-orange-700 mb-3">
                {step.n}
              </div>
              <p className="text-sm font-semibold mb-2">{step.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Stats */}
      <section className="px-8 py-10">
        <h2 className="text-base font-semibold mb-5">JobSetu by the numbers</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { n: "1.2L+", label: "Active job listings" },
            { n: "18k+", label: "Companies hiring" },
            { n: "47L+", label: "Registered job seekers" },
            { n: "91%", label: "Application response rate" },
          ].map((s) => (
            <div key={s.n} className="bg-gray-50 rounded-xl p-5">
              <p className="font-serif text-3xl mb-1">{s.n}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-10">
        <div className="rounded-xl bg-orange-50 border border-orange-100 p-8 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl mb-1">
              Hiring? Reach India's best talent.
            </h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Post your job in minutes. Free for startups and SMEs. Trusted by
              Infosys, Razorpay, Swiggy & 18,000+ more companies.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/auth/login">
              <button className="btn-outline-orange">Sign In</button>
            </Link>
            <Link href="/admin/post-job">
              <button className="btn-orange">Post a Job Free</button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
