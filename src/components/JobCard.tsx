import Link from "next/link";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  exp: string;
  tags: string[];
  isNew?: boolean;
  initials: string;
  color: string;
  bg: string;
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="job-row">
        {/* logo */}
        <div
          className="w-10 h-10 rounded-lg border border-gray-100 flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: job.bg, color: job.color }}
        >
          {job.initials}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {job.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {job.company} &middot; {job.location} &middot; {job.exp}
          </p>
        </div>

        {/* right */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-sm font-semibold text-gray-800">
            {job.salary}
          </span>
          <div className="flex gap-1.5">
            {job.isNew && <span className="tag-new">New</span>}
            {job.tags.map((t) => (
              <span
                key={t}
                className={t === "Remote" ? "tag-remote" : "tag-fulltime"}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
