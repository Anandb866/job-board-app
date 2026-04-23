"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const companies = [
  {
    name: "Infosys",
    sector: "IT & Software",
    size: "3,00,000+ employees",
    openRoles: 1240,
    initials: "IN",
    bg: "#FFF3E0",
    color: "#BF4500",
    city: "Bengaluru",
  },
  {
    name: "Tata Consultancy Services",
    sector: "IT & Software",
    size: "6,00,000+ employees",
    openRoles: 2100,
    initials: "TC",
    bg: "#E3F2FD",
    color: "#0D47A1",
    city: "Mumbai",
  },
  {
    name: "Wipro",
    sector: "IT & Software",
    size: "2,50,000+ employees",
    openRoles: 980,
    initials: "WI",
    bg: "#E8F5E9",
    color: "#1B5E20",
    city: "Bengaluru",
  },
  {
    name: "Razorpay",
    sector: "Fintech",
    size: "3,000+ employees",
    openRoles: 87,
    initials: "RZ",
    bg: "#E8F5E9",
    color: "#1B5E20",
    city: "Bengaluru",
  },
  {
    name: "Flipkart",
    sector: "E-commerce",
    size: "30,000+ employees",
    openRoles: 340,
    initials: "FL",
    bg: "#E3F2FD",
    color: "#0D47A1",
    city: "Bengaluru",
  },
  {
    name: "Swiggy",
    sector: "Food Tech",
    size: "5,000+ employees",
    openRoles: 210,
    initials: "SW",
    bg: "#FCE4EC",
    color: "#880E4F",
    city: "Bengaluru",
  },
  {
    name: "Zomato",
    sector: "Food Tech",
    size: "4,000+ employees",
    openRoles: 175,
    initials: "ZO",
    bg: "#F3E5F5",
    color: "#4A148C",
    city: "Gurugram",
  },
  {
    name: "PhonePe",
    sector: "Fintech",
    size: "4,500+ employees",
    openRoles: 130,
    initials: "PP",
    bg: "#E8F5E9",
    color: "#1B5E20",
    city: "Bengaluru",
  },
  {
    name: "HDFC Bank",
    sector: "Banking & Finance",
    size: "1,80,000+ employees",
    openRoles: 890,
    initials: "HD",
    bg: "#E3F2FD",
    color: "#0D47A1",
    city: "Mumbai",
  },
  {
    name: "CRED",
    sector: "Fintech",
    size: "1,500+ employees",
    openRoles: 64,
    initials: "CR",
    bg: "#FFF3E0",
    color: "#BF4500",
    city: "Bengaluru",
  },
  {
    name: "Meesho",
    sector: "E-commerce",
    size: "3,000+ employees",
    openRoles: 95,
    initials: "ME",
    bg: "#FCE4EC",
    color: "#880E4F",
    city: "Bengaluru",
  },
  {
    name: "Ola",
    sector: "Transport Tech",
    size: "10,000+ employees",
    openRoles: 220,
    initials: "OL",
    bg: "#F3E5F5",
    color: "#4A148C",
    city: "Bengaluru",
  },
];

const sectors = [
  "All",
  "IT & Software",
  "Fintech",
  "E-commerce",
  "Food Tech",
  "Banking & Finance",
  "Transport Tech",
];

export default function CompaniesPage() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? companies : companies.filter((c) => c.sector === active);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">
            Top Companies Hiring in India
          </h1>
          <p className="text-sm text-gray-500">
            Explore India's leading employers and their open roles
          </p>
        </div>

        {/* Sector filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
                active === s
                  ? "border-orange-400 text-orange-600 bg-orange-50 font-medium"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Companies grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((co) => (
            <Link key={co.name} href={`/jobs?q=${encodeURIComponent(co.name)}`}>
              <div className="border border-gray-200 rounded-xl p-5 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: co.bg, color: co.color }}
                  >
                    {co.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {co.name}
                    </p>
                    <p className="text-xs text-gray-400">{co.sector}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">📍 {co.city}</p>
                    <p className="text-xs text-gray-400">{co.size}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-lg font-serif font-medium"
                      style={{ color: "#FF6B00" }}
                    >
                      {co.openRoles}
                    </p>
                    <p className="text-xs text-gray-400">open roles</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              No companies found for this sector.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
