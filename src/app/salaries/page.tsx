import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const salaryData = [
  {
    role: "Software Engineer",
    category: "IT & Software",
    fresher: "₹4–8 LPA",
    mid: "₹12–22 LPA",
    senior: "₹25–45 LPA",
    topCompanies: ["Google", "Microsoft", "Razorpay", "Flipkart"],
  },
  {
    role: "Product Manager",
    category: "IT & Software",
    fresher: "₹8–14 LPA",
    mid: "₹18–30 LPA",
    senior: "₹35–60 LPA",
    topCompanies: ["Amazon", "Swiggy", "CRED", "Meesho"],
  },
  {
    role: "Data Analyst",
    category: "IT & Software",
    fresher: "₹4–7 LPA",
    mid: "₹10–18 LPA",
    senior: "₹20–35 LPA",
    topCompanies: ["Zomato", "PhonePe", "TCS", "Wipro"],
  },
  {
    role: "UI/UX Designer",
    category: "Design",
    fresher: "₹3–6 LPA",
    mid: "₹8–15 LPA",
    senior: "₹18–30 LPA",
    topCompanies: ["Flipkart", "Swiggy", "Ola", "Meesho"],
  },
  {
    role: "DevOps Engineer",
    category: "IT & Software",
    fresher: "₹5–9 LPA",
    mid: "₹14–24 LPA",
    senior: "₹28–50 LPA",
    topCompanies: ["Infosys", "Wipro", "TCS", "Razorpay"],
  },
  {
    role: "Bank PO / Manager",
    category: "Banking & Finance",
    fresher: "₹3–5 LPA",
    mid: "₹7–12 LPA",
    senior: "₹15–25 LPA",
    topCompanies: ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"],
  },
  {
    role: "Marketing Manager",
    category: "Marketing",
    fresher: "₹3–6 LPA",
    mid: "₹8–16 LPA",
    senior: "₹18–35 LPA",
    topCompanies: ["Swiggy", "Zomato", "Meesho", "CRED"],
  },
  {
    role: "Sales Executive",
    category: "Sales",
    fresher: "₹2–4 LPA",
    mid: "₹6–12 LPA",
    senior: "₹14–25 LPA",
    topCompanies: ["Wipro", "TCS", "HCL", "Infosys"],
  },
];

const cityMultipliers = [
  {
    city: "Bengaluru",
    note: "Highest tech salaries in India",
    multiplier: "1.0x (baseline)",
  },
  {
    city: "Mumbai",
    note: "Strong in finance & media roles",
    multiplier: "0.95x",
  },
  {
    city: "Delhi NCR",
    note: "Competitive across all sectors",
    multiplier: "0.90x",
  },
  { city: "Hyderabad", note: "Growing tech hub", multiplier: "0.88x" },
  {
    city: "Pune",
    note: "Good IT & manufacturing salaries",
    multiplier: "0.85x",
  },
  {
    city: "Chennai",
    note: "Strong automotive & IT sector",
    multiplier: "0.83x",
  },
];

export default function SalariesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">
            Salary Insights for India
          </h1>
          <p className="text-sm text-gray-500">
            Average salary ranges by role and experience level across Indian
            companies
          </p>
        </div>

        {/* Salary table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-12">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                  Role
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                  Fresher (0–2 yrs)
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                  Mid (3–6 yrs)
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                  Senior (7+ yrs)
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                  Top Hiring Companies
                </th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((row, i) => (
                <tr
                  key={row.role}
                  className={`border-b border-gray-100 last:border-none ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{row.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {row.category}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {row.fresher}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#FF6B00" }}
                    >
                      {row.mid}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    {row.senior}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {row.topCompanies.map((c) => (
                        <span
                          key={c}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* City comparison */}
        <div className="mb-10">
          <h2 className="text-base font-semibold mb-4">Salary by City</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cityMultipliers.map((c) => (
              <div
                key={c.city}
                className="border border-gray-200 rounded-xl p-4"
              >
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {c.city}
                </p>
                <p className="text-xs text-gray-400 mb-2">{c.note}</p>
                <p className="text-xs font-medium" style={{ color: "#FF6B00" }}>
                  {c.multiplier}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-700">Note:</strong> These salary ranges
            are indicative estimates based on industry data and may vary
            depending on company size, specific skills, negotiation, and
            location. Always research the specific company and role before
            accepting an offer.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
