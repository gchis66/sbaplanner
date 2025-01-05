"use client";

export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 mr-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized chart/growth icon */}
          <path
            d="M3 3v18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 14l4-4 4 4 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 9h2v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">SBA Planner</span>
      </div>
    </div>
  );
}
