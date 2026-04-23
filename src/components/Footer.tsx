import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 px-8 py-5 flex items-center justify-between mt-16">
      <p className="text-xs text-gray-400">
        © 2026 JobSetu · Made with 🇮🇳 for India
      </p>
      <div className="flex gap-5">
        {["About", "Privacy", "Terms", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {item}
          </Link>
        ))}
      </div>
    </footer>
  );
}
